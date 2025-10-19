import {
  ArrivedDeliveryLogDetails,
  ConfirmedDeliveryLogDetails,
  CreateOrderLogDetails,
  CreatePurchaseLogDetails,
  CreateSaleLogDetails,
  ErroDeliveryLogDetails,
  UpdateOrderLogDetails,
} from "@/components/LogDetails";
import {
  ArrivedDeliveryLogs,
  ConfirmedDeliveryLogs,
  CreateOrderLogs,
  CreateSaleLogs,
  ErrorDeliveryLogs,
  UpdateOrderLogs,
} from "@/types/types";

import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
type Params = Promise<{ id: string }>;
export default async function LogPage(props: { params: Params }) {
  const { id } = await props.params;

  const log = await db.activityLog.findUnique({
    where: { id },
  });

  if (!log) return notFound();

  const parsedDetails =
    typeof log.details === "string" ? JSON.parse(log.details) : log.details;

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Activity details</h2>
        <Link href="/service/logs">
          <span className="ep--back"></span>
        </Link>
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
            <h2 className="text-sm">{log?.description}</h2>
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
        <span className="overflow-y-auto">
          {log.actionType === "DELIVERY_CONFIRMED" && (
            <ConfirmedDeliveryLogDetails
              details={parsedDetails as ConfirmedDeliveryLogs}
            />
          )}
          {log.actionType === "DELIVERY_ARRIVED" && (
            <ArrivedDeliveryLogDetails
              details={parsedDetails as ArrivedDeliveryLogs}
            />
          )}
          {log.actionType === "UPDATE" && log.entityType === "Order" && (
            <UpdateOrderLogDetails details={parsedDetails as UpdateOrderLogs} />
          )}
          {log.actionType === "CREATE" && log.entityType === "Order" && (
            <CreateOrderLogDetails details={parsedDetails as CreateOrderLogs} />
          )}
          {log.actionType === "CREATE" && log.entityType === "Sale" && (
            <CreateSaleLogDetails details={parsedDetails as CreateSaleLogs} />
          )}
          {log.actionType === "CREATE" && log.entityType === "Purchase" && (
            <CreatePurchaseLogDetails
              details={parsedDetails as CreateSaleLogs}
            />
          )}
          {log.actionType === "ERROR" ||
            (log.actionType === "DELIVERY_Error" &&
              log.entityType === "Delivery" && (
                <ErroDeliveryLogDetails
                  details={parsedDetails as ErrorDeliveryLogs}
                />
              ))}
        </span>
      </div>
    </div>
  );
}
