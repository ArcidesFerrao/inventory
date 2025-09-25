"use server";

import { db } from "@/lib/db";
import { logActivity } from "./logs";
import { SupplierProduct } from "@prisma/client";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function createOrder(
    orderItems: SupplierProduct[], 
    startDate: string,
    endDate: string,
    notes?: string
) {    
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const total = orderItems.reduce((sum, item) => sum + ((item.price ?? 0) * item.unitQty), 0);

    try {
        const order = await db.order.create({
            data: {
                total,
                notes: notes || "",
                userId: session.user.id,
                requestedEndDate: new Date (endDate),
                requestedStartDate: new Date (startDate),
                status: "PENDING",
                paymentType: "CASH",
                supplierOrders: {
                    create: {
                        status: "PENDING",
                        items: {
                            create: orderItems.map((item) => ({
                                supplierProductId: item.id,
                                supplierId: item.supplierId,
                                orderedQty: item.unitQty,
                                deliveredQty: 0,
                                price: item.price || 0,
                            })),
                        },
                    },
                }
            },
            include: {
                items: true,
                confirmedDeliveries: true,
                supplierOrders: {
                    include: {
                        items: true,
                    }
                },
                
            },
        });
        return { success: true, order};
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order");
    }
}
