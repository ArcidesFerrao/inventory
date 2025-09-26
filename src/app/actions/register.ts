'use server'

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseWithZod } from "@conform-to/zod";
import { SubmissionResult } from "@conform-to/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { serviceSchema, supplierSchema } from "@/schemas/roleSchema";


export async function registerService(prevState: unknown, formData: FormData) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) redirect("/login");
    
    const submission = parseWithZod(formData, { schema: serviceSchema });
    
    if (submission.status !== "success") return submission.reply();
    
    try {
        const values = submission.value;
        
        await db.service.create({
            data: {
                businessName: values.businessName,
                description: values.description,
                location: values.location,
                businessType: values.businessType,
                website: values.website || "",
                operationHours: JSON.parse(values.operationHours || ""),
                userId: session.user.id
            }
        })
        
        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to create Product", error);
        
        return {
            status: "error",
            error: { general: ["Failed to create Product"]}
        } satisfies SubmissionResult<string[]>
    }
}
export async function registerSupplier(prevState: unknown, formData: FormData) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) redirect("/login");
    
    const submission = parseWithZod(formData, { schema: supplierSchema });
    
    if (submission.status !== "success") return submission.reply();
    
    try {
        const values = submission.value;
        
        await db.supplier.create({
            data: {
                userId: session.user.id,
                name: values.name,
                description: values.description,
                email: values.email,
                phone: values.phone,
                address: values.address,
                website: values.website || "",
                establishedYear: values.establishedYear,
                
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
