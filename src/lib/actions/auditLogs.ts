import { auth } from "@/lib/auth";
import { db } from "@/lib/db";


type AuditAction = | "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "BULK_UPDATE" | "BULK_DELETE" | "ERROR";

interface CreateAuditLogParams {
    action: AuditAction;
    entityType: string;
    entityId: string;
    entityName: string;
    details?: {
        oldValues?: Record<string, string>;
        newValues?: Record<string, string>;
        changes?: Record<string, {old: string; new: string}>;
        metadata?: Record<string, string>;

    }
}


export async function createAuditLog(params:CreateAuditLogParams) {
    try {
        const session = await auth();

        await db.auditLog.create({
            data: {
                userId: session?.user.id,
                action: params.action,
                entityType: params.entityType,
                entityId: params.entityId,
                entityName: params.entityName,
                details: params.details || {}
            }
        })

        return {success: true,}

    } catch (error) {
        console.error("Failed to create audit log: ", error)
        return {success: false, message: error}
    }
}


export function getChanges<T extends Record<string,string>>(oldData: T, newData: T): Record<string, {old: string; new: string}> {
    const changes: Record<string, {old: string; new: string}> = {}

    for (const key in newData) {
        if (oldData[key] !== newData[key]) {
            changes[key] = {
                old: oldData[key],
                new: newData[key],
                
            }
        }
    }

    return changes
}

export async function getAuditLogs(filters?: {
  userId?: string;
  entityType?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  try {
    const session = await auth();
    if (!session?.user) return [];

    const logs = await db.auditLog.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.entityType && { entityType: filters.entityType }),
        ...(filters?.action && { action: filters.action }),
        ...(filters?.startDate && {
          createdAt: { gte: filters.startDate },
        }),
        ...(filters?.endDate && {
          createdAt: { lte: filters.endDate },
        }),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: filters?.limit || 50,
    });

    return logs;
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return [];
  }
}