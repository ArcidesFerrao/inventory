"use server";

import { db } from "@/lib/db";
import { logActivity } from "./logs";
import { SupplierProduct } from "@prisma/client";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function createOrder(
    orderItems: SupplierProduct[], 
    supplierId:string
) {    
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const total = orderItems.reduce((sum, item) => sum + ((item.price ?? 0) * item.unitQty), 0);

    try {
        const order = await db.order.create({
            data: {
                total,
                supplierId,
                userId: session.user.id,
                status: "PENDING",
                paymentType: "CASH",
                items: {
                    create: orderItems.map((item) => ({
                        productId: item.id,
                        quantity: item.unitQty,
                        price: item.price || 0,
                        supplierId
                    })),
                },
            },
            include: {
                items: true,
            },
        });
               
            

        return { success: true, order};

    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order");
    }
}
