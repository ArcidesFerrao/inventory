"use server";

import { db } from "@/lib/db";

export async function createSale(saleItems: { quantity: number; id: string; name: string; price: number; stock: number; }[], userId: string) {

    
    const totalPrice = saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    try {

        const sale = await db.sale.create({
            data: {
                userId: userId,
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
    return { success: true, saleId:sale.id};

} catch (error) {
    console.error("Error creating sale:", error);
    throw new Error("Failed to create sale");
  }
}