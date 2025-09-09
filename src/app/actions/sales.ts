"use server";

import { db } from "@/lib/db";

export async function createSale(saleItems: { quantity: number; id: string; name: string; price: number; stock: number; }[], userId: string) {

    
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
            
            const sale = await tx.sale.findUnique({
                where: { id: newSale.id },
                include: {
                    SaleItem: {
                        include: {
                            product: {
                                include: {
                                    RecipeItem: {
                                        include: {
                                            stock: true, // stock product
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (!sale) {
                throw new Error("Sale not found");
            }
    
            let cogs = 0;
            for (const saleItem of sale.SaleItem) {
                console.log("Processing saleItem:", saleItem.product.name);
                for (const recipe of saleItem.product.RecipeItem) {
                    console.log("  Recipe:", {
                        stockId: recipe.stock.id,
                        stockName: recipe.stock.name,
                        qtyNeeded: saleItem.quantity * recipe.quantity,
                        stockBefore: recipe.stock.stock,
                        stockPrice: recipe.stock.price,
                    });

                    if (saleItem.quantity> 0 && recipe.quantity > 0 && recipe.stock) {

                        const qtyUsed = saleItem.quantity * recipe.quantity;
                        
                        if (recipe.stock) {
                            await tx.product.update({
                                where: { id: recipe.stock.id },
                                data: {
                                    stock: {
                                        decrement: qtyUsed,
                                    },
                                },
                            });
                        }
                        cogs += qtyUsed * (recipe.stock.price ?? 0)
                    }
                }

            }
            console.log("COGS:", cogs);

            return { newSale, cogs}
        })



        
        return { success: true, saleId: result.newSale.id, cogs: result.cogs};

    } catch (error) {
        console.error("Error creating sale:", error);
        throw new Error("Failed to create sale");
    }
}


export async function newSale(saleItems: { quantity: number; id: string; name: string; price: number;stock:number}[], userId:string) {
    const totalPrice = saleItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    try {
        const saleCreateQuery = db.sale.create({
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

        const stockUpdateQueries = saleItems.flatMap((item) => {
            const productRecipes = item.recipeItems || [];
            return productRecipes
                .filter((recipe) => recipe.stock && recipe.quantity > 0 && item.quantity > 0)
                .map((recipe) => {
                    const qty = item.quantity * recipe.quantity;
                    return db.product.update({
                        where: { id: recipe.stock.id},
                        data: { stock: { decrement: qty }}
                    })
                })
        })

        const [newSale] = await db.$transaction([saleCreateQuery, ...stockUpdateQueries])

        let cogs =0;

        for (const item of saleItems) {
      const productRecipes = item.recipeItems || [];
      for (const recipe of productRecipes) {
        if (recipe.stock) {
          const qtyUsed = item.quantity * recipe.quantity;
          cogs += qtyUsed * (recipe.stock.price ?? 0);
        }
      }
    }

    return { success: true, saleId: newSale.id, cogs };
  } catch (error) {
    console.error("Error creating sale:", error);
    throw new Error("Failed to create sale");
  }
}