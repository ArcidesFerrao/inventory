// components/dashboard/InventorySection.tsx
import { getTranslations } from "next-intl/server";
import { getInventoryStats, getTopItems } from "@/lib/actions/dashboardStats";
import { Period } from "@/types/types";

type Props = { serviceId: string; userId: string; period: Period };

export async function InventorySection({ serviceId, userId, period }: Props) {
  const t = await getTranslations("Common");

  const [inventory, topItemsData] = await Promise.all([
    getInventoryStats(serviceId, userId, period),
    getTopItems(serviceId, userId, period),
  ]);

  if (!inventory || !topItemsData) return null;

  const { lowStockItems } = inventory;
  const { topItems } = topItemsData;

  return (
    <div className="flex flex-col gap-4 w-full">
      {lowStockItems.length > 0 && (
        <div className="items-list flex flex-col p-4 w-full gap-4 justify-between items-start">
          <h2 className="text-xl font-bold">{t("criticItems")}</h2>
          <ul className="flex flex-col w-full gap-1">
            {lowStockItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.stockItem.name}</span>
                <span className="font-medium">{item.stock}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {topItems.length > 0 && (
        <div className="items-list flex flex-col p-4 gap-4 justify-start items-start">
          <h2 className="text-xl font-bold">{t("topItems")}</h2>
          <ul className="flex flex-col w-full gap-1">
            {topItems.map(
              (item) =>
                item && (
                  <li key={item.id} className="flex justify-between w-full">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.quantity}</span>
                  </li>
                ),
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export function InventorySkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      {/* Low stock */}
      <div className="items-list flex flex-col p-4 w-full gap-4">
        <div className="h-6 w-32 bg-base-300 rounded" />
        <ul className="flex flex-col w-full gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex justify-between">
              <div className="h-4 w-36 bg-base-300 rounded" />
              <div className="h-4 w-8 bg-base-300 rounded" />
            </li>
          ))}
        </ul>
      </div>
      {/* Top items */}
      <div className="items-list flex flex-col p-4 gap-4">
        <div className="h-6 w-24 bg-base-300 rounded" />
        <ul className="flex flex-col w-full gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex justify-between">
              <div className="h-4 w-40 bg-base-300 rounded" />
              <div className="h-4 w-8 bg-base-300 rounded" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
