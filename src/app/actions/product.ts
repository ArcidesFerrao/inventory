'use server'

import { Prisma, ProfileStatus } from "@/generated/prisma";
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

    // console.log(session);
    
    try {
        const values = submission.value;
        // console.log(values);

         const activeCatalogItems = values.CatalogItems?.filter(
            item => item.quantity > 0
        ) || [];

        // console.log(activeCatalogItems)

        await db.$transaction(async (tx) => {

            await assertCanAddProduct(tx, values.serviceId, undefined);

            
            await tx.item.create({
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
                    create: activeCatalogItems.map((r) => ({
                        quantity: r.quantity,
                        serviceStockItemId: r.serviceStockItemId,
                        stockItemId: r.stockItemId
                    })) || [],
                }
            }
        });
    })

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

    // console.log(session);
    try {
        const values = submission.value;

        const activeCatalogItems = values.CatalogItems?.filter(
            item => item.quantity > 0
        ) || [];

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
                    create: activeCatalogItems.map((r) => ({
                        quantity: r.quantity,
                        serviceStockItemId: r.serviceStockItemId,
                        stockItemId: r.stockItemId
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
            category: {
                select: {
                    name: true
                }
            }
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

type ProductLimits = Record<ProfileStatus, number>;

export async function getProductLimits() : Promise<ProductLimits> {
    const config = await db.systemConfig.findUnique({
        where: {
            key: "product_limits_by_profile_status"
        }
    })

    if (!config) {
        throw new Error("SYSTEM_CONFIG_MISSING: product limits")
    }

    return config.value as ProductLimits
}

export async function assertCanAddProduct(
    tx: Prisma.TransactionClient,
    serviceId?: string,
    supplierId?: string
) {

    const service = await tx.service.findUnique({
        where: {
            id: serviceId
        },
        include: {
            user: {
                select: {
                    profileStatus: true,
                    role: true
                }
            }
        }
    })
    const supplier = await tx.supplier.findUnique({
        where: {
            id: supplierId
        },
        include: {
            user: {
                select: {
                    profileStatus: true,
                    role: true
                }
            }
        }
    })

    if (!service || !supplier) throw new Error("USER_NOT_FOUND")
    if (service.user.role === "ADMIN" || supplier.user.role === "ADMIN") return

    const limits = await getProductLimits()
    if (service) {
        const limit = limits[service.user.profileStatus]
        if (limit === -1) return
    
        if (limit === 0) {
            throw new Error("PRODUCT_CREATION_NOT_ALLOWED")
        }
    
        const count = await tx.item.count({
            where: {
                serviceId
            }
        })
    
        if (count >= limit) {
            throw new Error("PRODUCT_LIMIT_EXCEEDED")
        }
    } 

    if (supplier) {
        const limit = limits[supplier.user.profileStatus]
        if (limit === -1) return
        if (limit === 0) {
            throw new Error("PRODUCT_CREATION_NOT_ALLOWED")
        }

        const count = await tx.stockItem.count({
            where: {
                supplierId
            }
        })
        if (count >= limit) {
            throw new Error("PRODUCT_LIMIT_EXCEEDED")
        }

    }

}