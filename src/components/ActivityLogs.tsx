"use client";

import {
  ActivityLogsWithService,
  ActivityLogsWithSupplier,
} from "@/types/types";
import LogListItem, { SupplierLogListItem } from "./List";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";

// const ENTITY_STYLES: Record<string, string> = {
//   SALE: "bg-green-400/10 text-green-400",
//   ORDER: "bg-blue-400/10 text-blue-400",
//   PURCHASE: "bg-amber-400/10 text-amber-400",
//   DELIVERY: "bg-purple-400/10 text-purple-400",
//   EXPENSE: "bg-red-400/10 text-red-400",
//   ITEM: "bg-base-content/10 text-base-content/60",
// };

// const SEVERITY_STYLES: Record<string, string> = {
//   INFO: "bg-base-content/5 text-base-content/40 border border-base-content/10",
//   WARNING: "bg-amber-400/10 text-amber-400",
//   ERROR: "bg-red-400/10 text-red-400",
//   SUCCESS: "bg-green-400/10 text-green-400",
// };

// const DOT_STYLES: Record<string, string> = {
//   INFO: "bg-base-content/30",
//   WARNING: "bg-amber-400",
//   ERROR: "bg-red-400",
//   SUCCESS: "bg-green-400",
// };

type Severity = "ALL" | "INFO" | "WARNING" | "ERROR";

export function Logs({ logs }: { logs: ActivityLogsWithService[] }) {
  const t = useTranslations("Common");
  const at = useTranslations("Activity");

  const [severityFilter, setSeverityFilter] = useState<Severity>("ALL");
  const [typeFilter, setTypeFilter] = useState("");
  const [query, setQuery] = useState("");

  // KPI counts — always from full log set
  const infoCount = logs.filter((l) => l.severity === "INFO").length;
  const warningCount = logs.filter((l) => l.severity === "WARNING").length;
  const errorCount = logs.filter((l) => l.severity === "ERROR").length;

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const matchSev =
        severityFilter === "ALL" || l.severity === severityFilter;
      const matchType =
        !typeFilter || l.entityType.toUpperCase() === typeFilter;
      const matchQ =
        !query ||
        l.description.toLowerCase().includes(query.toLowerCase()) ||
        l.actionType.toLowerCase().includes(query.toLowerCase()) ||
        l.entityType.toLowerCase().includes(query.toLowerCase());
      return matchSev && matchType && matchQ;
    });
  }, [logs, severityFilter, typeFilter, query]);

  // Group by calendar day
  const grouped = useMemo(() => {
    const map: Record<string, ActivityLogsWithService[]> = {};
    for (const log of filtered) {
      const key = new Date(log.timestamp).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!map[key]) map[key] = [];
      map[key].push(log);
    }
    return map;
  }, [filtered]);

  // Unique entity types for filter dropdown
  const entityTypes = [...new Set(logs.map((l) => l.entityType.toUpperCase()))];

  const kpis: {
    label: string;
    value: Severity;
    count: number;
    className?: string;
  }[] = [
    { label: at("totalLogs"), value: "ALL", count: logs.length },
    { label: t("info"), value: "INFO", count: infoCount },
    {
      label: t("warnings"),
      value: "WARNING",
      count: warningCount,
      className: "text-amber-400",
    },
    {
      label: t("errors"),
      value: "ERROR",
      count: errorCount,
      className: "text-red-400",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* KPI cards — click to filter by severity */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((k) => (
          <button
            key={k.value}
            type="button"
            onClick={() => setSeverityFilter(k.value)}
            className={`stats p-3 flex flex-col justify-between gap-1 text-left transition-all border ${
              severityFilter === k.value
                ? "border-base-content/30"
                : "border-transparent"
            }`}
          >
            <p className="label-text text-xs uppercase tracking-wide">
              {k.label}
            </p>
            <h4 className={`text-xl font-bold ${k.className ?? ""}`}>
              {k.count}
            </h4>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 text-sm"
          placeholder={at("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">{t("allTypes")}</option>
          {entityTypes.map((et) => (
            <option key={et} value={et}>
              {et}
            </option>
          ))}
        </select>
      </div>

      {/* Result count hint */}
      {(query || typeFilter || severityFilter !== "ALL") && (
        <p className="text-xs text-base-content/50">
          {filtered.length} {t("of")} {logs.length} {at("records")}
        </p>
      )}

      {/* Timeline grouped by date */}
      {filtered.length === 0 ? (
        <p className="text-sm text-base-content/50 text-center py-8">
          {at("noLogs")}...
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {Object.entries(grouped).map(([date, entries]) => (
            <div key={date}>
              {/* Date divider */}
              <p className="text-xs text-base-content/40 uppercase tracking-widest font-medium py-3 pl-4">
                {date}
              </p>
              {/* Timeline entries */}
              <ul className="relative flex flex-col gap-2">
                {/* Vertical line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-base-content/10" />
                {entries.map((log) => (
                  <LogListItem
                    key={log.id}
                    actionType={log.actionType}
                    description={log.description}
                    entityType={log.entityType}
                    severity={log.severity}
                    id={log.id}
                    timestamp={log.timestamp}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export function SupplierLogs({ logs }: { logs: ActivityLogsWithSupplier[] }) {
  const t = useTranslations("Common");
  const at = useTranslations("Activity");

  const totalLogs = logs.length;
  const infoLogs = logs.filter((log) => log.severity === "INFO");
  const warningLogs = logs.filter((log) => log.severity === "WARNING");
  const errorLogs = logs.filter((log) => log.severity === "ERROR");
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between py-5">
        <div className="flex flex-col gap-2">
          <p>{at("totalLogs")}</p>
          <h2 className="text-xl font-bold">{totalLogs}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Info</p>
          <h2 className="text-xl font-bold">{infoLogs.length}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>{t("warnings")}</p>
          <h2 className="text-xl font-bold">{warningLogs.length}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>{t("errors")}</p>
          <h2 className="text-xl font-bold">{errorLogs.length}</h2>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {logs.map((log) => (
          <SupplierLogListItem
            key={log.id}
            actionType={log.actionType}
            description={log.description}
            entityType={log.entityType}
            severity={log.severity}
            id={log.id}
            timestamp={log.timestamp}
            // details={log.details}
          />
        ))}
      </ul>
    </div>
  );
}
