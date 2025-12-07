"use client";

import {
  AuditLogFilterProps,
  AuditLogStatsProps,
  AuditLogTableProps,
} from "@/types/types";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function AuditLogStats({
  totalLogs,
  last24Hours,
  actionStats,
  entityTypeStats,
}: AuditLogStatsProps) {
  const topAction = actionStats[0];
  const topEntityType = entityTypeStats[0];

  return (
    <div className="flex justify-between">
      <div>
        <div>
          <span></span>
          <div>
            <p>Total Logs</p>
            <h3>{totalLogs.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div>
        <div>
          <span></span>
          <div>
            <p>Last 24 Hours</p>
            <h3>{last24Hours.toLocaleString()}</h3>
          </div>
        </div>
      </div>
      <div>
        <div>
          <span></span>
          <div>
            <p>Top Action</p>
            <h3>{topAction.action}</h3>
            <p>{topAction._count} times</p>
          </div>
        </div>
      </div>
      <div>
        <div>
          <span></span>
          <div>
            <p>Top Entity</p>
            {/* <h3>{topEntityType.entityType}</h3> */}
            <p>{topEntityType._count} logs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuditLogFilters({
  currentFilters,
  // users,
  // entityTypes,
  actions,
}: AuditLogFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState(currentFilters);

  const updateFilters = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    startTransition(() => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([k, v]) => {
        if (v && v !== "all") {
          params.set(k, v);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setFilters({});
    router.push(pathname);
  };

  const hasActiveFilters = Object.values(currentFilters).some(
    (v) => v && v !== "all"
  );

  return (
    <div className="flex flex-col gap-1">
      <div>
        <h3 className="text-2xl font-medium ">Filters</h3>
        {hasActiveFilters && <button onClick={clearFilters}>Clear</button>}
      </div>

      <div className="flex gap-1 items-center">
        <label htmlFor="search">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilters("search", e.target.value)}
          placeholder="Entity name or Id..."
          disabled={isPending}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium mb-1">Action</label>
          <select
            value={filters.action || "all"}
            onChange={(e) => updateFilters("action", e.target.value)}
            className="w-full "
            disabled={isPending}
          >
            <option value="all">All Actions</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
        {/* <div className="flex flex-col gap-1">
          <label htmlFor="userId">User</label>
          <select
            name="userId"
            id="userId"
            value={filters.userId || "all"}
            onChange={(e) => updateFilters("userId", e.target.value)}
            disabled={isPending}
          >
            <option value="all">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {isPending && (
        <div className="flex items-center justify-center mt-4">
          <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
          <span className="ml-2 text-sm text-gray-500">Filtering...</span>
        </div>
      )}
    </div>
  );
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            {/* <th>User</th> */}
            <th>Action</th>
            <th>Type</th>
            <th>Entity</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <>
              <tr key={log.id} onClick={() => toggleRow(log.id)}>
                <td>{formatDate(log.createdAt)}</td>
                <td>{log.action}</td>
                <td>{log.entityType}</td>
                <td>{log.entityName}</td>
                <td>
                  <button>
                    {expandedRow === log.id ? "▼" : "▶"} View Detail
                  </button>
                </td>
              </tr>
              {/* {expandedRow === log.id && <tr> 
                <td colSpan={5} className="p-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Details</h4>
                      
                      {log.details?.changes && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Changes:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(log.details.changes).map(([key, value]: [string, any]) => (
                              <div key={key} className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                  {key}
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-red-600 dark:text-red-400 line-through">
                                    {JSON.stringify(value.old)}
                                  </span>
                                  <span>→</span>
                                  <span className="text-green-600 dark:text-green-400 font-medium">
                                    {JSON.stringify(value.new)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {log.details?.oldValues && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Previous Values:</h5>
                          <pre className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-xs overflow-x-auto">
                            {JSON.stringify(log.details.oldValues, null, 2)}
                          </pre>
                        </div>
                      )}

                      {log.details?.newValues && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">New Values:</h5>
                          <pre className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-xs overflow-x-auto">
                            {JSON.stringify(log.details.newValues, null, 2)}
                          </pre>
                        </div>
                      )}

                      {log.details?.metadata && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Metadata:</h5>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(log.details.metadata).map(([key, value]) => (
                              <div key={key} className="px-2 py-1 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-xs">
                                <span className="font-semibold">{key}:</span> {JSON.stringify(value)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(!log.details?.changes && !log.details?.oldValues && !log.details?.newValues) && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Raw Details:</h5>
                          <pre className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-xs overflow-x-auto max-h-60 overflow-y-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>*/}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
