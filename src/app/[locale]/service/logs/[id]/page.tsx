import {
  ArrivedDeliveryLogDetails,
  ConfirmedDeliveryLogDetails,
  CreateCategoryLogDetails,
  CreateDeliveryLogDetails,
  CreateExpenseLogDetails,
  CreateOrderLogDetails,
  CreatePurchaseLogDetails,
  CreateSaleLogDetails,
  ErroDeliveryLogDetails,
  UpdateOrderLogDetails,
} from "@/components/LogDetails";
import {
  ArrivedDeliveryLogs,
  ConfirmedDeliveryLogs,
  CreateCategoryLogs,
  CreateDeliveryLogs,
  CreateExpenseLogs,
  CreateOrderLogs,
  CreatePurchaseLogs,
  CreateSaleLogs,
  ErrorDeliveryLogs,
  UpdateOrderLogs,
} from "@/types/types";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

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

export default async function LogPage(props: { params: Params }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!session.user.serviceId) redirect("/register/service");

  const { id } = await props.params;
  const { locale } = await props.params;
  const t = await getTranslations("Common");
  const at = await getTranslations("Activity");
  const st = await getTranslations("Status ");

  const log = await db.activityLog.findUnique({
    where: { id },
  });

  if (!log) return notFound();

  const parsedDetails =
    typeof log.details === "string" ? JSON.parse(log.details) : log.details;

  const entityStyle =
    ENTITY_STYLES[log.entityType] ?? "bg-base-content/10 text-base-content/50";
  const severityStyle = SEVERITY_STYLES[log.severity] ?? SEVERITY_STYLES.INFO;

  const hasDetails = !!parsedDetails;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{at("activityDetails")}</h2>
          <p className=" opacity-65 text-xs font-extralight text-base-content/50 mt-0.5">
            #{id.slice(0, 8)}...
          </p>
        </div>
        <Link
          href={`/${locale}/service/logs`}
          className="flex items-center gap-1 text-sm text-base-content/50 hover:text-base-content transition-colors"
        >
          <span className="ep--back" />
          {/* {t("back")} */}
        </Link>
      </div>

      {/* Meta card */}
      <div className="stats p-4 flex flex-col gap-5">
        {/* Row 1: action + entity + severity */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <p className="label-text text-xs uppercase tracking-wide">
              {at("actionType")}
            </p>
            <span className="text-xs font-semibold border px-2 py-0.5 rounded bg-base-content/10 text-base-content/70 w-fit uppercase tracking-wide">
              {t(log.actionType.toLocaleLowerCase())}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="label-text text-xs uppercase tracking-wide">
              {at("entityType")}
            </p>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded w-fit ${entityStyle}`}
            >
              {t(log.entityType.toLocaleLowerCase())}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="label-text text-xs uppercase tracking-wide">
              {t("severity")}
            </p>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded w-fit ${severityStyle}`}
            >
              {log.severity}
            </span>
          </div>
        </div>

        {/* Divider */}
        {/* <div className="h-px bg-base-content/10" /> */}

        {/* Row 2: description + timestamp */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-2">
            <p className="label-text text-xs uppercase tracking-wide">
              {t("description")}
            </p>
            <p className="text-sm">{log.description}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="label-text text-xs uppercase tracking-wide">
              {t("timestamp")}
            </p>
            <div className="flex gap-4">
              <p className="text-xs font-medium">
                {log.timestamp.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-base-content/50">
                {log.timestamp.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
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
          <div className="stats p-4">
            {log.actionType === "CONFIRMED" && (
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
              <UpdateOrderLogDetails
                details={parsedDetails as UpdateOrderLogs}
              />
            )}
            {log.actionType === "CREATE" && log.entityType === "Order" && (
              <CreateOrderLogDetails
                details={parsedDetails as CreateOrderLogs}
              />
            )}
            {log.actionType === "CREATE" && log.entityType === "Sale" && (
              <CreateSaleLogDetails details={parsedDetails as CreateSaleLogs} />
            )}
            {log.actionType === "CREATE" && log.entityType === "Purchase" && (
              <CreatePurchaseLogDetails
                details={parsedDetails as CreatePurchaseLogs}
              />
            )}
            {log.actionType === "CREATE" && log.entityType === "Delivery" && (
              <CreateDeliveryLogDetails
                details={parsedDetails as CreateDeliveryLogs}
              />
            )}
            {log.actionType === "CREATE" && log.entityType === "Expense" && (
              <CreateExpenseLogDetails
                details={parsedDetails as CreateExpenseLogs}
              />
            )}
            {log.actionType === "CREATE" && log.entityType === "Category" && (
              <CreateCategoryLogDetails
                details={parsedDetails as CreateCategoryLogs}
              />
            )}
            {(log.actionType === "ERROR" ||
              log.actionType === "DELIVERY_Error") &&
              log.entityType === "Delivery" && (
                <ErroDeliveryLogDetails
                  details={parsedDetails as ErrorDeliveryLogs}
                />
              )}
          </div>
        </div>
      )}

      {/* <div className="log-info-details flex flex-col gap-2">
        <p className="font-extralight text-gray-400 text-sm">{t("details")}</p>
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
          {log.actionType === "CREATE" && log.entityType === "Delivery" && (
            <CreateDeliveryLogDetails
              details={parsedDetails as CreateDeliveryLogs}
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
      </div> */}
    </div>
  );
}
