import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function PurchasesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const purchases = await db.purchase.findMany({
    where: { serviceId: session.user.serviceId },
    orderBy: { date: "desc" },
  });

  const orders = await db.order.findMany({
    where: { serviceId: session.user.serviceId },
    include: { confirmedDeliveries: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="products-list flex flex-col gap-4">
        <div className="list-header flex items-center justify-between w-full">
          <h2 className="text-2xl font-medium">Recent Purchases</h2>
          <Link
            href="/service/purchases/new"
            className="add-product flex gap-1"
          >
            <span className="text-md px-2">Purchase</span>
          </Link>
        </div>
        {purchases.length === 0 ? (
          <p>No purchases found...</p>
        ) : (
          <table className="rounded">
            <thead>
              <tr>
                <th className="text-start">Payment Type</th>
                <th className="text-start">Total (MZN)</th>
                <th className="text-start">Date</th>
                <th className="text-start">Time</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.paymentType}</td>
                  <td>{purchase.total}.00</td>
                  <td>{purchase.date.toLocaleDateString()}</td>
                  <td>{purchase.date.toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex">
          <h2 className="text-lg font-bold">Total Purchases:</h2>
          <p className="text-lg font-bold px-2">
            MZN {purchases.reduce((acc, sale) => acc + sale.total, 0)}.00
          </p>
        </div>
        <div className="divider"></div>
        <div className="products-list flex flex-col gap-4">
          <div className="list-header flex items-center justify-between w-full">
            <h2 className="text-2xl font-medium">Orders Placed</h2>
            <Link
              href="/service/purchases/orders/new"
              className="add-product flex gap-1"
            >
              <span className="text-md px-2">Order</span>
            </Link>
          </div>
          {orders.length === 0 ? (
            <p>No orders found...</p>
          ) : (
            <table className="rounded">
              <thead>
                <tr>
                  <th className="text-start">Payment Type</th>
                  <th className="text-start">Total (MZN)</th>
                  <th className="text-start">Deliveries</th>
                  <th className="text-start">Placed Date</th>
                  <th className="text-start">Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.paymentType}</td>
                    <td>{order.total}.00</td>
                    <td>{order.confirmedDeliveries.length}</td>
                    <td>{order.createdAt.toLocaleDateString()}</td>
                    <td>{order.createdAt.toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
