import {
  ActivityLogsWithService,
  ActivityLogsWithSupplier,
} from "@/types/types";
import React from "react";
import LogListItem, { SupplierLogListItem } from "./List";

export function Logs({ logs }: { logs: ActivityLogsWithService[] }) {
  const totalLogs = logs.length;
  const infoLogs = logs.filter((log) => log.severity === "INFO");
  const warningLogs = logs.filter((log) => log.severity === "WARNING");
  const errorLogs = logs.filter((log) => log.severity === "ERROR");
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between py-5">
        <div className="flex flex-col gap-2">
          <p>Total Logs</p>
          <h2 className="text-xl font-bold">{totalLogs}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Info</p>
          <h2 className="text-xl font-bold">{infoLogs.length}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Warnings</p>
          <h2 className="text-xl font-bold">{warningLogs.length}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Errors</p>
          <h2 className="text-xl font-bold">{errorLogs.length}</h2>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {logs.map((log) => (
          <LogListItem
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
export function SupplierLogs({ logs }: { logs: ActivityLogsWithSupplier[] }) {
  const totalLogs = logs.length;
  const infoLogs = logs.filter((log) => log.severity === "INFO");
  const warningLogs = logs.filter((log) => log.severity === "WARNING");
  const errorLogs = logs.filter((log) => log.severity === "ERROR");
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between py-5">
        <div className="flex flex-col gap-2">
          <p>Total Logs</p>
          <h2 className="text-xl font-bold">{totalLogs}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Info</p>
          <h2 className="text-xl font-bold">{infoLogs.length}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Warnings</p>
          <h2 className="text-xl font-bold">{warningLogs.length}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Errors</p>
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
