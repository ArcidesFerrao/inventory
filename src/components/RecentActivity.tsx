import { db } from "@/lib/db";
import React from "react";
import { DashSaleListItem } from "./List";

export const RecentActivity = async ({ serviceId }: { serviceId: string }) => {
  const recentSales = await db.sale.findMany({
    where: { serviceId },
    orderBy: {
      timestamp: "desc",
    },
    take: 5,
  });

  if (recentSales.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-normal">Recent Sales</h3>
      <ul className="flex flex-col gap-2">
        {recentSales.map((sale) => (
          <DashSaleListItem sale={sale} key={sale.id} />
        ))}
      </ul>
    </div>
  );
};
