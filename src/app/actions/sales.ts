"use server";

import { db } from "@/lib/db";
import {  SaleProductWithMenuItems } from "@/types/types";
import { logActivity } from "./logs";

export async function createSale(
    saleItems: SaleProductWithMenuItems[], serviceId: string
) {    
    if (saleItems.length === 0) return {success: false, message: "No sale items"}

    const totalPrice = saleItems.reduce((sum, item) => sum + ((item.price ?? 0) * item.quantity), 0);

    try {
        const result = await db.$transaction(async (tx) => {
               
            let cogs = 0;

            const stockUsage: Record<string, number> = {};

            const stockIds = saleItems.flatMap(item => 
                ( item.MenuItems ?? []).map(recipe => recipe.stock.id) 
            );
            const stocks = await tx.product.findMany({
                where: {
                    id: { in: stockIds}
                },
                select: { id: true, name: true, stock: true, price: true },
            })

            for (const saleItem of saleItems) {
                // console.log("Processing saleItem:", saleItem.name);
                const productRecipes = saleItem.MenuItems || [];
                
                for (const recipeItem of productRecipes) {
                    const stockProduct = stocks.find(s => s.id === recipeItem.stock.id)
                    if (!stockProduct) continue;

                    // console.log("Found stockProduct:", stockProduct.name);
                        
                    const qtyUsed = saleItem.quantity * recipeItem.quantity;

                    stockUsage[recipeItem.stock.id] = (stockUsage[recipeItem.stock.id] ?? 0) + qtyUsed;
                    cogs += qtyUsed * (stockProduct.price ?? 0);
                    // console.log(` - Using ${qtyUsed} of ${stockProduct.name} at cost ${(stockProduct.price ?? 0)} each, total ${qtyUsed * (stockProduct.price ?? 0)}`);
                }
            }

            for (const [stockId, totalQty] of Object.entries(stockUsage)) {
                await tx.product.update({
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
                            productId: item.id,
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
                    productId: stockId,
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
