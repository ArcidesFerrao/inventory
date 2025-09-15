import { db } from "@/lib/db";

export default async function getActivityLogs(userId: string) {
  return await db.activityLog.findMany({
    where: {
        userId
    },
    orderBy: {
        timestamp: 'desc',
    },
    take: 20,
    include: {
        user: {
            select: { name: true, email: true, id: true }
        }
    }
  });
}

export async function logActivity(
  userId: string, 
  actionType: string, 
  entityType: string, 
  entityId: string | null, 
  description: string, 
  details: string, 
  ipAddress: string | null, 
  severity: 'INFO' | 'WARN' | 'ERROR' = 'INFO',
  device: string | null = null,
) {
  try {
    await db.activityLog.create({
      data: {
        userId,
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
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}