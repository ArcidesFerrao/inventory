import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

  const supplierOrders = await db.supplierOrder.findMany({
    where: { supplierId: session.user.supplierId },
    include: {
      order: {
        include: {
          Service: true,
        },
      },
    },
  });

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-medium">Recent orders</h2>
        <div className="flex">
          <h2 className="text-lg font-bold">Total orders:</h2>
          <p className="text-lg font-bold px-2">
            MZN{" "}
            {supplierOrders.reduce(
              (acc, supplierOrder) => acc + supplierOrder.order.total,
              0
            )}
            .00
          </p>
        </div>
      </div>
      {supplierOrders.length === 0 ? (
        <p>No orders found...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th className="text-start">Agent</th>
              <th className="text-start">Total (MZN)</th>
              <th className="text-start">Date</th>
              <th className="text-start">Time</th>
              <th className="text-start">Status</th>
            </tr>
          </thead>
          <tbody>
            {supplierOrders.map((supplierOrder) => (
              <tr key={supplierOrder.id}>
                <td>
                  <Link href={`/supply/orders/${supplierOrder.id}`}>
                    {supplierOrder.order.Service?.businessName}
                  </Link>
                </td>
                <td>{supplierOrder.order.total}.00</td>
                <td>{supplierOrder.order.createdAt.toLocaleDateString()}</td>
                <td>{supplierOrder.order.createdAt.toLocaleTimeString()}</td>
                <td>{supplierOrder.order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
