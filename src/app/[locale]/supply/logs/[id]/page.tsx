import {
  // ArrivedDeliveryLogDetails,
  ConfirmedDeliveryLogDetails,
  CreateDeliveryLogDetails,
  ErroDeliveryLogDetails,
  UpdateOrderLogDetails,
} from "@/components/LogDetails";
import { db } from "@/lib/db";
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
export default async function ActividyDetailsPage(props: { params: Params }) {
  const { id } = await props.params;
  const { locale } = await props.params;
  const at = await getTranslations("Activity");
  const t = await getTranslations("Common");

  const log = await db.activityLog.findUnique({
    where: { id },
  });

  if (!log) return notFound();

  const parsedDetails =
    typeof log.details === "string" ? JSON.parse(log.details) : log.details;

  const details = parsedDetails as ConfirmedDeliveryLogs;

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{at("activityDetails")}</h2>
        <Link href={`/${locale}/supply/logs`}>
          <span className="ep--back"></span>
        </Link>
      </div>
      <div className="log-info flex flex-col gap-5">
        <section className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-gray-400 text-sm">
              {at("actionType")}
            </p>
            <h2>{log?.actionType}</h2>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-gray-400 text-sm">
              {at("entityType")}
            </p>
            <h2>{log?.entityType}</h2>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-gray-400 text-sm">
              {t("severity")}
            </p>
            <h2>{log?.severity}</h2>
          </div>
        </section>
        <section className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-gray-400 text-sm">
              {t("description")}
            </p>
            <h2 className="text-sm">{log?.description}</h2>
          </div>
          <div></div>
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-gray-400 text-sm">
              {t("timestamp")}
            </p>
            <h2>
              {log?.timestamp.toLocaleDateString()},{" "}
              {log?.timestamp.toLocaleTimeString()}
            </h2>
          </div>
        </section>
      </div>
      <div className="log-info-details flex flex-col gap-2">
        <p className="font-extralight text-gray-400 text-sm">{t("details")}</p>
        <span>
          {log.actionType === "CREATE" && log.entityType === "Delivery" && (
            <CreateDeliveryLogDetails
              details={parsedDetails as CreateDeliveryLogs}
            />
          )}
          {log.actionType === "DELIVERY_CONFIRMED" && (
            <ConfirmedDeliveryLogDetails details={details} />
          )}
          {/* {log.actionType === "DELIVERY_ARRIVED" && (
            <ArrivedDeliveryLogDetails
              details={parsedDetails as ArrivedDeliveryLogs}
            />
          )} */}
          {log.actionType === "UPDATE" && log.entityType === "Order" && (
            <UpdateOrderLogDetails details={parsedDetails as UpdateOrderLogs} />
          )}
          {log.actionType === "ERROR" && log.entityType === "Delivery" && (
            <ErroDeliveryLogDetails
              details={parsedDetails as ErrorDeliveryLogs}
            />
          )}
        </span>
      </div>
    </div>
  );
}
