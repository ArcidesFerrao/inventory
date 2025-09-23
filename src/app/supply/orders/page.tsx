import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const supplier = await db.supplier.findFirst({
    where: { id: session.user.id },
  });

  const orders = await db.order.findMany({
    where: { supplierId: supplier?.id },
    orderBy: { createdAt: "desc" },
    include: { User: true },
  });

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-medium">Recent orders</h2>
        <div className="flex">
          <h2 className="text-lg font-bold">Total orders:</h2>
          <p className="text-lg font-bold px-2">
            MZN {orders.reduce((acc, order) => acc + order.total, 0)}.00
          </p>
        </div>
      </div>
      {orders.length === 0 ? (
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
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.User.name}</td>
                <td>{order.total}.00</td>
                <td>{order.createdAt.toLocaleDateString()}</td>
                <td>{order.createdAt.toLocaleTimeString()}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
