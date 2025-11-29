"use server";

import { db } from "@/lib/db";
import {  SaleItemWithCatalogItems } from "@/types/types";
import { logActivity } from "./logs";

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
            const stocks = await tx.item.findMany({
                where: {
                    id: { in: stockIds}
                },
                select: { id: true, name: true, stock: true, price: true },
            })

            for (const saleItem of saleItems) {
                // console.log("Processing saleItem:", saleItem.name);
                const itemRecipes = saleItem.CatalogItems || [];
                
                for (const recipeItem of itemRecipes) {
                    const stockProduct = stocks.find(s => s.id === recipeItem.id)
                    if (!stockProduct) continue;
                        
                    const qtyUsed = saleItem.quantity * recipeItem.quantity;

                    stockUsage[recipeItem.id] = (stockUsage[recipeItem.id] ?? 0) + qtyUsed;
                    cogs += qtyUsed * (stockProduct.price ?? 0);
                    // console.log(` - Using ${qtyUsed} of ${stockProduct.name} at cost ${(stockProduct.price ?? 0)} each, total ${qtyUsed * (stockProduct.price ?? 0)}`);
                }
            }

            for (const [stockId, totalQty] of Object.entries(stockUsage)) {
                await tx.item.update({
                    where: { id: stockId },
                    data: {
                        stock: {
                            decrement: totalQty,
                        }
                    }
                });
            }


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

            await tx.stockMovement.createMany({
                data: Object.entries(stockUsage).map(([stockId, qty]) => ({
                    stockItemId: stockId,
                    quantity: qty,
                    changeType: "SALE",
                    referenceId: newSale.id,
                    notes: "Sold Products"
                }))
            })

            console.log("COGS:", cogs);
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

        return { success: true, saleId: result.id, cogs: result.cogs};

    } catch (error) {
        console.error("Error creating sale:", error);
        throw new Error("Failed to create sale");
    }
}
