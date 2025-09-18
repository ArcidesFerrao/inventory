import ExportSelection from "@/components/ExportPdf";
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
      SaleItem: {
        include: {
          product: true,
        },
      },
    },
  });

  const purchases = await db.purchase.findMany({
    where: {
      userId: user.id,
    },
    include: {
      PurchaseItem: {
        include: {
          product: true,
        },
      },
    },
  });

  const stockProducts = await db.product.findMany({
    where: {
      userId: user.id,
      type: "STOCK",
    },
  });

  const logs = await db.activityLog.findMany({
    where: {
      userId: user.id,
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
        <ExportSelection
          stock={stockProducts}
          sales={sales}
          purchases={purchases}
          logs={logs}
        />
      </div>
    </section>
  );
}
