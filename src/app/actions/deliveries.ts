'use server'


import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { logActivity } from "./logs";

export async function createDelivery({ orderId, deliveryDate, deliveryTime,notes, items}:{ orderId: string; deliveryDate: string; deliveryTime: string; notes: string; items: { itemId: string;
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
                status: "SCHEDULED",
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

        await logActivity(
            updatedOrder.serviceId,
            session.user.id,
            "CREATE",
            "Delivery",
            updatedOrder.id,
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




export async function completeDelivery({deliveryId, orderId, supplierOrderId}:{deliveryId:string, orderId:string, supplierOrderId: string}) {
  const session = await getServerSession(authOptions);
    
    if (!session?.user) redirect("/login");

    try {
        return await db.$transaction(async (tx) => {
            const [delivery, supplierOrder, order] = await Promise.all([
                tx.delivery.update({
                    where: {
                        id: deliveryId,
                    },
                    data: {
                        status: "COMPLETED",
                    },
                    include: {
                        deliveryItems: {
                            include: {
                                orderItem: {
                                    include: {
                                        product: true,
                                        supplierOrder: {
                                            include: {
                                                order: {
                                                    include: {
                                                        Service: true,
                                                    }
                                                }
                                            }
                                        }
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

            for (const deliveryItem of delivery.deliveryItems) {
                const orderItem = deliveryItem.orderItem;
                const supplierProduct = orderItem.product;
                // const supplierId = orderItem.supplierOrder.supplierId;
                const service = orderItem.supplierOrder.order.Service;
                const quantity = deliveryItem.quantity;

                if (!service) continue;

                const updatedSupplierOrder = await tx.supplierProduct.update({
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
                        serviceId: service.id,
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
                            serviceId: service.id,
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
                })

                await logActivity(
                    service.id,
                    updatedSupplierOrder.supplierId,
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
            }

            return { success: true, delivery, supplierOrder, order };
        })
        // const delivery = await db.delivery.update({
        //     where: {
        //         id: deliveryId,
        //     },
        //     data: {
        //         status: "COMPLETED",
        //     }})
        // const suppplierOrder = await db.supplierOrder.update({
        //     where: {
        //         id: supplierOrderId,
        //     },
        //     data: {
        //         status: "COMPLETED",
        //     }
        // })
        // const order = await db.order.update({
        //     where: {
        //         id: orderId,
        //     },
        //     data: {
        //         status: "DELIVERED",
        //     }
        // })

        // return {success: true, delivery, order, suppplierOrder};
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
