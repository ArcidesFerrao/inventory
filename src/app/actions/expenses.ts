'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { expenseSchema } from "@/schemas/schema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";

export async function createExpense(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect("/login");
    const submission = parseWithZod(formData, { schema: expenseSchema });
    if (submission.status !== "success") return submission.reply();

    // console.log(session);
    
    try {
        const values = submission.value;
        // console.log(values);

        await db.expense.create({
            data: {
                amount: values.amount,
                description: values.description,
                paymentMethod: "CASH",
                serviceId: values.serviceId,
                userId: values.userId

            }
        })

        console.log()
   return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to create Expense", error);
        return {
            status: "error",
            error: { general: ["Failed to create Expense"]}
        } satisfies SubmissionResult<string[]>
    }
}