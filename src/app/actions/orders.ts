"use server";

import { db } from "@/lib/db";
import { logActivity } from "./logs";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


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
    const session = await getServerSession(authOptions);

    if (!session?.user) redirect("/login");

    if (groupedItems.length === 0) return {success: false, message: "No order items"}

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
                status: "PLACED",
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
        });

        await logActivity(
                    order.serviceId,
                    null,
                    "CREATE",
                    "Order",
                    order.id,
                    `Order totaling MZN ${total.toFixed(2)}`,
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
        

        return { success: true, order};
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order");
    }
}


export async function acceptOrder({supplierOrderId, orderId}: {supplierOrderId: string; orderId: string;}) {

    try {
        const order = await db.order.update({
            where: {
                id: orderId
            },
            data: {
                status: "SUBMITTED"
            }
        })

        const supplierOrder = await db.supplierOrder.update({
            where: {
                id: supplierOrderId
            },
            data: {
                status: "APPROVED"
            }
        })
        await logActivity(
                    order.serviceId,
                    supplierOrder.supplierId,
                    "UPDATE",
                    "Order",
                    order.id,
                    `Order status`,
                    {
                        update: `Order status to "Submitted" and Supplier Order to "Approved"`
                    },
                    null,
                    'INFO',
                    null
                );
        return { success: true, order, supplierOrder};


    } catch (error) {
        console.error("Error accepting order", error);
    }
}