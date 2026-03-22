import { DeleteButton } from "@/components/DeleteButton";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ id: string; locale: string }>;

export default async function StockItemPage(props: { params: Params }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!session.user.serviceId) redirect("/register/service");

  const { id } = await props.params;
  const t = await getTranslations("Common");

  const [settings, item] = await Promise.all([
    db.serviceSettings.findUnique({
      where: {
        serviceId: session.user.serviceId,
      },
      select: {
        lowStockThreshold: true,
      },
    }),

    db.serviceStockItem.findUnique({
      where: {
        id,
      },
      include: {
        stockItem: {
          include: {
            unit: true,
          },
        },
        stockMovements: {
          orderBy: { timestamp: "desc" },
          take: 5,
          include: {
            stockItem: true,
          },
        },
        RecipeItems: true,
      },
    }),
  ]);

  const stockValue = (item?.stock ?? 0) * (item?.cost ?? 0);
  const criticalMin = settings?.lowStockThreshold ?? 10;
  const currentStock = item?.stock ?? 0;
  const isLowStock = currentStock <= criticalMin;
  const stockPct = Math.min(
    100,
    Math.round((currentStock / (criticalMin * 2.5)) * 100),
  );
  const barColor =
    currentStock === 0
      ? "bg-red-500"
      : isLowStock
        ? "bg-amber-400"
        : "bg-emerald-500";
  const unitName = item?.stockItem.unit?.name ?? "";
  const totalQty = item?.stockQty ?? 0;

  // Movement type config — maps StockChange enum to label + color
  const movementConfig: Record<string, { label: string; classes: string }> = {
    PURCHASE: {
      label: t("purchase"),
      classes: "bg-emerald-500/10 text-emerald-500",
    },
    SALE: { label: t("sale"), classes: "bg-blue-500/10 text-blue-400" },
    WASTE: { label: t("waste"), classes: "bg-red-500/10 text-red-400" },
    ADJUSTMENT: {
      label: t("adjustment"),
      classes: "bg-amber-400/10 text-amber-400",
    },
    RECONCILIATION: {
      label: t("reconciliation"),
      classes: "bg-purple-500/10 text-purple-400",
    },
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between w-full">
        <div>
          <h2 className="text-2xl font-semibold">{item?.stockItem.name}</h2>
          <p className="text-xs font-thin opacity-50">Id: {item?.id}</p>
        </div>
        {/* <div className="flex gap-2 items-center"> */}
        <DeleteButton itemId={id} />
        {/* </div> */}
      </div>

      {isLowStock && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-400 text-sm">
          <span className="text-base">⚠</span>
          <span>
            {t("lowStockAlert")} — {currentStock} {t("unitsRemaining")}.{" "}
            {t("considerOrdering")}
          </span>
        </div>
      )}

      <div className="listing-stock-item p-4 flex flex-col gap-3 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {t("currentStock")}
            </p>
            <div className="flex items-baseline gap-5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">{currentStock}</span>
                <span className="text-sm text-muted-foreground">
                  {t("units")}
                </span>
              </div>
              {unitName !== "unit" && (
                <span className="text-sm text-muted-foreground">
                  {totalQty} {unitName} {t("total")}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {t("criticalMin")}
            </p>
            <p className="text-sm font-medium">
              {criticalMin} {t("units")}
            </p>
          </div>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${stockPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span className={isLowStock ? "text-amber-400" : ""}>
            {t("minimum")}: {criticalMin}
          </span>
          <span>
            {t("estimatedMax")}: {criticalMin * 2.5}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
        <div className="listing-stock-item p-4 rounded-lg flex flex-col gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("status")}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t("active")}
            </span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("usedInRecipes")}
            </p>
            <p className="text-lg font-semibold">{item?.RecipeItems.length}</p>
          </div>
        </div>
        <div className="listing-stock-item p-4 rounded-lg flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("unitCost")}
          </p>
          <p className="text-lg font-semibold">{item?.cost?.toFixed(2)} MZN</p>
          <p className="text-xs text-muted-foreground">
            {t("stockValue")}: {stockValue.toFixed(2)} MZN
          </p>
        </div>
        <div className="listing-stock-item p-4 rounded-lg flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("quantityPerUnit")}
          </p>
          <p className="text-lg font-semibold">
            {item?.stockItem.unitQty}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {unitName}
            </span>
          </p>
        </div>
      </div>
      {/* Stock movements */}
      {(item?.stockMovements.length ?? 0) > 0 && (
        <div className="listing-stock-item p-4 rounded-lg w-full">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            {t("recentMovements")}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-normal">{t("date")}</th>
                <th className="text-left font-normal">{t("type")}</th>
                <th className="text-left font-normal">{t("reference")}</th>
                <th className="text-right font-normal">{t("quantity")}</th>
              </tr>
            </thead>
            <tbody>
              {item?.stockMovements.map((mov) => {
                const config = movementConfig[mov.changeType] ?? {
                  label: mov.changeType,
                  classes: "bg-muted text-muted-foreground",
                };
                const isPositive = ["PURCHASE"].includes(mov.changeType);
                const isNegative = ["SALE", "WASTE"].includes(mov.changeType);
                // ADJUSTMENT and RECONCILIATION can be either — keep the actual sign

                const displayQty = isPositive
                  ? `+${mov.quantity}`
                  : isNegative
                    ? `-${mov.quantity}`
                    : mov.quantity > 0
                      ? `+${mov.quantity}`
                      : `${mov.quantity}`;

                const qtyColor = isPositive
                  ? "text-emerald-500"
                  : isNegative
                    ? "text-red-400"
                    : mov.quantity >= 0
                      ? "text-emerald-500"
                      : "text-red-400";
                return (
                  <tr key={mov.id} className="border-t border-border/30">
                    <td className="py-2 text-muted-foreground">
                      {mov.timestamp.toLocaleDateString("pt-MZ")}
                    </td>
                    <td className="py-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${config.classes}`}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td className="py-2 text-muted-foreground text-2xs">
                      {mov.referenceId?.slice(0, 6)}...
                    </td>
                    <td className={`py-2 text-right font-medium ${qtyColor}`}>
                      {displayQty}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Link
            href={`${id}/movements`}
            className="text-xs text-primary hover:underline mt-3 block"
          >
            {t("viewAllMovements")} ›
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">{t("description")} </h2>
        <span className="product-detail-desc p-3 text-md min-h-20 font-light">
          <p>{item?.stockItem.description}</p>
        </span>
      </div>

      <div className="flex gap-2 justify-between opacity-65">
        <p className="text-xs font-thin">
          {t("createdAt")}: {item?.createdAt.toLocaleDateString()}
        </p>
        <p className="text-xs font-thin">
          {t("updatedAt")}: {item?.updatedAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
// export default async function StockItemPage(props: { params: Params }) {
//   const session = await auth();

//   if (!session?.user) redirect("/login");
//   if (!session.user.serviceId) redirect("/register/service");

//   const { id } = await props.params;
//   const t = await getTranslations("Common");

//   const item = await db.serviceStockItem.findUnique({
//     where: {
//       id,
//     },
//     include: {
//       stockItem: {
//         include: {
//           unit: true,
//         },
//       },
//     },
//   });
//   return (
//     <div className="flex flex-col gap-5 items-start w-full">
//       <div className="flex justify-between w-full">
//         <div>
//           <h2 className="text-2xl font-semibold">{item?.stockItem.name}</h2>
//           <p className="text-xs font-thin">Id: {item?.id}</p>
//         </div>
//         <div className="flex gap-2 items-center">
//           <DeleteButton itemId={id} />
//         </div>
//       </div>
//       <div className="flex  justify-between w-full  my-5">
//         <div className="flex flex-col gap-5">
//           <div className="flex gap-5 justify-between">
//             <div className="flex flex-col gap-2">
//               <p>{t("unitQuantity")}</p>
//               <h2 className="font-bold text-xl">{item?.stockItem.unitQty}</h2>
//             </div>
//             <div className="flex flex-col gap-2">
//               <p>{t("unit")}</p>
//               <h2 className="font-bold text-xl">
//                 {item?.stockItem.unit?.name}
//               </h2>
//             </div>
//             <div className="flex flex-col gap-2">
//               <p>{t("stock")}</p>
//               <h2 className="font-bold text-xl">{item?.stock}</h2>
//             </div>
//           </div>
//           {item?.stockItem.unit?.name !== "unit" && (
//             <div className="flex flex-col gap-2">
//               <p>{t("stockQuantity")}</p>
//               <h2 className="font-bold text-xl">
//                 {item?.stockQty}
//                 {item?.stockItem.unit?.name}
//               </h2>
//             </div>
//           )}
//         </div>
//         <div className="flex flex-col gap-2 w-fit">
//           <div className="flex flex-col gap-2">
//             <p>{t("cost")}</p>
//             <h4 className="font-bold text-xl">{item?.cost?.toFixed(2)} MZN</h4>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-between gap-4 w-full">
//         <div className="flex flex-col gap-2">
//           <h2 className="font-semibold">{t("description")} </h2>
//           <span className="product-detail-desc p-2 text-md font-light">
//             <p>{item?.stockItem.description}</p>
//           </span>
//         </div>

//         <div className="flex flex-col self-end gap-2 w-fit">
//           <p className="text-xs font-thin">
//             {t("createdAt")}: {item?.createdAt.toLocaleDateString()}
//           </p>
//           <p className="text-xs font-thin">
//             {t("updatedAt")}: {item?.updatedAt.toLocaleDateString()}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
