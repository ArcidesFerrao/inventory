"use server";

import { db } from "@/lib/db";
import { logActivity } from "./logs";
import { redirect } from "next/navigation";
import { auth} from "@/lib/auth";
import { createNotification } from "./notifications";


type GroupedItems = {
    supplierId: string;
    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }[]
}[];

export async function createOrder(
    groupedItems: GroupedItems, 
    startDate: string,
    endDate: string,
    notes?: string
) {    
    const session = await auth()

    if (!session?.user) redirect("/login");

    if (groupedItems.length === 0) return {success: false, error: "No order items"}

    const total = groupedItems.reduce((sum, supplierOrder) => {
        const supplierTotal = supplierOrder.items.reduce(
            (sub, product) => sub + (product.price * product.quantity), 0
        );
        return sum + supplierTotal;
    }, 0)

    try {
        const order = await db.order.create({
            data: {
                total,
                notes: notes || "",
                serviceId: session.user.serviceId,
                requestedEndDate: new Date (endDate),
                requestedStartDate: new Date (startDate),
                status: "DRAFT",
                paymentType: "CASH",
                supplierOrders: {
                    create: groupedItems.map((so) => ({
                        supplier: { 
                            connect: { 
                                id: so.supplierId
                            }
                        },
                        items: {
                            create: so.items.map((item) => ({
                                supplierProductId: item.productId,
                                orderedQty: item.quantity,
                                price: item.price,
                                deliveredQty: 0,
                            }))
                        }
                    }))
                }
            },
            include: {
                supplierOrders: {
                    include: {
                        supplier: true
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
                groupedItems: groupedItems.map(i => ({
                    supplierId: i.supplierId,
                    items: i.items.map((item) => ({
                        name: item.name,
                        productId: item.productId,
                        orderedQty: item.quantity,
                        price: item.price
                    }))
                }))
            },
            null,
            'INFO',
            null
        );
        
        const notification = await createNotification({
            userId: order.supplierOrders[0].supplier.userId,
            type: "ORDER",
            title: "New Order",
            message: `${session.user.name} placed a new order.`,
            link: `/supply/orders/${order.supplierOrders[0].id}`
        })
        console.log("Created notification: ", notification)
        return { success: true, order};
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: "Failed to create order" };
        throw new Error("Failed to create order");
    }
}


export async function acceptOrder({supplierOrderId, orderId}: {supplierOrderId: string; orderId: string;}) {

    try {
        const result = await db.$transaction(async (tx) => {
            const [order, supplierOrder] = await Promise.all([

                tx.order.update({
                    where: {
                        id: orderId
                    },
                    data: {
                        status: "SUBMITTED"
                    },
                    include: {
                        Service: true
                    }
                }),
                tx.supplierOrder.update({
                    where: {
                        id: supplierOrderId
                    },
                    data: {
                        status: "APPROVED"
                    },
                    include: {
                        supplier: true
                    }
                })
            ])
            
            if (order.serviceId) {
                
                await tx.supplierCustomer.upsert({
                    where: {
                        supplierId_serviceId: {
                            supplierId: supplierOrder.supplierId,
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
                        supplierId: supplierOrder.supplierId,
                        Order: {
                            connect: [{
                                id: orderId
                            }]
                        }
                    }
                    
                })

                
            };
            
            
            
            return {order, supplierOrder}
        }, {timeout: 15000 })

        await logActivity(
            result.order.serviceId,
            result.supplierOrder.supplierId,
            "UPDATE",
            "Order",
            result.order.id,
            `Order accepted by supplier`,
            {
                supplierOrderId,
                update: `Order status to "Submitted" and Supplier Order to "Approved"`
            },
            null,
            'INFO',
            null
        );

        await createNotification({
            userId: result.order.Service?.userId ?? "",
            type: "ORDER",
            title: "Order Accepted",
            message: `${result.supplierOrder.supplier.name} accepteded the order.`,
            link: `/service/purchases/orders/${result.order.id}`
        })
            
        return { success: true, ...result};
        
    } catch (error) {
        console.error("Error accepting order", error);
        return { success: false, error: "Failed to accept order" };
    }
}

export async function denyOrder({supplierOrderId, orderId}: {supplierOrderId: string; orderId: string;}) {
    
    try {
        const result = await db.$transaction(async (tx) => {
            const [order, supplierOrder] = await Promise.all([
                tx.order.update({
                    where: {
                        id: orderId
                    },
                    data: {
                        status: "CANCELLED"
                    }
                }),
                tx.supplierOrder.update({
                    where: {
                        id: supplierOrderId
                    },
                    data: {
                        status: "REJECTED"
                    }
                })
            ])
            await logActivity(
                    order.serviceId,
                    supplierOrder.supplierId,
                    "UPDATE",
                    "Order",
                    order.id,
                    `Supplier denied the order`,
                    {
                        supplierOrderId,
                        update: `Order status to "REJECTED" by the Supplier`
                    },
                    null,
                    'INFO',
                    null
                );
        
            return {order, supplierOrder}
        })

        return {success: true, ...result}
    } catch (error) {
        console.error("Error denying order", error);
        return { success: false, error: "Failed to deny order" };
    }
}