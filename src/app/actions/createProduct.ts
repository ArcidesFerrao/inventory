'use server'

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { productSchema } from "@/schemas/productSchema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function createProduct(prevState: unknown, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    console.log("trying to create product")
    const submission = parseWithZod(formData, { schema: productSchema });
    console.log("submission in")
    if (submission.status !== "success") return submission.reply();

    console.log(session);
    try {
        const values = submission.value;


        await db.product.create({
            data: {
                ...values,
                status: "ACTIVE",
                userId: session.user.id
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