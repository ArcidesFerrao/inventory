"use server";

import { db } from "@/lib/db";
import { ProductWithMenuItems } from "@/types/types";

export async function createSale(
    saleItems: ProductWithMenuItems[], 
    userId:string
) {    
    const totalPrice = saleItems.reduce((sum, item) => sum + ((item.price ?? 0) * item.quantity), 0);

    try {
        const result = await db.$transaction(async (tx) => {
            const newSale = await tx.sale.create({
                data: {
                    userId,
                    paymentType: "CASH",
                    total: totalPrice,
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
               
            let cogs = 0;

            for (const saleItem of saleItems) {
                console.log("Processing saleItem:", saleItem.name);
                const productRecipes = saleItem.MenuItems || [];
                
                for (const recipeItem of productRecipes) {
                    
                    console.log("Looping recipeItem:", saleItem.name);
                    if (recipeItem.quantity > 0) {
                        
                        const qtyUsed = saleItem.quantity * recipeItem.quantity;
                        
                        const stockProduct = await tx.product.findUnique({
                            where: {
                                id: recipeItem.stockId
                            },
                            select: {
                                name: true,
                                price: true,
                                stock: true,
                                cost: true,
                            }
                        })
                        
                        if (!stockProduct) continue;
                        console.log("Updating stockProduct:", stockProduct.name);
                        
                        await tx.product.update({
                            where: { id: recipeItem.stockId },
                                data: {
                                    stock: {
                                        decrement: qtyUsed,
                                    },
                                },
                            });
                            cogs += qtyUsed * (stockProduct.cost ?? 0)
                        }
                    }
            }

            const updatedCogs = await tx.sale.update({
                where: { id: newSale.id },
                data: { cogs },
            });

            console.log("COGS:", cogs);
            return { updatedCogs, cogs}
        });        
        return { success: true, saleId: result.updatedCogs.id, cogs: result.cogs};

    } catch (error) {
        console.error("Error creating sale:", error);
        throw new Error("Failed to create sale");
    }
}


export async function createNewSale(
    saleItems: ProductWithMenuItems[], 
    userId:string
) {    
    const totalPrice = saleItems.reduce((sum, item) => sum + ((item.price ?? 0) * item.quantity), 0);

    try {
        const result = await db.$transaction(async (tx) => {
            const newSale = await tx.sale.create({
                data: {
                    userId,
                    paymentType: "CASH",
                    total: totalPrice,
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
               
            let cogs = 0;

            for (const saleItem of saleItems) {
                console.log("Processing saleItem:", saleItem.name);
                const productRecipes = saleItem.MenuItems || [];
                
                const updates = productRecipes.filter((recipeItem) => recipeItem.quantity > 0).map(async (recipeItem) => {
                    const qtyUsed = saleItem.quantity * recipeItem.quantity;

                    const stockProduct = await tx.product.findUnique({
                        
                        where: {
                            id: recipeItem.stockId
                        },
                        select: {
                            name: true,
                            price: true,
                            stock: true,
                            cost: true,
                        }
                    })
                    if (!stockProduct) return 0;
                    console.log("Updating stockProduct:", stockProduct.name);
                    
                    await tx.product.update({
                        where: { id: recipeItem.stockId },
                            data: {
                                stock: {
                                    decrement: qtyUsed,
                                },
                            },
                        });
                        return qtyUsed * (stockProduct.cost ?? 0)
                    
                    
                });
                const costs = await Promise.all(updates);
            
                cogs += costs.reduce((a, b) => a + b, 0)
            }
            
        return { success: true, saleId: newSale.id, cogs};
        })
        return result;
            
    } catch (error) {
        console.error("Error creating sale:", error);
        throw new Error("Failed to create sale");
    }
}

