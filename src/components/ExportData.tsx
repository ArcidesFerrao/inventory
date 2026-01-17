import { db } from "@/lib/db";
import React from "react";
import { SelectExport } from "./SelectExport";

export default async function ExportData({ serviceId }: { serviceId: string }) {
  const sales = await db.sale.findMany({
    where: {
      serviceId,
    },
    include: {
      SaleItem: {
        include: {
          item: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const purchases = await db.purchase.findMany({
    where: {
      serviceId,
    },
    include: {
      PurchaseItem: {
        include: {
          item: true,
          stockItem: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const stockItems = await db.serviceStockItem.findMany({
    where: {
      serviceId,
      // type: "STOCK",
    },
    include: {
      stockItem: true,
    },
  });

  const logs = await db.activityLog.findMany({
    where: {
      serviceId,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return (
    <SelectExport
      stockItems={stockItems}
      purchases={purchases}
      sales={sales}
      logs={logs}
    />
  );
}
