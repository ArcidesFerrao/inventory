'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { itemSchema, stockItemSchema } from "@/schemas/schema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";

export async function createItem(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect("/login");
    const submission = parseWithZod(formData, { schema: itemSchema });
    if (submission.status !== "success") return submission.reply();

    console.log(session);
    
    try {
        const values = submission.value;

        await db.item.create({
            data: {
                name: values.name,
                description: values.description,
                price: values.price,
                unitQty: values.unitQty,
                unitId: values.unitId,
                categoryId: values.categoryId,
                type: values.type,
                stock: values.stock,
                status: "ACTIVE",
                serviceId: values.serviceId,
                CatalogItems: {
                    create: values.recipe?.map((r) => ({
                        quantity: r.quantity,
                        serviceStockItemId: r.serviceStockItemId,
                    })) || [],
                }
            }
        });

        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to create Item", error);
        return {
            status: "error",
            error: { general: ["Failed to create Item"]}
        } satisfies SubmissionResult<string[]>
    }
}

export async function editItem(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect("/login");
    const submission = parseWithZod(formData, { schema: itemSchema });
    if (submission.status !== "success") return submission.reply();

    console.log(session);
    try {
        const values = submission.value;


        await db.item.update({
            where: {
                id: submission.value.id,
            },
            data: {
                name: values.name,
                description: values.description,
                price: values.price,
                unitQty: values.unitQty,
                unitId: values.unitId,
                categoryId: values.categoryId,
                type: values.type,
                stock: values.stock,
                status: "ACTIVE",
                CatalogItems: {
                    deleteMany: {},
                    create: values.recipe?.map((r) => ({
                        quantity: r.quantity,
                        serviceStockItemId: r.serviceStockItemId,

                    })) || [],
                }
            }
        });

        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to update Item", error);
        return {
            status: "error",
            error: { general: ["Failed to update Item"]}
        } satisfies SubmissionResult<string[]>
    }
}


export async function getItems(serviceId: string) {
  try {
    const items = await db.item.findMany({
            where: {
                serviceId,
        }}
    );
    return items;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
}



export async function getItem({id}: {id: string}) {
  try {
    const item = await db.item.findUnique(
        {where: {
            id,
        }}
    );
    return item;
  } catch (error) {
    console.error("Failed to fetch item:", error);
    return [];
  }
}

export async function getStockItems(supplierId: string) {
  try {
    const stockItems = await db.stockItem.findMany({
        where: {supplierId}
    });
    return stockItems;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
}
export async function getSelectedStockItems(supplierId: string) {
  try {
    const stockItems = await db.stockItem.findMany({
        where: {supplierId},
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
        }
    }
);
    return stockItems;
  } catch (error) {
    console.error("Failed to fetch stockItems:", error);
    return [];
  }
}



export async function createStockItem(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect("/login");
    // if (!session?.user.supplyId) redirect("/register/supplier");
    const submission = parseWithZod(formData, { schema: stockItemSchema });
    if (submission.status !== "success") return submission.reply();
 
    // console.log(session);
    
    try {
        const values = submission.value;

        await db.stockItem.create({
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
                supplierId: values.supplierId,
            }
        });

        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to create Stock Item", error);
        return {
            status: "error",
            error: { general: ["Failed to create Stock Item"]}
        } satisfies SubmissionResult<string[]>
    }
}

export async function editStockItem(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect("/login");
    const submission = parseWithZod(formData, { schema: stockItemSchema
        });
    if (submission.status !== "success") return submission.reply();

    // console.log(session);
    try {
        const values = submission.value;


        await db.stockItem.update({
            where: {
                id: submission.value.id,
            },
            data: {
                name: values.name,
                description: values.description,
                price: values.price,
                unitQty: values.unitQty,
                categoryId: values.categoryId,
                unitId: values.unitId,
                stock: values.stock,
                cost: values.cost,
                status: "ACTIVE",
                // supplierId: session.user.id,
            }
        });

        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to update Stock Item", error);
        return {
            status: "error",
            error: { general: ["Failed to update Stock Item"]}
        } satisfies SubmissionResult<string[]>
    }
}

export async function deleteStockItem(stockItemId: string) {

    try {
        await db.stockItem.delete({
            where: {
                id: stockItemId,
            }
        });

        return {status: "success"}
    } catch (error) {
        console.error("Failed to delete Stock Item", error);
        return {
            status: "error",
            error: { general: ["Failed to delete Stock Item"]}
        } satisfies SubmissionResult<string[]>
    }

}


export async function getStockItemsNames(q: string) {
  try {
    const stockItems = await db.stockItem.findMany({
      where: {
        // type: "STOCK",
        name: {
            contains: q,
            mode: "insensitive"
        },
        status: "ACTIVE"
      },
      select: {
        name: true
      }
    });

    const uniqueNames = [...new Set(stockItems.map((p) => p.name))]
    return uniqueNames;
  } catch (error) {
    console.error("Failed to fetch stockItems:", error);
    return [];
  }
}
