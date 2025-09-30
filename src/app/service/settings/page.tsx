import ExportSelection from "@/components/ExportPdf";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import React from "react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  const serviceId = session?.user.serviceId;
  if (!serviceId) return <p>Access Denied</p>;

  const sales = await db.sale.findMany({
    where: {
      serviceId,
    },
    include: {
      SaleItem: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const purchases = await db.purchase.findMany({
    where: {
      serviceId,
    },
    include: {
      PurchaseItem: {
        include: {
          product: true,
          supplierProduct: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const stockProducts = await db.product.findMany({
    where: {
      serviceId,
      type: "STOCK",
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
