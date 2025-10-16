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
            select: { name: true, phone: true, id: true }
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