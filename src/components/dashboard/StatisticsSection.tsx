// components/dashboard/StatisticsSection.tsx
import { getTranslations } from "next-intl/server";
import {
  getInventoryStats,
  getProfitStats,
} from "@/lib/actions/dashboardStats";
import { Period } from "@/types/types";

type Props = { serviceId: string; userId: string; period: Period };

// components/dashboard/StatisticsSection.tsx
export async function StatisticsSection({ serviceId, userId, period }: Props) {
  const t = await getTranslations("Common");
  const st = await getTranslations("Sales");

  const [profit, inventory] = await Promise.all([
    getProfitStats(serviceId, userId, period),
    getInventoryStats(serviceId, userId, period),
  ]);

  if (!profit || !inventory) return null;

  return (
    <div className="stats stats-details flex w-full flex-col p-4 justify-between">
      <div className="stats-header flex flex-col gap-2 pb-2">
        <h2 className="text-2xl font-bold underline">{t("statistics")}</h2>
        <p className="font-thin">{t("statsDescription")}</p>
      </div>
      <div className="stats-details-container flex justify-between">
        {/* Profitability */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold underline">
            {t("profitability")}
          </h2>
          <div className="stats-container flex flex-col">
            <div>
              <h3 className="label-text text-lg font-normal">
                {t("grossProfit")}
              </h3>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                MZN {profit.profit.toFixed(2)}
              </h4>
            </div>
            <div>
              <h3 className="label-text text-lg font-normal">
                {t("netProfit")}
              </h3>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                MZN {profit.netProfit.toFixed(2)}
              </h4>
            </div>
            <div>
              <h3 className="label-text text-lg font-normal">{t("margin")}</h3>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                {profit.grossMargin.toFixed(1)}%
              </h4>
            </div>
          </div>
        </div>

        <span className="divider" />

        {/* Inventory — from getInventoryStats */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold underline">{t("inventory")}</h2>
          <div className="stats-container flex flex-col">
            <div>
              <h3 className="label-text text-lg font-normal">
                {t("totalValue")}
              </h3>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                MZN {inventory.inventoryValue.toFixed(2)}
              </h4>
            </div>
            <div>
              <h3 className="label-text text-lg font-normal">
                Stock {t("remaining")}
              </h3>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                {inventory.inventoryCount}
              </h4>
            </div>
          </div>
        </div>

        <span className="divider" />

        {/* Sales */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold underline">{t("sales")}</h2>
          <div className="stats-container flex flex-col">
            <div>
              <h3 className="label-text text-lg font-normal">
                {st("totalSales")}
              </h3>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                {profit.salesCount}
              </h4>
            </div>
            <div>
              <h3 className="label-text text-lg font-normal">
                {st("averageSaleValue")}
              </h3>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                MZN {profit.averageSaleValue.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatisticsSkeleton() {
  return (
    <div className="stats stats-details flex w-full flex-col p-4 gap-4 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-2">
        <div className="h-6 w-32 bg-base-300 rounded" />
        <div className="h-4 w-64 bg-base-300 rounded" />
      </div>
      {/* Three columns */}
      <div className="flex justify-between">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="h-5 w-24 bg-base-300 rounded" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex flex-col gap-1">
                <div className="h-4 w-20 bg-base-300 rounded" />
                <div className="h-6 w-28 bg-base-300 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
