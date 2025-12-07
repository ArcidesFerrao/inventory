'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { expenseSchema } from "@/schemas/schema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { logActivity } from "./logs";

export async function createExpense(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect("/login");
    const submission = parseWithZod(formData, { schema: expenseSchema });
    if (submission.status !== "success") return submission.reply();

    // console.log(session);
    
    try {
        const values = submission.value;
        // console.log(values);

        const expense = await db.expense.create({
            data: {
                amount: values.amount,
                description: values.description,
                paymentMethod: "CASH",
                serviceId: values.serviceId,
                userId: values.userId

            }
        })

        await logActivity(
                    expense.serviceId,
                    null,
                    "CREATE",
                    "Expense",
                    expense.id,
                    `Expense amount MZN ${expense.amount.toFixed(2)} created`,
                    {
                        
                        timeStamp: expense.timestamp,
                        
                        
                    },
                    null,
                    'INFO',
                    null
                );
        console.log()

        await db.auditLog.create({
            data: {
                action: "CREATE",
                entityType: "Expense",
                entityId: values.serviceId,
                entityName: "service",
                details: {
                    metadata: values.description
                }
            }
        })
   return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to create Expense", error);
        return {
            status: "error",
            error: { general: ["Failed to create Expense"]}
        } satisfies SubmissionResult<string[]>
    }
}

export async function createCategoryExpense({name, description}:{name: string; description: string | undefined}) {
    const session = await auth()
    if (!session?.user.serviceId) redirect("/login");
    
    try {

        const category = await db.expenseCategory.create({
            data: {
                name: name,
                description: description,
                serviceId: session.user.serviceId,
            }
        })

        await logActivity(
                    category.serviceId,
                    null,
                    "CREATE",
                    "Category Expense",
                    category.id,
                    `Expense category ${category.name} created`,
                    {                    },
                    null,
                    'INFO',
                    null
                );
        console.log() 
        
        await db.auditLog.create({
            data: {
                action: "CREATE",
                entityType: "Expense",
                entityId: session.user.serviceId,
                entityName: "service",
                details: {
                    metadata: description
                }
            }
        })
   return {status: "success"} 
    } catch (error) {
        console.error("Failed to create Expense", error);
        return {
            status: "error",
            error: "Failed to create Expense"
        } 
    }
}