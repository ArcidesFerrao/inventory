"use server";

import { db } from "@/lib/db";
import { logActivity } from "./logs";
import { redirect } from "next/navigation";
import { auth} from "@/lib/auth";
import { createNotification } from "./notifications";
import { StockItem } from "@/generated/prisma/client";


// type GroupedItems = {
//     supplierId: string;
//     items: {
//         itemId: string;
//         name: string;
//         price: number;
//         quantity: number;
//     }[]
// }[];
// type Items = {
//         id: string;
//         name: string;
//         price: number;
//         quantity: number;
// }[];

export async function createOrder(
    items: (StockItem & {
        quantity: number
    })[], 
    serviceId: string,
    supplierId: string,
    startDate: string,
    endDate: string,
    notes?: string
) {    
    const session = await auth()

    if (!session?.user) redirect("/login");

    if (items.length === 0) return {success: false, error: "No order items"}

    const total = items.reduce(
            (sub, item) => sub + ((item.price ?? 0) * item.quantity), 0
        );
        

    try {

        const serviceStockItems = await Promise.all(
            items.map(async (item) => {
                const existingByName = await db.serviceStockItem.findFirst({
                    where: {
                        serviceId,
                        stockItem: {
                            name: item.name
                        }
                    },
                    include: {
                        stockItem: true
                    }
                })

                if (existingByName) {
                    return existingByName
                }

                return await db.serviceStockItem.upsert({
                    where: {
                        serviceId_stockItemId: {
                            serviceId,
                            stockItemId: item.id
                        }
                    },
                    update: {
                        updatedAt: new Date()
                    },
                    create: {
                        serviceId,
                        stockItemId: item.id,
                        stock: 0,
                        cost: item.cost || item.price || 0,
                        status: "ACTIVE"
                    },
                    include: {
                        stockItem: true
                    }
                });
            })
        )
        const order = await db.order.create({
            data: {
                total,
                notes: notes || "",
                serviceId,
                supplierId,
                requestedEndDate: new Date (endDate),
                requestedStartDate: new Date (startDate),
                status: "DRAFT",
                paymentType: "CASH",
                orderItems: {
                    create: items.map((so, index) => ({
                        orderedQty: so.quantity,
                        price: so.price || 0,
                        deliveredQty: 0,
                        stockItemId: so.id,
                        serviceStockItemId: serviceStockItems[index].id
                    }))
                },
            },
            include: {
                supplier: {
                    select: {
                        userId: true
                    }
                },
                Service: {
                    select: {
                        businessName: true
                    }
                }

            }
        });

        await logActivity(
            order.serviceId,
            null,
            "CREATE",
            "Order",
            order.id,
            `Order totaling MZN ${total.toFixed(2)} created`,
            {
                total,
                timeStamp: order.timestamp,
                items:  items.map((item: StockItem & {quantity: number}) => ({
                        name: item.name,
                        stockItemId: item.id,
                        orderedQty: item.quantity,
                        price: item.price
                    }))
                
            },
            null,
            'INFO',
            null
        );
        
        await createNotification({
            userId: order.supplier.userId,
            type: "ORDER",
            title: "New Order",
            message: `${order.Service?.businessName} placed a new order.`,
            link: `/supply/orders/${order.id}`
        })
        
        await db.auditLog.create({
            data: {
                action: "CREATE",
                entityType: "Order",
                entityId: serviceId,
                entityName: order.Service?.businessName || "Service",
                details: {
                    metadata: order.id
                }
            }
        })
        return { success: true, order};
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: "Failed to create order" };
    }
}

export async function acceptOrder({ orderId}: { orderId: string;}) {

    try {
        const result = await db.$transaction(async (tx) => {
            const order = await tx.order.update({
                    where: {
                        id: orderId
                    },
                    data: {
                        status: "SUBMITTED"
                    },
                    include: {
                        Service: true,
                        supplier: true,
                    }
                })
                
            
            if (order.serviceId) {
                
                await tx.supplierCustomer.upsert({
                    where: {
                        supplierId_serviceId: {
                            supplierId: order.supplierId,
                            serviceId: order.serviceId,
                        }
                        
                    },
                    update: {
                        Order: {
                            connect: [{
                                id: orderId
                            }]
                        }
                    },
                    create: {
                        serviceId: order.serviceId,
                        supplierId: order.supplierId,
                        Order: {
                            connect: [{
                                id: orderId
                            }]
                        }
                    }
                    
                })

                
            };
            
            
            
            return {order}
        }, {timeout: 15000 })

        await logActivity(
            result.order.serviceId,
            result.order.supplierId,
            "UPDATE",
            "Order",
            result.order.id,
            `Order accepted by supplier`,
            {
                orderId,
                update: `Order status to "Submitted"`
            },
            null,
            'INFO',
            null
        );

        await createNotification({
            userId: result.order.Service?.userId ?? "",
            type: "ORDER",
            title: "Order Accepted",
            message: `${result.order.supplier.businessName} accepteded the order.`,
            link: `/service/purchases/orders/${result.order.id}`
        })

        if (result) {

            await db.auditLog.create({
                data: {
                    action: "ACCEPT",
                    entityType: "Order",
                    entityId: result.order.serviceId || "",
                    entityName: result.order.Service?.businessName || "",
                    details: {
                        metadata: orderId
                }
            }
        })   
    }
        return { success: true, ...result};
        
    } catch (error) {
        console.error("Error accepting order", error);
        return { success: false, error: "Failed to accept order" };
    }
}

export async function denyOrder({orderId}: { orderId: string;}) {
    
    try {
        const result = await db.$transaction(async (tx) => {
            const order = await tx.order.update({
                    where: {
                        id: orderId
                    },
                    data: {
                        status: "CANCELLED"
                    },
                    include: {
                        supplier: true
                    }
                });
                
            
            await logActivity(
                    order.serviceId,
                    order.supplierId,
                    "UPDATE",
                    "Order",
                    order.id,
                    `Supplier denied the order`,
                    {
                        orderId,
                        update: `Order status to "REJECTED" by the Supplier`
                    },
                    null,
                    'INFO',
                    null
                );
        
            return {order}
        })

        if (result) {

            await db.auditLog.create({
                data: {
                    action: "Deny",
                    entityType: "Order",
                    entityId: result.order.supplierId || "",
                    entityName: result.order.supplier.businessName || "",
                    details: {
                        metadata: orderId
                }
            }
        })}
         
        return {success: true, ...result}

    } catch (error) {
        console.error("Error denying order", error);
        return { success: false, error: "Failed to deny order" };
    }
}