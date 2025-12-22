'use server'


import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { logActivity } from "./logs";
import { createNotification } from "./notifications";
import {  OrderItemWithStockItems } from "@/types/types";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "./auditLogs";
import { Prisma } from "@/generated/prisma";

export async function createDelivery({  orderId, deliveryDate, deliveryTime,notes, items}:{  orderId: string; deliveryDate: string; deliveryTime: string; notes: string; items: { itemId: string;
     deliveredQty: number;
}[]}) {
    const session = await auth()
    
    if (!session?.user.supplierId) redirect("/login");

    if (items.length === 0) return {success:false, message: "No delivery items"}

    try {
        const scheduledAt = new Date(`${deliveryDate}T${deliveryTime}`)
        const {delivery, updatedOrder} = await db.$transaction(async (tx) => {
            const [delivery, updatedOrder] = await Promise.all([
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
                                        stockItem: true
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
                        supplier: true
                        ,Service: true
                    }
                }),

                
            ])

            return {delivery, updatedOrder}
        })


        await logActivity(
            updatedOrder.serviceId,
            updatedOrder.supplierId,
            "CREATE",
            "Delivery",
            orderId,
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

        await createAuditLog({
                    action: "CREATE",
                    entityType: "Delivery",
                    entityId: updatedOrder.supplierId,
                    entityName: updatedOrder.supplier?.businessName || "Supplier",
                    details: {
                        metadata: {
                            orderId,
                            deliveryId: delivery.id,
                            deliveredAt: delivery.deliveredAt?.toDateString() ?? ""
                        }
                    }
                });

        return {success: true, delivery, updatedOrder};

    } catch (error) {
        console.error("Error creating delivery:", error);
        await createAuditLog({
                    action: "ERROR",
                    entityType: "Order",
                    entityId: orderId,
                    entityName: "Supplier",
                    details: {
                        metadata: {
                            orderId,
                            error: (error as string).toString() || "Error creeating delivery for the order"
                        }
                    }
                });
        return { success: false, error: "Failed to create delivery" };
    }
}

export async function completeDelivery({serviceId, deliveryId, orderId}:{serviceId:string, deliveryId:string, orderId:string}) {
  const session = await auth()
    
    if (!session?.user) redirect("/login");

    try {
        const { delivery,  order } =  await db.$transaction(async (tx) => {
            // Update delivery, supplierOrder and order 
            const [delivery,  order] = await Promise.all([
                tx.delivery.update({
                    where: {
                        id: deliveryId,
                    },
                    data: {
                        status: "COMPLETED",
                        deliveredAt: new Date(),
                        accepted: true,
                    },
                    include: {
                        deliveryItems: {
                            include: {
                                orderItem: {
                                    include: {
                                        stockItem: true,
                                        serviceStockItem: {
                                            include: {
                                                stockItem: {
                                                    include: {
                                                        unit: true
                                                    }
                                                }
                                            }
                                        },
                                    }
                                },
                            }
                        }
                    }
                }),
                
                tx.order.update({
                    where: {
                        id: orderId,
                    },
                    data: {
                        status: "DELIVERED",
                    },
                    include: {
                        Service: true,
                        supplier: true,
                    }
                })
            ])

            //Handle stock updates

            const updatedItems =  await Promise.all(delivery.deliveryItems.map(async (deliveryItem) => {
                const supplierStockItem = deliveryItem.orderItem.stockItem;
                const quantity = deliveryItem.quantity;


                 await tx.stockItem.update({
                    where: {
                        id: supplierStockItem.id,
                    }, 
                    data: {
                        stock: {
                            decrement: quantity,
                        }
                    },
                    include: {
                        unit: true
                    }
                });

                await tx.stockMovement.create({
                    data: {
                        stockItemId: supplierStockItem.id,
                        changeType: "SALE",
                        quantity,
                        referenceId: deliveryItem.id,
                        notes: `Delivery #${delivery.id.slice(0,8)}... completed, deducted from supplier stock`,
                    }
                })

                let serviceStockItem:
                    | Prisma.ServiceStockItemGetPayload<{
                        include: {
                            stockItem: {
                                include: {
                                    unit: true;
                                };
                            };
                        };
                        }>
                    | null = deliveryItem.orderItem.serviceStockItem;

                if (!serviceStockItem) {
                    serviceStockItem = await tx.serviceStockItem.findFirst({
                        where: {
                            serviceId,
                            stockItem: {
                                name: supplierStockItem.name
                            }
                        },
                        include: {
                            stockItem: {
                                include: {
                                    unit: true
                                }
                            }
                        }
                    });
                } else {
                    serviceStockItem = await tx.serviceStockItem.findUnique({
                        where: {
                            id: serviceStockItem.id,
                        },
                        include: {
                            stockItem: {
                                include: {
                                    unit: true
                                }
                            }
                        }
                    });
                }

                const updateData: Prisma.ServiceStockItemUpdateInput = {
                    cost: supplierStockItem.price,
                    stock: {
                        increment: quantity,
                    }
                }

                if (serviceStockItem?.stockItem.unit?.name === "unit") {
                    // updateData.stock = {
                    //     increment: quantity,
                    // };
                    updateData.stockQty = {
                        increment: quantity,
                    };
                } else {
                    // updateData.stock = {
                    //     increment: quantity,
                    // };
                    updateData.stockQty = {
                        increment: quantity * supplierStockItem.unitQty,
                    };
                }



                if (serviceStockItem) {
                    await tx.serviceStockItem.update({
                        where: {
                            id: serviceStockItem.id,
                        },
                        data: updateData
                    })

                    await tx.stockMovement.create({
                        data: {
                            stockItemId: serviceStockItem?.stockItemId,
                            changeType: "PURCHASE",
                            quantity,
                            referenceId: deliveryItem.id,
                            notes: `Delivery #${delivery.id.slice(0,8)}... completed, added to service stock`,
                        }
                    });
                } else {
                    const directSupplier = await tx.supplier.findFirst({
                        where: {
                            businessName:  "DirectPurchase"    
                        }
                    });
                        if (!directSupplier) {
                            throw new Error("DirectPurchase supplier not found");
                        }

                    let directStockItem = await tx.stockItem.findFirst({
                        where: {
                            name: supplierStockItem.name,
                        },
                        include: {
                            unit: true
                        }
                    });

                    if (!directStockItem) {
                        directStockItem = await tx.stockItem.create({
                            data: {
                                name: supplierStockItem.name,
                                description: supplierStockItem.description,
                                price: supplierStockItem.price,
                                unitId: supplierStockItem.unitId,
                                supplierId: directSupplier.id,
                                stock: 0,
                                status: "ACTIVE",
                                unitQty: supplierStockItem.unitQty,
                            },
                            include: {
                                unit: true
                            }
                        });
                    }

                     await tx.serviceStockItem.create({
                        data: {
                            // stock: quantity,
                            cost: supplierStockItem.price,
                            stockItemId: directStockItem.id,
                            serviceId,
                            ...(directStockItem.unit?.name === "unit"
                                ? { stock: quantity, stockQty: quantity }
                                : { stock: quantity, stockQty: quantity * supplierStockItem.unitQty }
                            )
                        },
                        include: {
                            stockItem: {
                                include: {
                                    unit: true
                                }
                            }
                        }
                        
                    })


                    await tx.stockMovement.create({
                        data: {
                            stockItemId: directStockItem?.id,
                            changeType: "PURCHASE",
                            quantity,
                            referenceId: deliveryItem.id,
                            notes: `Delivery #${delivery.id.slice(0,8)}... completed, added to service stock`,
                        }
                    });
                } 
                

                // return { serviceId, supplierId: updatedStockItem.supplierId, deliveryId}
            }));
            console.log(updatedItems)
            // Create Sale + purchase with their items
            const total = delivery.deliveryItems.reduce((sum, item) => sum + item.orderItem.price * item.quantity, 0);

            const supplierSale = await tx.sale.create({
                data: {
                    supplierId: order.supplierId,
                    total,
                    cogs: 0,
                    paymentType: "CASH",
                    SaleItem: {
                        create: delivery.deliveryItems.map((item) => ({
                            stockItemId: item.orderItem.stockItemId,
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
                            stockItemId: item.orderItem.stockItemId,
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

            return { delivery,  order, supplierSale, servicePurchase};

        }, { timeout: 20000});

        logActivity(
            serviceId,
            order.supplierId,
            "DELIVERY_CONFIRMED",
            "Delivery",
            delivery.id,
            `Delivery marked as Completed`,
            {
                deliveryId,
                orderId,
                totalItems: delivery.deliveryItems.length,
                deliveryItems: delivery.deliveryItems,
                
            },
            null,
            'INFO',
            null
        )

        await createNotification({
            userId: order.supplier.userId ?? "",
            type: "DELIVERY",
            title: "Delivery Confirmed",
            message: `${order.Service?.businessName} confirmed delivery!`,
            link: `/supply/orders/${orderId}`
        })

        await createAuditLog({
                    action: "UPDATE",
                    entityType: "Delivery",
                    entityId: serviceId,
                    entityName: order.Service?.businessName || "Service",
                    details: {
                        metadata: {
                            orderId,
                            deliveryId,
                            deliveredAt: delivery.deliveredAt?.toDateString() ?? ""
                        }
                    }
                });

        revalidatePath(`/supply/orders/delivery/${deliveryId}`)
        revalidatePath(`/supply/orders/${orderId}`)
        revalidatePath(`/supply/orders`)

        return { success: true, delivery, order };
        
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
                orderId,
                error: error instanceof Error ? error.message : String(error),
            },
            null,
            'ERROR',
            null
        )
            
        await createAuditLog({
                    action: "ERROR",
                    entityType: "Delivery",
                    entityId: deliveryId,
                    entityName: "",
                    details: {
                        metadata: {
                            orderId,
                            error: (error as string).toString() || "Error updating delivery for the order"
                        }
                    }
                });

        return {success: false, error: "Error confirming delivery"}
    }
}

export async function arrivedDelivery(orderId: string, deliveryId: string,) {
    const session = await auth()
    if (!session?.user) redirect("/login");

    try {
        const [order, delivery] = await Promise.all([
            db.order.update({
                where: { id: orderId },
                data: {
                    status: "IN_DELIVERY",
                },
                include: {
                    Service: true,
                    supplier: true
                }
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
            
        ])

        await logActivity(
            null,
            order.supplierId,
            "DELIVERY_ARRIVED",
            "Delivery",
            delivery.id,
            `Delivery marked as Arrived by Supplier`,
            {
                
                deliveryId,
                orderId,
                deliveredAt: delivery.deliveredAt,
            },
            null,
            "INFO",
            null
        )

        await createNotification({
            userId: order.Service?.userId ?? "",
            type: "DELIVERY",
            title: "Delivery Arrived",
            message: `${order.supplier?.businessName} awaiting confirmation!`,
            link: `/service/purchases/orders/${order.id}`
        })

        await createAuditLog({
                    action: "UPDATE",
                    entityType: "Delivery",
                    entityId: order.supplierId,
                    entityName: order.supplier.businessName,
                    details: {
                        metadata: {
                            orderId,
                            deliveryId
                        }
                    }
                });

        return { success: true, order, delivery };
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
                orderId,
                error: error instanceof Error ? error.message : String(error),
            },
            null,
            'ERROR',
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
        await createAuditLog({
            action: "ERROR",
            entityType: "Delivery",
            entityId: deliveryId,
            entityName: "",
            details: {
                metadata: {
                    star: star.toString(),
                    error: (error as string).toString() || "Error rating delivery for the order"
                }
            }
        });
        return {success: false, message: "Error rating delivery", error}
    }

}


export async function createNewDelivery({ orderId, deliveryDate, deliveryTime,notes, items}:{  orderId: string; deliveryDate: string; deliveryTime: string; notes: string; items: OrderItemWithStockItems[]}) {

    const session = await auth()
    if (!session?.user.supplierId) redirect("/login");

    if (items.length === 0) 
        return { success: false, error: "No delivery items"};

    try {
        const scheduledAt = new Date(`${deliveryDate}T${deliveryTime}`);

        const {delivery, updatedOrder,  } = await db.$transaction(
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
                                orderItemId: i.id,
                                quantity: i.orderedQty,
                            }))
                        }
                    },
                    include: {
                        deliveryItems: {
                            include: {
                                orderItem: true
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
                        Service: true,
                        supplier: true,
                    }
                });


                return { delivery, updatedOrder}
            }, 
            { timeout: 15000 }
        );

        await logActivity(
            updatedOrder.serviceId,
            session.user.supplierId,
            "CREATE",
            "Delivery",
            orderId,
            `Scheduled delivery for Order`,
            {
                orderId,
                scheduledAt: delivery.scheduledAt,
                totalItems: items.length,
                items,
            },
            null,
            'INFO',
            null
        );

        await createNotification({
            userId: updatedOrder.Service?.userId ?? "",
            type: "DELIVERY",
            title: "New Delivery Scheduled",
            message: `${updatedOrder.supplier?.businessName} scheduled a delivery`,
            link: `/service/purchases/orders/${updatedOrder.id}`}
        )

        await createAuditLog({
                    action: "CREATE",
                    entityType: "Delivery",
                    entityId: orderId,
                    entityName: "Order",
                    details: {
                        metadata: {
                            notes,
                            deliveryDate
                        }
                    }
                });

        return {success: true, delivery, updatedOrder};


    } catch (error) {
        console.error("Error creating delivery: ", error);
        await logActivity(
            null,
            session.user.id,
            "ERROR",
            "Order",
            orderId,
            `Error while creating delivery`,
            {
                orderId,
                error: error instanceof Error ? error.message : String(error),
            },
            null,
            'ERROR',
            null
        )
        await createAuditLog({
                    action: "ERROR",
                    entityType: "Order",
                    entityId: orderId,
                    entityName: "",
                    details: {
                        metadata: {
                            error: (error as string).toString() || "Error creating delivery for the order"
                        }
                    }
                });
        return {success: false, error: "Failed to create delivery"}
    }

}