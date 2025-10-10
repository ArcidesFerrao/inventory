import { ActivityLogsWithService } from "@/types/types";
import React from "react";
import LogListItem from "./List";

export default function Logs({ logs }: { logs: ActivityLogsWithService[] }) {
  const totalLogs = logs.length;
  const infoLogs = logs.filter((log) => log.severity === "INFO");
  const warningLogs = logs.filter((log) => log.severity === "WARNING");
  const errorLogs = logs.filter((log) => log.severity === "ERROR");
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p>Total Logs</p>
          <h2>{totalLogs}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Info</p>
          <h2>{infoLogs.length}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Warnings</p>
          <h2>{warningLogs.length}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Errors</p>
          <h2>{errorLogs.length}</h2>
        </div>
      </div>
      <ul>
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
