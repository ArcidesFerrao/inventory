import {
  // ArrivedDeliveryLogDetails,
  ConfirmedDeliveryLogDetails,
  CreateDeliveryLogDetails,
  ErroDeliveryLogDetails,
  UpdateOrderLogDetails,
} from "@/components/LogDetails";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";

import {
  // ArrivedDeliveryLogs,
  ConfirmedDeliveryLogs,
  CreateDeliveryLogs,
  ErrorDeliveryLogs,
  UpdateOrderLogs,
} from "@/types/types";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string; locale: string }>;

const ENTITY_STYLES: Record<string, string> = {
  Sale: "bg-green-400/10 text-green-400",
  Order: "bg-blue-400/10 text-blue-400",
  Purchase: "bg-amber-400/10 text-amber-400",
  Delivery: "bg-purple-400/10 text-purple-400",
  Expense: "bg-red-400/10 text-red-400",
};

const SEVERITY_STYLES: Record<string, string> = {
  INFO: "bg-base-content/5 text-base-content/50 border border-base-content/10",
  WARNING: "bg-amber-400/10 text-amber-400",
  ERROR: "bg-red-400/10 text-red-400",
  SUCCESS: "bg-green-400/10 text-green-400",
};

export default async function ActivityDetailsPage(props: { params: Params }) {
  const session = await auth();

  const { id } = await props.params;
  const { locale } = await props.params;

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

  const at = await getTranslations("Activity");
  // const st = await getTranslations("Status");
  const t = await getTranslations("Common");

  const log = await db.activityLog.findUnique({
    where: { id },
  });

  if (!log) return notFound();

  const parsedDetails =
    typeof log.details === "string" ? JSON.parse(log.details) : log.details;

  // const details = parsedDetails as ConfirmedDeliveryLogs;

  const entityStyle =
    ENTITY_STYLES[log.entityType] ?? "bg-base-content/10 text-base-content/50";
  const severityStyle = SEVERITY_STYLES[log.severity] ?? SEVERITY_STYLES.INFO;

  // const hasDetails = !!parsedDetails;
  const hasDetails =
    parsedDetails !== null &&
    parsedDetails !== undefined &&
    typeof parsedDetails === "object" &&
    Object.keys(parsedDetails).length > 0;

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{at("activityDetails")}</h2>
          <p className="text-sm font-extralight text-base-content/50 mt-0.5">
            #{id.slice(0, 8)}...
          </p>
        </div>
        <Link
          href={`/${locale}/supply/logs`}
          className="flex items-center gap-1 text-sm text-base-content/50 hover:text-base-content transition-colors"
        >
          <span className="ep--back" />
          {/* {t("back")} */}
        </Link>
      </div>

      {/* Meta card */}
      <div className="stats p-5 flex flex-col gap-5">
        {/* Row 1: action + entity + severity */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="label-text text-xs uppercase tracking-wide">
              {at("actionType")}
            </p>
            <span className="text-sm font-semibold px-2 py-0.5 rounded bg-base-content/10 text-base-content/70 w-fit uppercase tracking-wide">
              {log.actionType}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="label-text text-xs uppercase tracking-wide">
              {at("entityType")}
            </p>
            <span
              className={`text-sm font-semibold px-2 py-0.5 rounded w-fit ${entityStyle}`}
            >
              {log.entityType}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="label-text text-xs uppercase tracking-wide">
              {t("severity")}
            </p>
            <span
              className={`text-sm font-semibold px-2 py-0.5 rounded w-fit ${severityStyle}`}
            >
              {log.severity}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-base-content/10" />

        {/* Row 2: description + timestamp */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-1.5">
            <p className="label-text text-xs uppercase tracking-wide">
              {t("description")}
            </p>
            <p className="text-sm">{log.description}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="label-text text-xs uppercase tracking-wide">
              {t("timestamp")}
            </p>
            <p className="text-sm font-medium">{formatDate(log.timestamp)}</p>
            <p className="text-xs text-base-content/50">
              {formatTime(log.timestamp)}
            </p>
          </div>
        </div>

        {/* Device / IP if present */}
        {(log.ipAddress || log.device) && (
          <>
            <div className="h-px bg-base-content/10" />
            <div className="grid grid-cols-2 gap-4">
              {log.ipAddress && (
                <div className="flex flex-col gap-1.5">
                  <p className="label-text text-xs uppercase tracking-wide">
                    IP
                  </p>
                  <p className="text-sm font-mono text-base-content/60">
                    {log.ipAddress}
                  </p>
                </div>
              )}
              {log.device && (
                <div className="flex flex-col gap-1.5">
                  <p className="label-text text-xs uppercase tracking-wide">
                    {t("device")}
                  </p>
                  <p className="text-sm text-base-content/60">{log.device}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Details section */}
      {hasDetails && (
        <div className="flex flex-col gap-2">
          <p className="label-text text-xs uppercase tracking-wide px-1">
            {t("details")}
          </p>
          <div className="stats p-5">
            {log.actionType === "CREATE" && log.entityType === "Delivery" && (
              <CreateDeliveryLogDetails
                details={parsedDetails as CreateDeliveryLogs}
              />
            )}
            {log.actionType === "CONFIRMED" && (
              <ConfirmedDeliveryLogDetails
                details={parsedDetails as ConfirmedDeliveryLogs}
              />
            )}
            {log.actionType === "UPDATE" && log.entityType === "Order" && (
              <UpdateOrderLogDetails
                details={parsedDetails as UpdateOrderLogs}
              />
            )}
            {log.actionType === "ERROR" && log.entityType === "Delivery" && (
              <ErroDeliveryLogDetails
                details={parsedDetails as ErrorDeliveryLogs}
              />
            )}
          </div>
        </div>
      )}
      {/*
      //
    // <div className="flex flex-col gap-5 w-full">
    //   <div className="flex justify-between items-center">
    //     <h2 className="text-2xl font-bold">{at("activityDetails")}</h2>
    //     <Link href={`/${locale}/supply/logs`}>
    //       <span className="ep--back"></span>
    //     </Link>
    //   </div>
    //   <div className="log-info flex flex-col gap-5">
    //     <section className="grid grid-cols-3 gap-4">
    //       <div className="flex flex-col gap-2">
    //         <p className="font-extralight text-gray-400 text-sm">
    //           {at("actionType")}
    //         </p>
    //         <h2>{st(log?.actionType.toLocaleLowerCase())}</h2>
    //       </div>
    //       <div className="flex flex-col gap-2">
    //         <p className="font-extralight text-gray-400 text-sm">
    //           {at("entityType")}
    //         </p>
    //         <h2>{st(log?.entityType.toLocaleLowerCase())}</h2>
    //       </div>
    //       <div className="flex flex-col gap-2">
    //         <p className="font-extralight text-gray-400 text-sm">
    //           {t("severity")}
    //         </p>
    //         <h2
    //           className={
    //             log?.severity === "INFO" ? "text-blue-400" : "text-yellow-400"
    //           }
    //         >
    //           {log?.severity}
    //         </h2>
    //       </div>
    //     </section>
    //     <section className="grid grid-cols-3 gap-4">
    //       <div className="flex flex-col gap-2">
    //         <p className="font-extralight text-gray-400 text-sm">
    //           {t("description")}
    //         </p>
    //         <h2 className="text-sm">{log?.description}</h2>
    //       </div>
    //       <div></div>
    //       <div className="flex flex-col gap-2">
    //         <p className="font-extralight text-gray-400 text-sm">
    //           {t("timestamp")}
    //         </p>
    //         <h2>
    //           {log?.timestamp.toLocaleDateString()},{" "}
    //           {log?.timestamp.toLocaleTimeString()}
    //         </h2>
    //       </div>
    //     </section>
    //   </div>
    //   <div className="log-info-details flex flex-col gap-2">
    //     <p className="font-extralight text-gray-400 text-sm">{t("details")}</p>
    //     <span>
    //       {log.actionType === "CREATE" && log.entityType === "Delivery" && (
    //         <CreateDeliveryLogDetails
    //           details={parsedDetails as CreateDeliveryLogs}
    //         />
    //       )}
    //       {log.actionType === "DELIVERY_CONFIRMED" && (
    //         <ConfirmedDeliveryLogDetails details={details} />
    //       )}
    //       {/* {log.actionType === "DELIVERY_ARRIVED" && (
    //         <ArrivedDeliveryLogDetails
    //           details={parsedDetails as ArrivedDeliveryLogs}
    //         />
    //       )} 
    //       {log.actionType === "UPDATE" && log.entityType === "Order" && (
    //         <UpdateOrderLogDetails details={parsedDetails as UpdateOrderLogs} />
    //       )}
    //       {log.actionType === "ERROR" && log.entityType === "Delivery" && (
    //         <ErroDeliveryLogDetails
    //           details={parsedDetails as ErrorDeliveryLogs}
    //         />
    //       )}
    //     </span>
    //   </div>
    */}
    </div>
  );
}
