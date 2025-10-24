'use server'

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { productSchema, supplierProductSchema } from "@/schemas/productSchema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function createProduct(prevState: unknown, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    const submission = parseWithZod(formData, { schema: productSchema });
    if (submission.status !== "success") return submission.reply();

    console.log(session);
    
    try {
        const values = submission.value;

        await db.product.create({
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
                MenuItems: {
                    create: values.recipe?.map((r) => ({
                        quantity: r.quantity,
                        stockId: r.stockId,
                        // productId: r.stockId,
                    })) || [],
                }
            }
        });

        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to create Product", error);
        return {
            status: "error",
            error: { general: ["Failed to create Product"]}
        } satisfies SubmissionResult<string[]>
    }
}

export async function editProduct(prevState: unknown, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    const submission = parseWithZod(formData, { schema: productSchema });
    if (submission.status !== "success") return submission.reply();

    console.log(session);
    try {
        const values = submission.value;


        await db.product.update({
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
                // serviceId: session.user.serviceId,
                MenuItems: {
                    deleteMany: {},
                    create: values.recipe?.map((r) => ({
                        quantity: r.quantity,
                        stockId: r.stockId,
                        // productId: r.stockId,
                    })) || [],
                }
            }
        });

        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to update Product", error);
        return {
            status: "error",
            error: { general: ["Failed to update Product"]}
        } satisfies SubmissionResult<string[]>
    }
}


export async function getProducts(serviceId: string) {
  try {
    const products = await db.product.findMany(
        {where: {
            serviceId,
            type: "STOCK",
        }}
    );
    return products;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return [];
  }
}



export async function getProduct({id}: {id: string}) {
  try {
    const product = await db.product.findUnique(
        {where: {
            id,
        }}
    );
    return product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return [];
  }
}

export async function getSupplierProducts(supplierId: string) {
  try {
    const products = await db.supplierProduct.findMany({
        where: {supplierId}
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return [];
  }
}



export async function createSupplierProduct(prevState: unknown, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    // if (!session?.user.supplyId) redirect("/register/supplier");
    const submission = parseWithZod(formData, { schema: supplierProductSchema });
    if (submission.status !== "success") return submission.reply();
 
    console.log(session);
    
    try {
        const values = submission.value;

        await db.supplierProduct.create({
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
        console.error("Failed to create Supplier Product", error);
        return {
            status: "error",
            error: { general: ["Failed to create Supplier Product"]}
        } satisfies SubmissionResult<string[]>
    }
}

export async function editSupplierProduct(prevState: unknown, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    const submission = parseWithZod(formData, { schema: supplierProductSchema
        });
    if (submission.status !== "success") return submission.reply();

    // console.log(session);
    try {
        const values = submission.value;


        await db.supplierProduct.update({
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
        console.error("Failed to update Supplier Product", error);
        return {
            status: "error",
            error: { general: ["Failed to update Supplier Product"]}
        } satisfies SubmissionResult<string[]>
    }
}

export async function deleteSupplierProduct(supplierProductId: string) {

    try {
        await db.supplierProduct.delete({
            where: {
                id: supplierProductId,
            }
        });

        return {status: "success"}
    } catch (error) {
        console.error("Failed to delete Supplier Product", error);
        return {
            status: "error",
            error: { general: ["Failed to delete Supplier Product"]}
        } satisfies SubmissionResult<string[]>
    }

}