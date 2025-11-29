"use server";

import { db } from "@/lib/db";
import { logActivity } from "./logs";
import { ServiceStockProduct } from "@/types/types";

// export async function createPurchase(purchaseItems: { id: string; name: string; price: number | null;  quantity: number, }[], serviceId: string) {
export async function createPurchase(purchaseItems: ServiceStockProduct[], serviceId: string) {
    console.log(purchaseItems)
    if (purchaseItems.length === 0) return {success: false, message: "No purchase items"}
    
    const total = purchaseItems.reduce((sum, stockItem) => sum + ((stockItem.price || 0) * stockItem.quantity), 0);
    try {
        const result  = await db.$transaction(async (tx) => {
            const purchase = await tx.purchase.create({
                data: {
                    total,
                    paymentType: "CASH",
                    serviceId,
                    sourceType: "DIRECT",
                    PurchaseItem: {
                        create: purchaseItems.map((stockItem) => ({
                            stockItemId: stockItem.id,
                            stock: stockItem.quantity,
                            price: stockItem.price ?? 0,
                            unitCost: stockItem.price ?? 0,
                            totalCost: (stockItem.price ?? 0) * stockItem.quantity,
                        })),
                    },
                },
                include: {
                    PurchaseItem: true,
                },
            })

            await Promise.all(
                purchaseItems.map((stockItem) => 
                    tx.stockItem.update({
                        where: { id: stockItem.id },
                        data: {
                            stock: { increment: stockItem.quantity },
                        }
                    })
                )
            )

            return purchase
        })

        await logActivity(
                    serviceId,
                    null,
                    "CREATE",
                    "Purchase",
                    result.id,
                    `Purchase totaling MZN ${total.toFixed(2)}`,
                    {
                        total,
                        stockItems: purchaseItems.map(i => ({
                            id: i.id, 
                            name: i.stockItem.name, 
                            quantity: i.quantity, 
                            price: i.price}))
                    },
                    null,
                    'INFO',
                    null
                );

        return { success: true, purchaseId:result.id};

    } catch (error) {
        console.error("Error creating purchase:", error);
        throw new Error("Failed to create purchase");
    }
}