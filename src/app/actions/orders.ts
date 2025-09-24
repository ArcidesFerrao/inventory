"use server";

import { db } from "@/lib/db";
import { logActivity } from "./logs";
import { SupplierProduct } from "@prisma/client";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function createOrder(
    orderItems: SupplierProduct[], 
    supplierCustomerId:string
) {    
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const total = orderItems.reduce((sum, item) => sum + ((item.price ?? 0) * item.unitQty), 0);

    try {
        const order = await db.order.create({
            data: {
                total,
                userId: session.user.id,
                status: "PENDING",
                paymentType: "CASH",
                items: {
                    create: orderItems.map((item) => ({
                        supplierProductId: item.id,
                        orderedQty: item.unitQty,
                        deliveredQty: 0,
                        price: item.price || 0,
                        supplierCustomerId,
                        supplierOrder: {
                            create: { status: "PENDING",
                                total: (item.price || 0) * item.unitQty,
                                supplierId: supplierCustomerId,
                            }
                        }, // or provide a valid value if required
                        product: { connect: { id: item.id } }, // assuming item.productId exists
                    })),
                    include: { supplierProduct: true, product: true}
                },
            },
            include: {
                items: true,
                confirmedDeliveries: true,
                supplierOrders: true,
            },
        });
               
            

        return { success: true, order};

    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order");
    }
}
