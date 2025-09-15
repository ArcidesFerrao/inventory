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
