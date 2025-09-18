import {
  ExportPurchasesPdf,
  ExportSalesPdf,
  ExportStockPdf,
} from "@/components/ExportPdf";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import React from "react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return <p>Access Denied</p>;

  const user = session.user;

  const sales = await db.sale.findMany({
    where: {
      userId: user.id,
    },
    include: {
      SaleItem: true,
    },
  });

  const purchases = await db.purchase.findMany({
    where: {
      userId: user.id,
    },
  });

  const stockProducts = await db.product.findMany({
    where: {
      userId: user.id,
      type: "STOCK",
    },
  });

  return (
    <section className="settings-page flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <h4 className="font-medium">Username: </h4>
          <p>Arcides Ferrao</p>
        </div>
        <div className="flex gap-2">
          <h4 className="font-medium">Email: </h4>
          <p>arcides@ferrao.com</p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-medium">Export Data</h4>
          <div className="flex gap-2">
            <ExportStockPdf stock={stockProducts} />
            <ExportSalesPdf sales={sales} />
            <ExportPurchasesPdf purchases={purchases} />
          </div>
        </div>
      </div>
    </section>
  );
}
