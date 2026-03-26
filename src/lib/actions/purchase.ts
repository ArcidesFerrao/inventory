"use server";

import { db } from "@/lib/db";
import { logActivity } from "./logs";
import { ServiceStockProduct } from "@/types/types";
import { createAuditLog } from "./auditLogs";
import { getTranslations } from "next-intl/server";

export async function createPurchase(purchaseItems: ServiceStockProduct[], serviceId: string) {
    const rt = await getTranslations("Responses")
    // console.log(purchaseItems)
    if (purchaseItems.length === 0) return {success: false, message: `${rt("noPurchaseItems")}`}
    
    const total = purchaseItems.reduce((sum, serviceStockItem) => sum + ((serviceStockItem.price || 0) * serviceStockItem.quantity), 0);
    try {
        const result  = await db.$transaction(async (tx) => {
            const purchase = await tx.purchase.create({
                data: {
                    total,
                    paymentType: "CASH",
                    serviceId,
                    sourceType: "DIRECT",
                    sourceId: "directPurchase",
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
                    PurchaseItem: {
                        include: {
                            stockItem: true
                        }
                    },
                },
            })
            await Promise.all(
                purchaseItems.map((serviceStockItem) => 
                    tx.serviceStockItem.update({
                        where: { id: serviceStockItem.id },
                        data: {
                            stock: { increment: serviceStockItem.quantity },
                            stockQty: { increment: serviceStockItem.quantity * serviceStockItem.stockItem.unitQty },
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
            `${rt("createdPurchaseTotaling")} ${total.toFixed(2)}`,
            {
                total,
                items: purchaseItems.map(i => ({
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
        await logActivity(
            serviceId,
            null,
            "ERROR",
            "Purchase",
            null,
            `${rt("errorCreatingPurchase")}`,
            {
                error: error instanceof Error ? error.message : String(error),
            },
            null,
            'ERROR',
            null
        )
        await createAuditLog({
            action: "ERROR",
            entityType: "Purchase",
            entityId: serviceId,
            entityName: "Service",
            details: {
                metadata: {
                    error: (error as string).toString() || "Error creating purchase"
                }
            }
        });
        return {success: false, message: `${rt("createPurchaseFail")}`}

    }
}