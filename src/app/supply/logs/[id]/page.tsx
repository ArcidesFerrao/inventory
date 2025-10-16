import { db } from "@/lib/db";
import React from "react";

type Params = Promise<{ id: string }>;
export default async function ActividyDetailsPage(props: { params: Params }) {
  const { id } = await props.params;

  const log = await db.activityLog.findUnique({
    where: { id },
  });
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Activity details</h2>
        <span></span>
      </div>
      <div className="log-info flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-gray-400 text-sm">Action Type</p>
            <h2>{log?.actionType}</h2>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-gray-400 text-sm">Entity Type</p>
            <h2>{log?.entityType}</h2>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-gray-400 text-sm">Severity</p>
            <h2>{log?.severity}</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-gray-400 text-sm">Description</p>
            <h2>{log?.description}</h2>
          </div>
          <div></div>
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-gray-400 text-sm">Timestamp</p>
            <h2>
              {log?.timestamp.toLocaleDateString()},{" "}
              {log?.timestamp.toLocaleTimeString()}
            </h2>
          </div>
        </div>
      </div>
      <div className="log-info-details flex flex-col gap-2">
        <p className="font-extralight text-gray-400 text-sm">Details</p>
        <span>
          <p>
            {typeof log?.details === "object"
              ? JSON.stringify(log?.details)
              : log?.details}
          </p>
        </span>
      </div>
    </div>
  );
}
