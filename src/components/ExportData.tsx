import { db } from "@/lib/db";
import React from "react";
import { SelectExport, SupplierSelectExport } from "./SelectExport";

export async function ExportData({ serviceId }: { serviceId: string }) {
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

  const serviceStockItems = await db.serviceStockItem.findMany({
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
      serviceStockItems={serviceStockItems}
      purchases={purchases}
      sales={sales}
      logs={logs}
    />
  );
}

export async function ExportSupplierData({
  supplierId,
}: {
  supplierId: string;
}) {
  const sales = await db.sale.findMany({
    where: {
      supplierId,
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

  // const purchases = await db.purchase.findMany({
  //   where: {
  //     supplierId,
  //   },
  //   include: {
  //     PurchaseItem: {
  //       include: {
  //         item: true,
  //         stockItem: true,
  //       },
  //     },
  //   },
  //   orderBy: {
  //     timestamp: "desc",
  //   },
  // });

  const stockItems = await db.stockItem.findMany({
    where: {
      supplierId,
    },
    include: {
      unit: true,
    },
  });

  const logs = await db.activityLog.findMany({
    where: {
      supplierId,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return (
    <SupplierSelectExport
      stockItems={stockItems}
      // purchases={purchases}
      sales={sales}
      logs={logs}
    />
  );
}
