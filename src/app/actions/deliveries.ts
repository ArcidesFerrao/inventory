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