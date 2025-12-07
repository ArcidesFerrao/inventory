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
  SALE_CREATED: "SALE_CREATED",
  SALE_UPDATED: "SALE_UPDATED",
  SALE_CANCELLED: "SALE_CANCELLED",
  
  // Inventory
  STOCK_UPDATED: "STOCK_UPDATED",
  LOW_STOCK_ALERT: "LOW_STOCK_ALERT",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  STOCK_ADJUSTED: "STOCK_ADJUSTED",
  
  // Purchases
  PURCHASE_CREATED: "PURCHASE_CREATED",
  PURCHASE_RECEIVED: "PURCHASE_RECEIVED",
  
  // Prices
  PRICE_UPDATED: "PRICE_UPDATED",
  BULK_PRICE_UPDATE: "BULK_PRICE_UPDATE",
  
  // System
  SYSTEM_ERROR: "SYSTEM_ERROR",
  API_CALL: "API_CALL",
  SCHEDULED_TASK: "SCHEDULED_TASK",
  INTEGRATION_SYNC: "INTEGRATION_SYNC",
  
  // Reports
  REPORT_GENERATED: "REPORT_GENERATED",
  EXPORT_COMPLETED: "EXPORT_COMPLETED",

} as const