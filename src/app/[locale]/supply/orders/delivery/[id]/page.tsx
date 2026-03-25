// import { completeDelivery } from "@/app/actions/deliveries";
import {
  // CompleteDeliveryButton,
  ConfirmDeliveryButton,
} from "@/components/CompleteDeliveryButton";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

type Params = Promise<{ id: string; locale: string }>;

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-green-400/10 text-green-400",
  ARRIVED: "bg-blue-400/10 text-blue-400",
  PENDING: "bg-amber-400/10 text-amber-400",
  CANCELLED: "bg-red-400/10 text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Concluída",
  ARRIVED: "Chegou",
  PENDING: "Pendente",
  CANCELLED: "Cancelada",
};

export default async function DeliveryPage(props: { params: Params }) {
  const session = await auth();

  const { id, locale } = await props.params;
  // const { locale } = await props.params;
  const t = await getTranslations("Common");
  const dt = await getTranslations("Delivery");
  // const ot = await getTranslations("Orders");

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

  const delivery = await db.delivery.findUnique({
    where: {
      id,
    },
    include: {
      order: {
        include: {
          Service: true,
        },
      },
      deliveryItems: {
        include: {
          orderItem: {
            include: {
              stockItem: true,
            },
          },
        },
      },
    },
  });

  // const handleCompleteDelivery = await completeDelivery({
  //   deliveryId: delivery?.id as string,
  //   orderId: delivery?.orderId as string,
  //   supplierOrderId: delivery?.deliveryItems[0].orderItem
  //     .supplierOrderId as string,
  // });

  if (!delivery) return <p>{t("notFound")}</p>;

  const status = delivery.status;
  const isCompleted = status === "COMPLETED" || status === "ARRIVED";

  const total = delivery.deliveryItems.reduce(
    (sum, item) => sum + item.orderItem.price * item.quantity,
    0,
  );

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      // year: "numeric",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="order-header flex flex-col w-full">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">{dt("deliveryDetails")}</h2>
          <Link href={`/${locale}/supply/orders`}>
            <span className="ep--back"></span>
          </Link>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${
            STATUS_STYLES[status] ?? "bg-base-content/10 text-base-content/50"
          }`}
        >
          {STATUS_LABELS[status] ?? status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="stats p-4 flex flex-col gap-3">
          <p className="text-xs font-medium text-base-content/40 uppercase tracking-wide">
            {t("reference")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-base-content/50">{t("deliveryId")}</p>
              <p className="text-sm font-mono text-base-content/70">
                {delivery.id.slice(0, 8)}...
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-base-content/50">Order ID</p>
              <p className="text-sm font-mono text-base-content/70">
                {delivery.orderId.slice(0, 8)}...
              </p>
            </div>
          </div>
        </div>
        <div className="stats p-4 flex flex-col gap-3">
          <p className="text-xs font-medium text-base-content/40 uppercase tracking-wide">
            {t("scheduling")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-base-content/50">
                {t("scheduledTime")}
              </p>
              <p className="text-sm font-medium">
                {formatDate(delivery.scheduledAt)}
              </p>
              <p className="text-xs text-base-content/50">
                {formatTime(delivery.scheduledAt)}
              </p>
            </div>
            {delivery.deliveredAt && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-base-content/50">
                  {t("deliveredTime")}
                </p>
                <p className="text-sm font-medium">
                  {formatDate(delivery.deliveredAt)}
                </p>
                <p className="text-xs text-base-content/50">
                  {formatTime(delivery.deliveredAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="stats p-4 flex flex-col gap-3">
        <p className="text-xs font-medium text-base-content/40 uppercase tracking-wide">
          {dt("customerInfo")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-base-content/50">{t("name")}</p>
            <p className="text-sm font-medium">
              {delivery.order.Service?.businessName ?? "—"}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-base-content/50">{t("address")}</p>
            <p className="text-sm text-base-content/70">
              {delivery.order.Service?.location ?? "—"}
            </p>
          </div>
        </div>
      </div>
      <div className="stats p-4 flex flex-col gap-3">
        <p className="text-xs font-medium text-base-content/40 uppercase tracking-wide">
          {t("items")}
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-base-content/10">
              <th className="text-left py-2 text-xs font-medium text-base-content/40 uppercase tracking-wide">
                {t("item")}
              </th>
              <th className="text-right py-2 text-xs font-medium text-base-content/40 uppercase tracking-wide">
                {t("orderedQty")}
              </th>
              <th className="text-right py-2 text-xs font-medium text-base-content/40 uppercase tracking-wide">
                {t("deliveredQty")}
              </th>
              <th className="text-right py-2 text-xs font-medium text-base-content/40 uppercase tracking-wide">
                {t("price")}
              </th>
              <th className="text-right py-2 text-xs font-medium text-base-content/40 uppercase tracking-wide">
                {t("total")}
              </th>
            </tr>
          </thead>
          <tbody>
            {delivery.deliveryItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-base-content/10 last:border-0"
              >
                <td className="py-2.5 font-medium">
                  {item.orderItem.stockItem.name}
                </td>
                <td className="py-2.5 text-right text-base-content/60">
                  {item.orderItem.orderedQty}
                </td>
                <td className="py-2.5 text-right text-base-content/60">
                  {item.quantity}
                </td>
                <td className="py-2.5 text-right text-base-content/60">
                  MZN {item.orderItem.price.toFixed(2)}
                </td>
                <td className="py-2.5 text-right font-medium">
                  MZN {(item.orderItem.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end pt-2 border-t border-base-content/10">
          <span className="text-sm font-semibold">
            Total: MZN {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Notes */}
      {delivery.notes && (
        <div className="stats p-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-base-content/40 uppercase tracking-wide">
            {t("notes")}
          </p>
          <p className="text-sm text-base-content/70">{delivery.notes}</p>
        </div>
      )}

      {/* Action */}
      {isCompleted ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-green-400/20 bg-green-400/8 text-green-400 text-sm">
          <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center text-xs font-bold shrink-0">
            ✓
          </span>
          {t("deliveryCompletedNote", {
            date: delivery.deliveredAt
              ? formatDate(delivery.deliveredAt)
              : formatDate(delivery.scheduledAt),
            time: delivery.deliveredAt
              ? formatTime(delivery.deliveredAt)
              : formatTime(delivery.scheduledAt),
          })}
        </div>
      ) : (
        <ConfirmDeliveryButton
          deliveryId={delivery.id}
          status={delivery.status}
          serviceId={delivery.order.Service?.id ?? ""}
          orderId={delivery.orderId}
          role="SUPPLIER"
        />
      )}
    </div>
  );
}
