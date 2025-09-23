"use server";

import { db } from "@/lib/db";
import { logActivity } from "./logs";
import { SupplierProduct } from "@prisma/client";

export async function createOrder(
    orderItems: SupplierProduct[], 
    supplierId:string
) {    
    const totalPrice = orderItems.reduce((sum, item) => sum + ((item.price ?? 0) * item.unitQty), 0);

    try {
        const order = await db.order.create({
            data: {
                
            }
        })
               
            

        return { success: true, order};

    } catch (error) {
        console.error("Error creating sale:", error);
        throw new Error("Failed to create sale");
    }
}
