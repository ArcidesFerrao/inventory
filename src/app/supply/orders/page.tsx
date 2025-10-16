import { SupplierOrderListItem } from "@/components/List";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

  const supplierOrders = await db.supplierOrder.findMany({
    where: { supplierId: session.user.supplierId },
    include: {
      items: true,
      order: {
        include: {
          Service: true,
        },
      },
    },
  });

  const pendingOrders = supplierOrders.filter(
    (order) => order.status === "PENDING"
  );
  const approvedOrders = supplierOrders.filter(
    (order) => order.status === "APPROVED"
  );

  const totalOrderedItems = supplierOrders.reduce((acc, supplierOrder) => {
    return (
      acc +
      supplierOrder.items.reduce(
        (itemAcc, item) => itemAcc + item.orderedQty,
        0
      )
    );
  }, 0);

  return (
    <div className="products-list flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-medium">Recent orders</h2>
          <p className="text-sm font-extralight">
            Manage customer orders and deliveries
          </p>
        </div>
      </div>
      <div className="orders-data flex justify-between">
        <div className="flex flex-col ">
          <p>Total Ordered</p>
          <h2 className="text-2xl font-semibold">{totalOrderedItems}</h2>
        </div>
        <div className="flex flex-col ">
          <p>Pending</p>
          <h2 className="text-2xl font-semibold">{pendingOrders.length}</h2>
        </div>
        <div className="flex flex-col ">
          <p>Approved</p>
          <h2 className="text-2xl font-semibold">{approvedOrders.length}</h2>
        </div>
        <div className="flex flex-col text-end">
          <p>Total Value</p>
          <h2 className="text-2xl font-semibold">
            MZN{" "}
            {supplierOrders.reduce(
              (acc, supplierOrder) => acc + supplierOrder.order.total,
              0
            )}
            .00
          </h2>
        </div>
      </div>
      {supplierOrders.length === 0 ? (
        <p>No orders found...</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {supplierOrders.map((supplierOrder) => (
            <SupplierOrderListItem
              key={supplierOrder.id}
              supplierOrder={supplierOrder}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
