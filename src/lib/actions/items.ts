"use server"
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { serviceStockItemSchema } from "@/schemas/schema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { createAuditLog } from "./auditLogs";
import { logActivity } from "./logs";


export async function getServiceStockItems(serviceId: string) {
  try {
    const items = await db.serviceStockItem.findMany({
            where: {
                serviceId,
        },
        include: {
            stockItem: true
        }
    }
    );
    return items;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
}



export async function createServiceStockItem(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect("/login");
    // if (!session?.user.supplyId) redirect("/register/supplier");
    const submission = parseWithZod(formData, { schema: serviceStockItemSchema });
    if (submission.status !== "success") return submission.reply();
 
    // console.log(session);
    
    try {
        const values = submission.value;

        const stockItem = await db.stockItem.create({
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
                supplierId: "directPurchase",
            },
        });

        const serviceStockItem = await db.serviceStockItem.create({
            data: {
                cost: values.price,
                stock: values.stock,
                stockItemId: stockItem.id,
                status: "ACTIVE",
                serviceId: values.serviceId
            },
            include: {
                service: true
            }
        })

        if (values) {
        
            await db.auditLog.create({
                data: {
                    action: "CREATE",
                    entityType: "ServiceStockItem",
                    entityId: values.serviceId || "",
                    entityName: serviceStockItem.service?.businessName || "",
                    details: {
                        metadata: values.name
                    }
                }
            }) 
        }
        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to create Stock Item", error);
        await logActivity(
        submission.value.serviceId,
        null,
        "ERROR",
        "ServiceStockItem",
        submission.value.id || "",
        `Error creating ${submission.value.name} from inventory`,
        {
            
                    },
        null,
        "ERROR",
        null
    );
        await createAuditLog({
            action: "ERROR",
            entityType: "Stock Item",
            entityId: submission.value.id || "",
            entityName: submission.value.name ,
            details: {
                metadata: {
                    error: (error as string).toString() || "Error creating serviceStockItem"
                }
            }
        });
        return {
            status: "error",
            error: { general: ["Failed to create Stock Item"]}
        } satisfies SubmissionResult<string[]>
    }
}


export async function editServiceStockItem(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect("/login");
    const submission = parseWithZod(formData, { schema: serviceStockItemSchema
        });
    if (submission.status !== "success") return submission.reply();

    // console.log(session);
    try {
        const values = submission.value;

        const oldStockItem = await db.serviceStockItem.findUnique({
            where: { id: values.id },
            include: {
                stockItem: true,
                service: true,
            },
        });

        if (!oldStockItem) {
            return {
                status: "error",
                error: { general: ["Stock item not found"] }
            } satisfies SubmissionResult<string[]>;
        }

        const serviceStockItem = await db.serviceStockItem.update({
            where: {
                id: submission.value.id,
            },
            data: {
                stock: values.stock,
                cost: values.cost,
            },
            include: {
                service: true
            }
        });

        if (values) {
        
            await db.auditLog.create({
                data: {
                    action: "UPDATE",
                    entityType: "ServiceStockItem",
                    entityId: values.serviceId || "",
                    entityName: serviceStockItem.service?.businessName || "",
                    details: {
                        changes: {
                        ...(oldStockItem.stock !== serviceStockItem.stock && {
                            stock: {
                                old: oldStockItem.stock,
                                new: serviceStockItem.stock,
                            }
                        }),
                        ...(oldStockItem.cost !== serviceStockItem.cost && {
                            cost: {
                                old: oldStockItem.cost,
                                new: serviceStockItem.cost,
                            }
                        }),
                    },
                    // Add context
                    metadata: {
                        serviceName: serviceStockItem.service.businessName,
                        productName: oldStockItem.stockItem.name,
                        updatedAt: new Date(),
                    }
                    }
                }
            }) 
        }

        await db.activityLog.create({
            data: {
                actionType: "STOCK_UPDATED",
                entityType: "ServiceStockItem",
                entityId: serviceStockItem.id,
                description: `Stock updated for ${oldStockItem.stockItem.name}`,
                details: {
                    oldStock: oldStockItem.stock,
                    newStock: serviceStockItem.stock,
                    oldCost: oldStockItem.cost,
                    newCost: serviceStockItem.cost,
                },
                severity: (serviceStockItem.stock || 0) < 10 ? "WARNING" : "INFO",
                serviceId: serviceStockItem.serviceId,
            }
        });

        return {status: "success"} satisfies SubmissionResult<string[]>
    } catch (error) {
        console.error("Failed to update Service Stock Item", error);
        await logActivity(
        submission.value.serviceId,
        null,
        "ERROR",
        "ServiceStockItem",
        submission.value.id || "",
        `Error updating ${submission.value.name} from inventory`,
        {
            
                    },
        null,
        "ERROR",
        null
    );
        await createAuditLog({
            action: "ERROR",
            entityType: "Stock Item",
            entityId: submission.value.id || "",
            entityName: submission.value.name ,
            details: {
                metadata: {
                    error: (error as string).toString() || "Error updating serviceStockItem"
                }
            }
        });
        return {
            status: "error",
            error: { general: ["Failed to update Service Stock Item"]}
        } satisfies SubmissionResult<string[]>
    }
}


export async function deleteServiceStockItem(stockItemId: string) {
    const session = await auth();
    if (!session?.user?.serviceId) redirect("/login");

    const stockItem = await db.serviceStockItem.findUnique({
        where: { id: stockItemId },
        include: { stockItem: true }
    });

    if (!stockItem) throw new Error("Not found");

    try {
        await db.serviceStockItem.delete({
            where: { id: stockItemId }
        });

        // Audit Log (save full details for recovery)
        await createAuditLog({
                action: "DELETE",
                entityType: "ServiceStockItem",
                entityId: stockItemId,
            entityName: stockItem.stockItem.name,
            details: {
                oldValues: {
                    stock: stockItem.stock?.toString() || "",
                    cost: stockItem.cost?.toString() || "",
                    stockItemId: stockItem.stockItemId,
                },
                metadata: {
                    deletedAt: new Date().toDateString(),
                }
            }
        });

    // Activity Log
    await logActivity(
        session.user.serviceId,
        null,
        "STOCK_REMOVED",
        "ServiceStockItem",
        stockItemId,
        `Removed ${stockItem.stockItem.name} from inventory`,
        {
            lastStock: stockItem.stock,
            lastCost: stockItem.cost,
        },
        null,
        "WARN",
        null
    );
    } catch (error ) {
        await logActivity(
        session.user.serviceId,
        null,
        "ERROR",
        "ServiceStockItem",
        stockItemId,
        `Error Removing ${stockItem.stockItem.name} from inventory`,
        {
            lastStock: stockItem.stock,
            lastCost: stockItem.cost,
        },
        null,
        "ERROR",
        null
    );
        await createAuditLog({
            action: "ERROR",
            entityType: "Stock Item",
            entityId: stockItemId,
            entityName: "",
            details: {
                metadata: {
                    error: (error as string).toString() || "Error deleting serviceStockItem"
                }
            }
        });

        return {success: false, error}
    }
    
}

// Example 3: Bulk stock adjustment
// export async function bulkAdjustStock(adjustments: Array<{ id: string; stock: number }>) {
    //     const session = await auth();
    //     if (!session?.user?.serviceId) redirect("/login");

//     const results = [];

//     for (const adjustment of adjustments) {
//         const oldItem = await db.serviceStockItem.findUnique({
//             where: { id: adjustment.id },
//             include: { stockItem: true }
//         });

//         if (!oldItem) continue;

//         const updated = await db.serviceStockItem.update({
//             where: { id: adjustment.id },
//             data: { stock: adjustment.stock },
//             include: { stockItem: true }
//         });

//         results.push({
//             // name: updated.stockItem.name,
//             oldStock: oldItem.stock,
//             newStock: updated.stock,
//         });
//     }

//     // Single Audit Log for bulk operation
//     await createAuditLog({
//         action: "BULK_UPDATE",
//         entityType: "ServiceStockItem",
//         entityId: "bulk",
//         entityName: `${adjustments.length} Stock Items`,
//         details: {
//             changes: results,
//             metadata: {
//                 count: adjustments.length,
//                 adjustedAt: new Date(),
//             }
//         }
//     });

//     // Single Activity Log
//     await logActivity({
//         serviceId: session.user.serviceId,
//         supplierId: "",
//         actionType: "BULK_STOCK_ADJUSTMENT",
//         entityType: "ServiceStockItem",
//         description: `Bulk adjusted ${adjustments.length} items`,
//         details: {
//             count: adjustments.length,
//             items: results,
//         },
//         severity: "INFO",
//     });
// }
