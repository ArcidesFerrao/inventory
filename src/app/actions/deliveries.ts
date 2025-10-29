'use server'


import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { logActivity } from "./logs";

export async function createDelivery({ supplierOrderId, orderId, deliveryDate, deliveryTime,notes, items}:{ supplierOrderId: string; orderId: string; deliveryDate: string; deliveryTime: string; notes: string; items: { itemId: string;
     deliveredQty: number;
}[]}) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user.supplierId) redirect("/login");

    if (items.length === 0) return {success:false, message: "No delivery items"}

    try {
        const scheduledAt = new Date(`${deliveryDate}T${deliveryTime}`)
        const {delivery, updatedOrder} = await db.$transaction(async (tx) => {
            const [delivery, updatedOrder, updatedSupplierOrder] = await Promise.all([
                tx.delivery.create({
                    data: {
                        orderId,
                        status: "PENDING",
                        scheduledAt,
                        deliveredAt: null,
                        notes,
                        deliveryItems: {
                            create: items.map((i) => ({
                                orderItemId: i.itemId,
                                quantity: i.deliveredQty,
                            }))
                        }
                    },
                    include: {
                        deliveryItems: {
                            include: {
                                orderItem: {
                                    include: {
                                        product: true
                                    }
                                }
                            }
                        },
                    }
                }),

                tx.order.update({
                    where: {
                        id: orderId
                    },
                    data: {
                        status: "IN_PREPARATION"
                    },
                    include: {
                        supplierOrders: true
                    }
                }),

                tx.supplierOrder.update({
                    where: {
                        id: supplierOrderId
                    },
                    data: {
                        status: "IN_PREPARATION"
                    }
                })
            ])

            return {delivery, updatedOrder, updatedSupplierOrder}
        })


        await logActivity(
            updatedOrder.serviceId,
            session.user.supplierId,
            "CREATE",
            "Delivery",
            supplierOrderId,
            `Scheduled delivery for Order`,
            {
                orderId,
                scheduledAt: delivery.scheduledAt,
                totalItems: items.length,
                items: delivery.deliveryItems,
            },
            null,
            'INFO',
            null
        );

        return {success: true, delivery, updatedOrder};

    } catch (error) {
        console.error("Error creating delivery:", error);
        return { success: false, error: "Failed to create delivery" };
    }
}

export async function completeDelivery({serviceId, deliveryId, orderId, supplierOrderId}:{serviceId:string, deliveryId:string, orderId:string, supplierOrderId: string}) {
  const session = await getServerSession(authOptions);
    
    if (!session?.user) redirect("/login");

    try {
        const { delivery, supplierOrder, order } =  await db.$transaction(async (tx) => {
            // Update delivery, supplierOrder and order 
            const [delivery, supplierOrder, order] = await Promise.all([
                tx.delivery.update({
                    where: {
                        id: deliveryId,
                    },
                    data: {
                        status: "COMPLETED",
                        deliveredAt: new Date(),
                    },
                    include: {
                        deliveryItems: {
                            include: {
                                orderItem: {
                                    include: {
                                        product: true,
                                    }
                                }
                            }
                        }
                    }
                }),
                tx.supplierOrder.update({
                    where: {
                        id: supplierOrderId,
                    }, 
                    data: {
                        status: "COMPLETED",
                    }
                }),
                tx.order.update({
                    where: {
                        id: orderId,
                    },
                    data: {
                        status: "DELIVERED",
                    },
                })
            ])

            //Handle stock updates

            const updatedProducts = await Promise.all(delivery.deliveryItems.map(async (deliveryItem) => {
                const supplierProduct = deliveryItem.orderItem.product;
                const quantity = deliveryItem.quantity;


                const updatedSupplierProduct = await tx.supplierProduct.update({
                    where: {
                        id: supplierProduct.id,
                    }, 
                    data: {
                        stock: {
                            decrement: quantity,
                        }
                    }
                });

                await tx.stockMovement.create({
                    data: {
                        supplierProductId: supplierProduct.id,
                        changeType: "SALE",
                        quantity,
                        referenceId: deliveryItem.id,
                        notes: `Delivery #${delivery.id.slice(0,8)}... completed, deducted from supplier stock`,
                    }
                })

                let serviceProduct = await tx.product.findFirst({
                    where: {
                        serviceId,
                        name: {
                            equals: supplierProduct.name,
                            mode: "insensitive",
                        }
                    }
                });

                if (serviceProduct) {
                    await tx.product.update({
                        where: {
                            id: serviceProduct.id,
                        },
                        data: {
                            price: supplierProduct.price,
                            stock: {
                                increment: quantity,
                            }
                        }
                    })
                } else {
                    serviceProduct = await tx.product.create({
                        data: {
                            name: supplierProduct.name,
                            description: supplierProduct.description,
                            unitQty: supplierProduct.unitQty,
                            unitId: supplierProduct.unitId,
                            stock: quantity,
                            serviceId,
                            price: supplierProduct.price,
                        }
                    })
                } 
                
                await tx.stockMovement.create({
                    data: {
                        productId: serviceProduct?.id,
                        changeType: "PURCHASE",
                        quantity,
                        referenceId: deliveryItem.id,
                        notes: `Delivery #${delivery.id.slice(0,8)}... completed, added to service stock`,
                    }
                });

                return { serviceId, supplierId: updatedSupplierProduct.supplierId, deliveryId}
            }));

            // Create Sale + purchase with their items
            const total = delivery.deliveryItems.reduce((sum, item) => sum + item.orderItem.price * item.quantity, 0);

            const supplierSale = await tx.sale.create({
                data: {
                    supplierId: supplierOrder.supplierId,
                    total,
                    cogs: 0,
                    paymentType: "CASH",
                    SaleItem: {
                        create: delivery.deliveryItems.map((item) => ({
                            supplierProductId: item.orderItem.supplierProductId,
                            // productId: item.orderItem.product.id,
                            quantity: item.quantity,
                            price: item.orderItem.price
                        }))
                    }
                }
            })

            const servicePurchase = await tx.purchase.create({
                data: {
                    serviceId,
                    total,
                    paymentType: "CASH",
                    sourceType: "ORDER",
                    sourceId: orderId,
                    PurchaseItem: {
                        create: delivery.deliveryItems.map((item) => ({
                            supplierProductId: item.orderItem.supplierProductId,
                            // productId: item.orderItem.product.id,
                            stock: item.quantity,
                            price: item.orderItem.price,
                            quantity: item.quantity,
                            totalCost: item.orderItem.price * item.quantity
                        }))
                    }
                },
                include: {
                    PurchaseItem: true,
                }
            })

            return { delivery, supplierOrder, order, updatedProducts, supplierSale, servicePurchase};

        }, { timeout: 20000});

        logActivity(
            serviceId,
            supplierOrder.supplierId,
            "DELIVERY_CONFIRMED",
            "Delivery",
            delivery.id,
            `Delivery marked as Completed`,
            {
                deliveryId,
                orderId,
                supplierOrderId,
                totalItems: delivery.deliveryItems.length,
                deliveryItems: delivery.deliveryItems,
                
            },
            null,
            'INFO',
            null
        )

        return { success: true, delivery, supplierOrder, order };
        
    } catch (error) {
        console.error("Error completing delivery:", error);
        await logActivity(
            serviceId,
            null,
            "ERROR",
            "Delivery",
            deliveryId,
            `Error while completing delivery`,
            {
                serviceId,
                supplierOrderId,
                error: error instanceof Error ? error.message : String(error),
            },
            null,
            'INFO',
            null
        )
            
        return {success: false, error: "Error confirming delivery"}
    }
}

export async function arrivedDelivery(orderId: string, deliveryId: string, supplierOrderId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    try {
        const [order, delivery, supplierOrder] = await Promise.all([
            db.order.update({
                where: { id: orderId },
                data: {
                    status: "IN_DELIVERY",
                },
            }),
            db.delivery.update({
                where: {
                    id: deliveryId
                },
                data: {
                    status: "ARRIVED",
                    deliveredAt: new Date(),
                },
                
            }),
            db.supplierOrder.update({
                where: {
                    id: supplierOrderId},
                data: {
                    status: "COMPLETED",
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            })
        ])

        await logActivity(
            null,
            supplierOrder.supplierId,
            "DELIVERY_ARRIVED",
            "Delivery",
            delivery.id,
            `Delivery marked as Arrived by Supplier`,
            {
                
                deliveryId,
                supplierOrderId,
                deliveredAt: delivery.deliveredAt,
                deliveryItems: supplierOrder.items
            },
            null,
            "INFO",
            null
        )

        return { success: true, order, delivery, supplierOrder };
    } catch (error) {
        console.error("Error marking delivery as arrived:", error);
        await logActivity(
            null,
            session.user.id,
            "ERROR",
            "Delivery",
            deliveryId,
            `Error while completing delivery`,
            {
                supplierOrderId,
                error: error instanceof Error ? error.message : String(error),
            },
            null,
            'INFO',
            null
        )
            // throw new Error("Failed to mark delivery as arrived");
        return {success: false, error: "Error marking delivery as arrived"}
    }
}

export async function  rateDelivery(deliveryId: string, star: number) {
    
    try {

        const ratedDelivery = await db.delivery.update({
            where: {
                id: deliveryId
            },
            data: {
                rating: star
            }
        })
        return {success: true, ratedDelivery}
    } catch (error) {
        return {success: false, message: "Error rating delivery", error}
    }

}


export async function createNewDelivery({ supplierOrderId, orderId, deliveryDate, deliveryTime,notes, items}:{ supplierOrderId: string; orderId: string; deliveryDate: string; deliveryTime: string; notes: string; items: { itemId: string;
     deliveredQty: number;
}[]}) {


    const session = await getServerSession(authOptions);
    if (!session?.user.supplierId) redirect("/login");

    if (items.length === 0) 
        return { success: false, error: "No delivery items"};

    try {
        const scheduledAt = new Date(`${deliveryDate}T${deliveryTime}`);

        const {delivery, updatedOrder, updatedSupplierOrder } = await db.$transaction(
            async (tx) => {
                const delivery = await tx.delivery.create({
                    data: {
                        orderId,
                        status: "PENDING",
                        scheduledAt,
                        deliveredAt: null,
                        notes,
                        deliveryItems: {
                            create: items.map((i) => ({
                                orderItemId: i.itemId,
                                quantity: i.deliveredQty,
                            }))
                        }
                    },
                    include: {
                        deliveryItems: {
                            include: {
                                orderItem: {
                                    include: {
                                        product: true,
                                    }
                                }
                            }
                        }
                    }
                });

                const updatedOrder = await tx.order.update({
                    where: {
                        id: orderId
                    },
                    data: {
                        status: "IN_PREPARATION",
                    },
                    include: {
                        supplierOrders: true,
                    }
                });

                const updatedSupplierOrder = await tx.supplierOrder.update({
                    where :{
                        id: supplierOrderId,
                    },
                    data: {
                        status: "IN_PREPARATION"
                    }
                });

                return { delivery, updatedOrder, updatedSupplierOrder}
            }, 
            { timeout: 15000 }
        );

        await logActivity(
            updatedOrder.serviceId,
            session.user.supplierId,
            "CREATE",
            "Delivery",
            supplierOrderId,
            `Scheduled delivery for Order`,
            {
                orderId,
                scheduledAt: delivery.scheduledAt,
                totalItems: items.length,
                items: delivery.deliveryItems,
            },
            null,
            'INFO',
            null
        );

        return {success: true, delivery, updatedOrder, updatedSupplierOrder};


    } catch (error) {
        console.error("Error creating delivery: ", error);
        return {success: false, error: "Failed to create delivery"}
    }

}