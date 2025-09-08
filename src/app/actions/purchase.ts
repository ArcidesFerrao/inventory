"use server";

import { db } from "@/lib/db";

export async function createPurchase(purchaseItems: { id: string; name: string; price: number; stock: number; }[], userId: string) {

    
    const totalPrice = purchaseItems.reduce((sum, item) => sum + (item.price * item.stock), 0);
    try {
        const result  = await db.$transaction(async (tx) => {
            const purchase = await tx.purchase.create({
                data: {
                userId: userId,
                paymentType: "CASH",
                total: totalPrice,
                PurchaseItem: {
                    create: purchaseItems.map((item) => ({
                        productId: item.id,
                        stock: item.stock,
                        price: item.price ?? 0,
                        
                        })),
                    },
                },
                include: {
                    PurchaseItem: true,
                },
            })

            await Promise.all(
                purchaseItems.map((item) => 
                    tx.product.update({
                        where: { id: item.id },
                        data: {
                            stock: { increment: item.stock },
                        }
                    })
                )
            )

            return purchase
        })

        return { success: true, purchaseId:result.id};

    } catch (error) {
        console.error("Error creating purchase:", error);
        throw new Error("Failed to create purchase");
    }
}