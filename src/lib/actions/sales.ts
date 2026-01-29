"use server";

import { db } from "@/lib/db";
import {  SaleItemWithCatalogItems } from "@/types/types";
import { logActivity } from "./logs";
import { createAuditLog } from "./auditLogs";
import { Prisma } from "@/generated/prisma";

export async function createSale(
    saleItems: SaleItemWithCatalogItems[], serviceId: string
) {    
    if (saleItems.length === 0) return {success: false, message: "No sale items"}

    const totalPrice = saleItems.reduce((sum, item) => sum + ((item.price ?? 0) * item.quantity), 0);

    try {
        const result = await db.$transaction(async (tx) => {
               
            let cogs = 0;
            
            const stockUsage: Record<string, number> = {};

            const stockIds = saleItems.flatMap(item => 
                ( item.CatalogItems ?? []).map(recipe => recipe.serviceStockItem.id) 
            );
            const stocks = await tx.serviceStockItem.findMany({
                where: {
                    id: { in: stockIds}
                },
                select: { id: true, stock: true, stockQty: true, cost: true,

                    stockItem: { select: { unit: { select: { name: true } }, unitQty:true, name: true} }
                 },
            })



            for (const saleItem of saleItems) {
                // console.log("Processing saleItem:", saleItem.name);
                const itemRecipes = saleItem.CatalogItems || [];
                
                for (const recipeItem of itemRecipes) {
                    const serviceStockItemId = recipeItem.serviceStockItem.id
                    const stockProduct = stocks.find(s => s.id === serviceStockItemId)
                    if (!stockProduct) continue;
                        
                    const qtyUsed = saleItem.quantity * recipeItem.quantity;
                    // stockUsage[serviceStockItemId] += qtyUsed;
                    stockUsage[serviceStockItemId] = (stockUsage[serviceStockItemId] ?? 0) + qtyUsed;

                    const costPerBaseUnit = (stockProduct.cost ?? 0) / (stockProduct.stockItem?.unitQty ?? 1);

                    cogs += qtyUsed * costPerBaseUnit;

                    // console.log(` - Using ${qtyUsed} of ${stockProduct.stockItem.name} at cost ${(stockProduct.cost ?? 0)} each, total ${qtyUsed * (stockProduct.cost ?? 0)}`);
                }
            }

            for (const [stockId, totalQty] of Object.entries(stockUsage)) {
                const stock = stocks.find(s => s.id === stockId);
                if (!stock) continue;

                if ((stock.stockQty ?? 0) < totalQty) {
                    throw new Error(`Insufficient stock for item ${stock.stockItem?.name}`);
                }

                const data: Prisma.ServiceStockItemUpdateInput ={
                    stockQty: {
                        decrement: totalQty,
                    }
                }

                const remainingBaseUnits = (stock.stockQty ?? 0) - totalQty;

                const newStockQty = Math.trunc((remainingBaseUnits ?? 1)/stock.stockItem.unitQty);

                console.log("New stock qty in base units:", newStockQty);
                
                
                if (stock.stockItem?.unit?.name !== "unit") {
                    // data.stock = {
                    //     decrement: Math.ceil(totalQty / (stock.stockItem?.unitQty ?? 1))
                    // }

                    const updated = await tx.serviceStockItem.update({
                        where: { id: stockId },
                        data: {
                            stock: newStockQty,
                            stockQty: remainingBaseUnits,
                        }
                    });
                    console.log(updated)
                } else {
                    data.stock = {
                        decrement: totalQty
                    }
                    const updated = await tx.serviceStockItem.update({
                        where: { id: stockId },
                        data
                    });
                    console.log(updated)
                }


            }

            // const filteredMovements = stockUsage.filter((ci) => ci.qty > 0)

            const newSale = await tx.sale.create({
                data: {
                    serviceId,
                    paymentType: "CASH",
                    total: totalPrice,
                    cogs,
                    SaleItem: {
                        create: saleItems.map((item) => ({
                            itemId: item.id,
                            quantity: item.quantity,
                            price: item.price ?? 0,
                        })),
                    },
                },
                include: {
                    SaleItem: true,
                },
            });

            for (const [stockId, qty] of Object.entries(stockUsage).filter(([,qty]) => qty > 0)) {

                await tx.stockMovement.create({
                    data: {
                        serviceStockItemId:  stockId,
                        quantity: qty,
                        changeType: "SALE",
                        referenceId: newSale.id,
                        notes: "Sold Products"}
                    })
                
            }

            // console.log("COGS:", cogs);
            return newSale

        }, { timeout: 15000 }  );   
        
        

        await logActivity(
            serviceId,
            null,
            "CREATE",
            "Sale",
            result.id,
            `Sale totaling MZN ${totalPrice.toFixed(2)}`,
            {
                        totalPrice,
                        items: saleItems.map(i => ({
                            id: i.id, 
                            name: i.name, 
                            quantity: i.quantity, 
                            price: i.price}))
                    },
            null,
            'INFO',
            null
        );
        
        await db.auditLog.create({
            data: {
                action: "CREATE",
                entityType: "Sale",
                entityId: serviceId,
                entityName: "service",
                details: {}
            }
        })
        
        
        
        return { success: true, saleId: result.id, cogs: result.cogs};
    } catch (error) {
        console.error("Error creating sale:", error);
        await logActivity(
                            serviceId,
                            null,
                            "ERROR",
                            "Sale",
                            null,
                            `Error while creating sale`,
                            {
                                
                                error: error instanceof Error ? error.message : String(error),
                            },
                            null,
                            'ERROR',
                            null
                        )
                        await createAuditLog({
                                    action: "ERROR",
                                    entityType: "Sale",
                                    entityId: serviceId,
                                    entityName: "Service",
                                    details: {
                                        metadata: {
                                            error: (error as string).toString() || "Error creating sale"
                                        }
                                    }
                                });
        return { success: false, message: error}
    }
}
