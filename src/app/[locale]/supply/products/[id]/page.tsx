import { StockItemDeleteButton } from "@/components/DeleteButton";
import StatusToggle from "@/components/StatusToggle";
import StockHistory from "@/components/StockHistory";
import StockManagementButton from "@/components/StockManagementButton";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ id: string; locale: string }>;

export default async function ProductPage(props: { params: Params }) {
  const session = await auth();

  const { id } = await props.params;
  const { locale } = await props.params;

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

  const t = await getTranslations("Common");

  const item = await db.stockItem.findUnique({
    where: {
      id,
    },
    include: {
      unit: true,
      category: true,
    },
  });
  if (!item) return <p>{t("notFound")}</p>;

  const margin =
    item.price && item.cost && item.price > 0
      ? ((item.price - item.cost / (item.unitQty || 1)) / item.price) * 100
      : null;

  const stockPercent =
    item.stock != null && item.unitQty > 0
      ? Math.min(100, Math.round((item.stock / item.unitQty) * 100))
      : null;

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="flex flex-col gap-5 items-start w-full">
      {/* Header */}
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">{item.name}</h2>
            <StatusToggle itemId={id} initialStatus={item.status ?? "ACTIVE"} />
            {item.category && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400">
                {item.category.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <StockItemDeleteButton stockItemId={id} />
          <Link
            className="edit-button flex items-center gap-1 px-3 py-2 text-sm border border-base-content/20 rounded-lg hover:bg-base-content/5 transition-colors"
            href={`/${locale}/supply/products/${id}/edit`}
          >
            <span className="mdi--edit" />
            {t("edit")}
          </Link>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {/* Stock */}
        <div className="stats p-4 flex flex-col gap-1">
          <p className="label-text text-xs uppercase tracking-wide">Stock</p>
          <h4
            className={`text-xl font-bold ${
              item.stock != null && item.stock < 10
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {item.stock ?? "—"}
          </h4>
          {stockPercent !== null && (
            <div className="w-full h-1 bg-base-content/10 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full rounded-full ${
                  stockPercent < 20
                    ? "bg-red-400"
                    : stockPercent < 50
                      ? "bg-amber-400"
                      : "bg-green-400"
                }`}
                style={{ width: `${stockPercent}%` }}
              />
            </div>
          )}
          <p className="text-xs text-base-content/40 mt-0.5">
            {t("baseQty")}: {item.unitQty} {item.unit?.name}
          </p>
        </div>

        {/* Cost */}
        <div className="stats p-4 flex flex-col gap-1">
          <p className="label-text text-xs uppercase tracking-wide">
            {t("cost")}
          </p>
          <h4 className="text-xl font-bold">
            MZN {item.cost?.toFixed(2) ?? "—"}
          </h4>
          <p className="text-xs text-base-content/40">
            {t("unit")}: MZN{" "}
            {item.cost && item.unitQty
              ? (item.cost / item.unitQty).toFixed(2)
              : "—"}{" "}
            / {item.unit?.name}
          </p>
        </div>

        {/* Price */}
        <div className="stats p-4 flex flex-col gap-1">
          <p className="label-text text-xs uppercase tracking-wide">
            {t("price")}
          </p>
          <h4 className="text-xl font-bold text-green-400">
            MZN {item.price?.toFixed(2) ?? "—"}
          </h4>
        </div>

        {/* Margin */}
        <div className="stats p-4 flex flex-col gap-1">
          <p className="label-text text-xs uppercase tracking-wide">
            {t("margin")}
          </p>
          <h4
            className={`text-xl font-bold ${
              margin === null
                ? "text-base-content/40"
                : margin >= 0
                  ? "text-green-400"
                  : "text-red-400"
            }`}
          >
            {margin !== null ? `${margin.toFixed(1)}%` : "—"}
          </h4>
          {margin !== null && (
            <div className="w-full h-1 bg-base-content/10 rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full bg-green-400"
                style={{ width: `${Math.min(100, Math.max(0, margin))}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Details + stock management */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 w-full gap-4">
        <div className="stats p-4 flex flex-col gap-3">
          <p className="label-text text-xs uppercase tracking-wide">
            {t("productDetails")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-base-content/50">
                {t("baseQuantity")}
              </p>
              <p className="text-sm font-medium">{item.unitQty}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-base-content/50">{t("unit")}</p>
              <p className="text-sm font-medium">{item.unit?.name ?? "—"}</p>
            </div>
            {item.category && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-base-content/50">{t("category")}</p>
                <p className="text-sm font-medium">{item.category.name}</p>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <p className="text-xs text-base-content/50">{t("status")}</p>
              <p className="text-sm font-medium">{item.status}</p>
            </div>
          </div>
          <div className="flex gap-6 pt-3 border-t border-base-content/10 justify-between w-full">
            <p className="text-xs text-base-content/40">
              {t("createdAt")}: {formatDate(item.createdAt)}
            </p>
            <p className="text-xs text-base-content/40">
              {t("updatedAt")}: {formatDate(item.updatedAt)}
            </p>
          </div>
        </div>

        <div className="stats p-4 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-3">
            <p className="label-text text-xs uppercase tracking-wide">
              {t("stockManagement")}
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-base-content/50">
                {t("currentStock")}
              </p>
              <p
                className={`text-sm font-medium ${
                  item.stock != null && item.stock < 10
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {item.stock ?? 0} {t("units")}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-base-content/10 bottom-0 ">
            <p className="text-sm text-base-content/60">
              {t("updateStockQty")}
            </p>
            <StockManagementButton
              stockItemId={id}
              currentStock={item.stock ?? 0}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div className="stats p-4 flex flex-col gap-2 w-full ">
          <p className="label-text text-xs uppercase tracking-wide">
            {t("description")}
          </p>
          <p className="text-sm text-base-content/70 leading-relaxed">
            {item.description}
          </p>
        </div>
      )}

      <StockHistory stockItemId={id} />
    </div>
  );
}
