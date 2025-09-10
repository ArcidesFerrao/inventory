"use server";

import { db } from "@/lib/db";
import { ProductWithMenuItems } from "@/types/types";

export async function createSale(
    saleItems: ProductWithMenuItems[], 
    userId:string
) {    
    const totalPrice = saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

                    if (recipeItem.quantity > 0) {

                        const qtyUsed = saleItem.quantity * recipeItem.quantity;
                        
                        const stockProduct = await tx.product.findUnique({

                            where: {
                                id: recipeItem.stockId
                            },
                            select: {
                                price: true,
                                stock: true,
                            }
                        })

                        if (!stockProduct) continue;

                        await tx.product.update({
                            where: { id: recipeItem.stockId },
                                data: {
                                    stock: {
                                        decrement: qtyUsed,
                                    },
                                },
                            });
                            cogs += qtyUsed * (stockProduct.price ?? 0)
                        }
                    }
            }

            console.log("COGS:", cogs);
            return { newSale, cogs}
        });        
        return { success: true, saleId: result.newSale.id, cogs: result.cogs};

    } catch (error) {
        console.error("Error creating sale:", error);
        throw new Error("Failed to create sale");
    }
}

