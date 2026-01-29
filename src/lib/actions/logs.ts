import { db } from "@/lib/db";

export async function getActivityLogs(serviceId: string) {
  return await db.activityLog.findMany({
    where: {
        serviceId
    },
    orderBy: {
        timestamp: 'desc',
    },
    take: 20,
    include: {
        Service: {
            select: { businessName: true, businessType: true, id: true }
        }
    }
  });
}

export async function getSupplierActivityLogs(supplierId: string) {
  return await db.activityLog.findMany({
    where: {
        supplierId
    },
    orderBy: {
        timestamp: 'desc',
    },
    take: 20,
    include: {
        Supplier: {
            select: { businessName: true, phoneNumber: true, id: true }
        }
    }
  });
}

export async function logActivity(
  serviceId: string | null, 
  supplierId: string | null, 
  actionType: string, 
  entityType: string, 
  entityId: string | null, 
  description: string, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: Record<string, any>,
  ipAddress: string | null, 
  severity: 'INFO' | 'WARN' | 'ERROR' = 'INFO',
  device: string | null = null,
) {
  try {
    const activity = await db.activityLog.create({
      data: {
        serviceId,
        supplierId,
        actionType,
        entityType,
        entityId,
        description,
        details,
        ipAddress,
        severity,
        device,
      }
  })
    if (!activity) {
      console.error("Failed to log activity: No activity returned");
      return { success: false };
    }

    return { success: true, activityId: activity.id };
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}


export const ActivityActions = {
  // Sales
  SALE_CREATED: "CREATED",
  SALE_UPDATED: "UPDATED",
  SALE_CANCELLED: "CANCELLED",
  
  // Inventory
  STOCK_UPDATED: "UPDATED",
  LOW_STOCK_ALERT: "LOW_ALERT",
  OUT_OF_STOCK: "OUT_OF",
  STOCK_ADJUSTED: "ADJUSTED",
  
  // Purchases
  PURCHASE_CREATED: "CREATED",
  PURCHASE_RECEIVED: "RECEIVED",
  
  // Prices
  PRICE_UPDATED: "UPDATED",
  BULK_PRICE_UPDATE: "BULK_UPDATE",
  
  // System
  SYSTEM_ERROR: "SYSTEM_ERROR",
  API_CALL: "API_CALL",
  SCHEDULED_TASK: "SCHEDULED",
  INTEGRATION_SYNC: "INTEGRATION_SYNC",
  
  // Reports
  REPORT_GENERATED: "REPORT_GENERATED",
  EXPORT_COMPLETED: "EXPORT_COMPLETED",

} as const