import PurchasesAndOrders from "@/components/PurchasesAndOrders";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function PurchasesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const purchases = await db.purchase.findMany({
    where: { serviceId: session.user.serviceId },
    include: {
      PurchaseItem: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  const orders = await db.order.findMany({
    where: { serviceId: session.user.serviceId },
    include: {
      supplierOrders: { include: { items: true } },
      confirmedDeliveries: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="list-title">
          <h2 className="text-2xl font-medium">Recent Purchases & Orders</h2>
          <p className="text-md font-extralight">
            Manage your direct purchases and orders from suppliers
          </p>
        </div>
      </div>
      <PurchasesAndOrders purchases={purchases} orders={orders} />
    </div>
  );
}
