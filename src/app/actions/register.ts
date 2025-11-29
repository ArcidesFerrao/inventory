'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseWithZod } from "@conform-to/zod";
import { SubmissionResult } from "@conform-to/react";
import { redirect } from "next/navigation";
import { serviceSchema, supplierSchema } from "@/schemas/roleSchema";


export async function registerService(prevState: unknown, formData: FormData) {
    const session = await auth()
    
    if (!session?.user) redirect("/login");
    const submission = parseWithZod(formData, { schema: serviceSchema });
    
    if (submission.status !== "success") return submission.reply();
    
    try {
        const values = submission.value;
        
        // console.log("User id: ",session.user.id)
        await db.service.create({
            data: {
                userId: session.user.id,
                businessName: values.businessName,
                phoneNumber: values.phoneNumber,
                description: values.description,
                location: values.location,
                businessType: values.businessType,
                website: values.website || "",
                operationHours: values.operationHours || "",
            }
        })
        
        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to create Service", error);
        
        return {
            status: "error",
            error: { general: ["Failed to create Service"]}
        } satisfies SubmissionResult<string[]>
    }
}
export async function registerSupplier(prevState: unknown, formData: FormData) {
    const session = await auth()
    
    if (!session?.user) redirect("/login");
    
    const submission = parseWithZod(formData, { schema: supplierSchema });
    
    if (submission.status !== "success") return submission.reply();
    
    try {
        const values = submission.value;
        
        await db.supplier.create({
            data: {
                userId: session.user.id,
                businessName: values.businessName,
                description: values.description,
                specialization: values.specialization,
                email: values.email,
                phoneNumber: values.phoneNumber,
                address: values.address,
                website: values.website || "",
                establishedYear: Number(values.establishedYear),
                
            }
        });
        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to create Supplier", error);
        
        return {
            status: "error",
            error: { general: ["Failed to create Supplier"]}
        } satisfies SubmissionResult<string[]>
    }
}
