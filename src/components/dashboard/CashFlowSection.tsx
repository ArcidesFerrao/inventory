// components/dashboard/CashFlowSection.tsx
import { getTranslations } from "next-intl/server";
import { getCashFlowStats } from "@/lib/actions/dashboardStats";
import RevenueTrendChart from "@/components/RevenueTrendChart";
import { Period } from "@/types/types";

type Props = { serviceId: string; userId: string; period: Period };

export async function CashFlowSection({ serviceId, userId, period }: Props) {
  const t = await getTranslations("Common");
  const stats = await getCashFlowStats(serviceId, userId, period);
  if (!stats) return null;

  return (
    <div className="stats profit-stats p-4 h-fit flex flex-col gap-2 min-w-52">
      <div className="flex cash-stats-container justify-between gap-2">
        <div>
          <h3 className="label-text text-lg font-normal">{t("revenue")}</h3>
          <h4 className="text-lg py-1 whitespace-nowrap font-bold">
            MZN {stats.earnings.toFixed(2)}
          </h4>
        </div>
        <div>
          <h3 className="label-text text-lg font-normal">{t("purchases")}</h3>
          <h4 className="text-lg py-1 whitespace-nowrap font-bold">
            MZN {stats.purchases.toFixed(2)}
          </h4>
        </div>
        <div>
          <h3 className="label-text text-lg font-normal">{t("expenses")}</h3>
          <h4 className="text-lg py-1 whitespace-nowrap font-bold">
            MZN {stats.expenses.toFixed(2)}
          </h4>
        </div>
        <div>
          <h3 className="label-text text-lg font-normal">{t("netPosition")}</h3>
          <h4
            className={`text-lg py-1 whitespace-nowrap font-bold ${
              stats.balance <= 0 ? "text-red-300" : "text-green-300"
            }`}
          >
            MZN {stats.balance.toFixed(2)}
          </h4>
        </div>
      </div>
      <RevenueTrendChart data={stats.trendData} />
    </div>
  );
}

export function CashFlowSkeleton() {
  return (
    <div className="stats profit-stats p-4 h-fit flex flex-col gap-2 min-w-52 animate-pulse">
      <div className="flex cash-stats-container justify-between gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 w-20 bg-base-300 rounded" />
            <div className="h-6 w-28 bg-base-300 rounded" />
          </div>
        ))}
      </div>
      {/* Chart placeholder */}
      <div className="h-40 w-full bg-base-300 rounded mt-2" />
    </div>
  );
}
