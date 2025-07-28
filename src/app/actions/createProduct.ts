'use server'

import { db } from "@/lib/db";
import { productSchema } from "@/schemas/productSchema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

export async function createProduct(prevState: unknown, formData: FormData) {
    console.log("trying to create product")
    const submission = parseWithZod(formData, { schema: productSchema });
    console.log("submission in")
    if (submission.status !== "success") return submission.reply();
    
    try {
        const values = submission.value;


        await db.product.create({
            data: {
                ...values,
                status: "ACTIVE",
                userId: "cmdj0iaum00002xl8jtvtmgzi"
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