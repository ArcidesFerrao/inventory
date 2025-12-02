"use server"
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { serviceStockItemSchema } from "@/schemas/schema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";


export async function getServiceStockItems(serviceId: string) {
  try {
    const items = await db.serviceStockItem.findMany({
            where: {
                serviceId,
        },
        include: {
            stockItem: true
        }
    }
    );
    return items;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
}



export async function createServiceStockItem(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect("/login");
    // if (!session?.user.supplyId) redirect("/register/supplier");
    const submission = parseWithZod(formData, { schema: serviceStockItemSchema });
    if (submission.status !== "success") return submission.reply();
 
    // console.log(session);
    
    try {
        const values = submission.value;

        const stockItem = await db.stockItem.create({
            data: {
                name: values.name,
                description: values.description,
                price: values.price,
                unitQty: values.unitQty,
                unitId: values.unitId,
                categoryId: values.categoryId,
                cost: values.cost,
                stock: values.stock,
                status: "ACTIVE",
                supplierId: "directPurchase",
            }
        });

        await db.serviceStockItem.create({
            data: {
                cost: values.price,
                stock: values.stock,
                stockItemId: stockItem.id,
                status: "ACTIVE",
                serviceId: values.serviceId
            }
        })

        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to create Stock Item", error);
        return {
            status: "error",
            error: { general: ["Failed to create Stock Item"]}
        } satisfies SubmissionResult<string[]>
    }
}


export async function editServiceStockItem(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect("/login");
    const submission = parseWithZod(formData, { schema: serviceStockItemSchema
        });
    if (submission.status !== "success") return submission.reply();

    // console.log(session);
    try {
        const values = submission.value;


        await db.serviceStockItem.update({
            where: {
                id: submission.value.id,
            },
            data: {
                stock: values.stock,
                cost: values.cost,
            }
        });

        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to update Service Stock Item", error);
        return {
            status: "error",
            error: { general: ["Failed to update Service Stock Item"]}
        } satisfies SubmissionResult<string[]>
    }
}

export async function deleteServiceStockItem(stockItemId: string) {

    try {
        await db.serviceStockItem.delete({
            where: {
                id: stockItemId,
            }
        });

        return {status: "success"}
    } catch (error) {
        console.error("Failed to delete Service Stock Item", error);
        return {
            status: "error",
            error: { general: ["Failed to delete Service Stock Item"]}
        } satisfies SubmissionResult<string[]>
    }

}
