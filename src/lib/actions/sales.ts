"use server";

import { db } from "@/lib/db";
import {  SaleItemWithCatalogItems, StockUsage } from "@/types/types";
import { logActivity } from "./logs";
import { createAuditLog } from "./auditLogs";
// import { Prisma } from "@/generated/prisma";
import { getTranslations } from "next-intl/server";




export async function createSale(
    saleItems: SaleItemWithCatalogItems[], serviceId: string
) { 
    const rt = await getTranslations("Responses");
       
    if (saleItems.length === 0) return {success: false, message: `${rt("noSaleItems")}`}

    const totalPrice = saleItems.reduce((sum, item) => sum + ((item.price ?? 0) * item.quantity), 0);

    try {
        const result = await db.$transaction(async (tx) => {
               
            let cogs = 0;
            
            const stockUsage: Record<string, StockUsage> = {};

            const stockIds = saleItems.flatMap(item => 
                ( item.CatalogItems ?? []).map(recipe => recipe.serviceStockItem.id) 
            );

            // console.log(stockIds)

            const stocks = await tx.serviceStockItem.findMany({
                where: {
                    id: { in: stockIds}
                },
                select: { 
                    id: true, 
                    stock: true, 
                    stockQty: true, 
                    cost: true,
                    stockItem: { 
                        select: { 
                            unitQty:true, 
                            name: true,
                            unit: { 
                                select: { 
                                    name: true 
                                } 
                            }
                        } 
                    }
                 },
            })

            console.log(stocks)

            for (const saleItem of saleItems) {
                // console.log("Processing saleItem:", saleItem.name);
                const itemRecipes = saleItem.CatalogItems || [];
                
                for (const recipeItem of itemRecipes) {
                    const serviceStockItemId = recipeItem.serviceStockItem.id
                    const stockProduct = stocks.find(s => s.id === serviceStockItemId)
                    if (!stockProduct) continue;
                        
                    if (recipeItem.usageType !== "UNIT") {
                        const qtyUsed = recipeItem.quantity * saleItem.quantity;
                        console.log(qtyUsed)
                        
                        const cost = qtyUsed * (recipeItem.serviceStockItem.cost || 0) / recipeItem.serviceStockItem.stockItem.unitQty
                        // console.log(cost)
                        
                        cogs += cost
                        
                        stockUsage[serviceStockItemId] ??= { baseQty: 0, units: 0} ;
                        stockUsage[serviceStockItemId].baseQty += qtyUsed
                        console.log(`Stock Usage: ` + stockUsage)

                        console.log(` - Using ${qtyUsed} of ${stockProduct.stockItem.name} at cost ${( cost ?? 0)} MZN`);
                    } else {
                        const unitsUsed = saleItem.quantity * recipeItem.quantity;
                        console.log(unitsUsed)

                        const baseQty = unitsUsed * recipeItem.serviceStockItem.stockItem.unitQty;
                        
                        
                        const cost = unitsUsed * (stockProduct.cost ?? 0)
                        // console.log(`Cost: ` + cost)
                        
                        cogs += cost;
                        
                        stockUsage[serviceStockItemId] ??= { baseQty: 0, units: 0};
                        
                        stockUsage[serviceStockItemId].units += unitsUsed
                        stockUsage[serviceStockItemId].baseQty += baseQty
                        
                        console.log(`Stock Usage: ` + stockUsage)
                        console.log(` - Using ${unitsUsed} of ${stockProduct.stockItem.name} at cost ${(stockProduct.cost ?? 0)} each, total ${cost}`);
                    }
                }
            }

            for (const [stockId, usage] of Object.entries(stockUsage)) {
                const stock = stocks.find(s => s.id === stockId);
                console.log(`Processing item: ` + stock?.stockItem.name)

                if (!stock) continue;

                console.log(usage.baseQty)

                

                const remainingBaseUnits = (stock.stockQty ?? 0) - usage.baseQty

                if (remainingBaseUnits < 0) {
                    throw new Error(`${rt("notEnoughStock")} ${stock.stockItem?.name}`);
                }
                console.log(remainingBaseUnits)
                
                // const remainingBaseUnits = (stock.stockQty ?? 0)  - (qtyUsed * stock.stockItem.unitQty);

                // const newStock = Math.trunc((remainingBaseUnits ?? 1)/stock.stockItem.unitQty);
                // const newStockQty = newStock * 
                // console.log("New stock :", newStock);
                // console.log("New stock qty:", remainingBaseUnits);
                // console.log("New stock qty in base units:", newStockQty);
                
                
                if (stock.stockItem?.unit?.name !== "unit") {
                    
                    // const newStock = Math.floor(remainingBaseUnits / stock.stockItem.unitQty)

                    const updated = await tx.serviceStockItem.update({
                        where: { id: stockId },
                        data: {
                            stock: {
                                    decrement: usage.units,
                                },
                            stockQty: remainingBaseUnits,
                        }
                    });

                    console.log(updated)
                } else {
                    const updated = await tx.serviceStockItem.update({
                        where: { id: stockId },
                        data: {
                            stock: {
                                decrement: usage.units,
                            },
                            stockQty: {
                                decrement: usage.baseQty
                            }
                        }
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
            for (const [stockId, usage] of Object.entries(stockUsage).filter(([,usage]) => usage.units > 0)) {
                await tx.stockMovement.create({
                    data: {
                        serviceStockItemId:  stockId,
                        quantity: usage.units,
                        changeType: "SALE",
                        referenceId: newSale.id,
                        notes: `${rt("soldProducts")}`
                    }
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
            `${rt("createdSaleTotaling")} ${totalPrice.toFixed(2)}`,
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
        console.error(`${rt("creatingSaleError")}`, error);
        await logActivity(
            serviceId,
            null,
            "ERROR",
            "Sale",
            null,
            `${rt("creatingSaleError")}`,
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
                    error: (error as string).toString() || `${rt("creatingSaleError")}`
                }
            }
        });

        return { success: false, message: `${rt("creatingSaleError")}`, error}
    }
}
