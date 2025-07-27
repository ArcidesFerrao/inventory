import { db } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { productSchema } from "@/schemas/productSchema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { cookies } from "next/headers";

export async function createProdutct(prevState: unknown, formData: FormData) {
    const submission = parseWithZod(formData, { schema: productSchema });
    if (submission.status !== "success") return submission.reply();
    
    try {

        const cookieStore = cookies();
        verifyToken({ cookies: cookieStore });

        const values = submission.value;


        await db.product.create({
            data: {
                ...values,
                status: "ACTIVE",
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