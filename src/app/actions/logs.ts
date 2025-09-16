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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: Record<string, any>,
  ipAddress: string | null, 
  severity: 'INFO' | 'WARN' | 'ERROR' = 'INFO',
  device: string | null = null,
) {
  try {
    const activity = await db.activityLog.create({
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
    if (!activity) {
      console.error("Failed to log activity: No activity returned");
      return { success: false };
    }

    return { success: true, activityId: activity.id };
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}