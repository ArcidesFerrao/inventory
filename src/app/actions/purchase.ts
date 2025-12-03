"use server";

import { db } from "@/lib/db";
import { logActivity } from "./logs";
import { ServiceStockProduct } from "@/types/types";

// export async function createPurchase(purchaseItems: { id: string; name: string; price: number | null;  quantity: number, }[], serviceId: string) {
export async function createPurchase(purchaseItems: ServiceStockProduct[], serviceId: string) {
    // console.log(purchaseItems)
    if (purchaseItems.length === 0) return {success: false, message: "No purchase items"}
    
    const total = purchaseItems.reduce((sum, serviceStockItem) => sum + ((serviceStockItem.price || 0) * serviceStockItem.quantity), 0);
    try {
        const result  = await db.$transaction(async (tx) => {
            const purchase = await tx.purchase.create({
                data: {
                    total,
                    paymentType: "CASH",
                    serviceId,
                    sourceType: "DIRECT",
                    PurchaseItem: {
                        create: purchaseItems.map((serviceStockItem) => ({
                            stockItemId: serviceStockItem.stockItem.id,
                            serviceStockItemId: serviceStockItem.id,
                            stock: serviceStockItem.quantity,
                            price: serviceStockItem.price ?? 0,
                            unitCost: serviceStockItem.price ?? 0,
                            totalCost: (serviceStockItem.price ?? 0) * serviceStockItem.quantity,
                        })),
                    },
                },
                include: {
                    PurchaseItem: true,
                },
            })

            await Promise.all(
                purchaseItems.map((serviceStockItem) => 
                    tx.serviceStockItem.update({
                        where: { id: serviceStockItem.id },
                        data: {
                            stock: { increment: serviceStockItem.quantity },
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
        return {success: false, message: "Failed to create purchase"}

    }
}