import {
  AuditLogFilters,
  AuditLogStats,
  AuditLogTable,
} from "@/components/AuditLog";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AuditSearchParams, WhereClause } from "@/types/types";
import { redirect } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams: Promise<AuditSearchParams>;
}) {
  const session = await auth();

  if (!session?.user.isAdmin) {
    redirect("/");
  }

  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const searchQuery = params.search?.toLowerCase() || "";

  const where: WhereClause = {
    ...(params.userId && { userId: params.userId }),
    ...(params.entityType && { entityType: params.entityType }),
    ...(params.action && { action: params.action }),
    ...(params.startDate && {
      createdAt: { gte: new Date(params.startDate) },
    }),
    ...(params.endDate && {
      createdAt: {
        ...((params.startDate && { gte: new Date(params.startDate) }) || {}),
        lte: new Date(params.endDate),
      },
    }),
    ...(searchQuery && {
      OR: [
        { entityName: { contains: searchQuery, mode: "insensitive" } },
        { entityId: { contains: searchQuery, mode: "insensitive" } },
      ],
    }),
  };

  const [logs, totalCount, stats] = await Promise.all([
    db.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),

    db.auditLog.count({ where }),

    Promise.all([
      db.auditLog.groupBy({
        by: ["action"],
        _count: true,
        orderBy: { _count: { action: "desc" } },
      }),
      db.auditLog.groupBy({
        by: ["entityId"],
        _count: true,
        orderBy: { _count: { entityType: "desc" } },
      }),
      db.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]),
  ]);

  const [users, entityType, actions] = await Promise.all([
    db.user.findMany({
      where: {
        AuditLog: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    }),
    db.auditLog.findMany({
      distinct: ["entityType"],
      select: { entityType: true },
    }),
    db.auditLog.findMany({
      distinct: ["action"],
      select: { action: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const [actionStats, entityTypeStats, last24Hours] = stats;

  return (
    <>
      <div className="admin-header flex flex-col gap-2">
        <h1 className="text-4xl font-medium ">Audit Logs</h1>
        <p>Complete audit trail of all user actions in the stystem</p>
      </div>

      <AuditLogStats
        totalLogs={totalCount}
        last24Hours={last24Hours}
        actionStats={actionStats}
        entityTypeStats={entityTypeStats}
      />

      <AuditLogFilters
        currentFilters={{
          userId: params.userId,
          entityType: params.entityType,
          action: params.action,
          startDate: params.startDate,
          endDate: params.endDate,
          search: params.search,
        }}
        users={users}
        entityTypes={entityType.map((e) => e.entityType)}
        actions={actions.map((a) => a.action)}
      />

      <div>
        <p>
          Showing <span>{logs.length}</span> of <span>{totalCount}</span> logs
          {searchQuery && (
            <span>
              matching <span>{searchQuery}</span>{" "}
            </span>
          )}
        </p>
        <div className="">
          Page {page} of {totalPages}
        </div>
      </div>

      <AuditLogTable logs={logs} />

      {/* <div className="admin-users flex flex-col gap-5">
        <h2 className="text-lg font-bold">Recent Activity</h2>
        <ul>
          {logs.map((log) => (
            <li key={log.id} className="flex flex-col gap-2">
              <div className="flex">
                <div>{log.action}</div>
                <div>{log.entityName}</div>
              </div>
              <div>{log.details?.toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div> */}
    </>
  );
}
