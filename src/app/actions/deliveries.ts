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
    
    if (!session?.user) redirect("/login");

    if (items.length === 0) return {success:false, message: "No delivery items"}

    try {
        const scheduledAt = new Date(`${deliveryDate}T${deliveryTime}`)
        const delivery = await db.delivery.create({
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
                deliveryItems: true,
            }
        })
        const updatedOrder = await db.order.update({
            where: {
                id: orderId
            },
            data: {
                status: "IN_DELIVERY"
            },
            include: {
                supplierOrders: true
            }
        })

        await db.supplierOrder.update({
            where: {
                id: supplierOrderId
            },
            data: {
                status: "IN_PREPARATION"
            }
        })

        await logActivity(
            updatedOrder.serviceId,
            session.user.id,
            "CREATE",
            "Delivery",
            supplierOrderId,
            `Scheduled delivery for Order #${updatedOrder.id.slice(0,6)}...`,
            {
                scheduledAt: delivery.scheduledAt,
                totalItems: items.length,
                items
            },
            null,
            'INFO',
            null
        );

        return {success: true, delivery};

    } catch (error) {
        console.error("Error creating delivery:", error);
        throw new Error("Failed to create delivery");
    }
}

export async function completeDelivery({serviceId, deliveryId, orderId, supplierOrderId}:{serviceId:string, deliveryId:string, orderId:string, supplierOrderId: string}) {
  const session = await getServerSession(authOptions);
    
    if (!session?.user) redirect("/login");

    try {
        const { delivery, supplierOrder, order, updatedProducts } =  await db.$transaction(async (tx) => {
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

            return { delivery, supplierOrder, order, updatedProducts};

        }, { timeout: 20000});

        await Promise.all(updatedProducts.filter(Boolean).map( p => logActivity(
                    p.serviceId,
                    p.supplierId,
                    "DELIVERY_CONFIRMED",
                    "Delivery",
                    delivery.id,
                    `Delivery #${delivery.id} marked as Completed`,
                    {
                        deliveryId,
                        orderId,
                        supplierOrderId,
                        totalItems: delivery.deliveryItems.length,
                        deliveryItems: delivery.deliveryItems
                    },
                    null,
                    'INFO',
                    null
                )
            ))
            

            return { success: true, delivery, supplierOrder, order };
        
    } catch (error) {
        console.error("Error completing delivery:", error);
        await logActivity(
            null,
            null,
                    "DELIVERY_Error",
                    "Delivery",
                    deliveryId,
                    `Error while completing delivery #${deliveryId}`,
                    {
                        error: error instanceof Error ? error.message : String(error),
                    },
                    null,
                    'INFO',
                    null
                )
        throw new Error("Failed to complete delivery");
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
                include: {
                    deliveryItems: true,
                }
            }),
            db.supplierOrder.update({
                where: {
                    id: supplierOrderId},
                data: {
                    status: "COMPLETED",
                }
            })
        ])

        await logActivity(
            null,
            supplierOrder.supplierId,
            "DELIVERY_ARRIVED",
            "Delivery",
            delivery.id,
            `Delivery #${delivery.id} marked as Arrived by Supplier`,
            {
                
                deliveryId,
                supplierOrderId,
                deliveredAt: delivery.deliveredAt,
                items: delivery.deliveryItems
            },
            null,
            "INFO",
            null
        )

        return { success: true, order, delivery, supplierOrder };
    } catch (error) {
        console.error("Error marking delivery as arrived:", error);
        throw new Error("Failed to mark delivery as arrived");
    }
}