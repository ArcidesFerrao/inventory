import OrdersAndSales from "@/components/OrdersAndSales";
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

  const supplierSales = await db.sale.findMany({
    where: { supplierId: session.user.supplierId },
    include: {
      SaleItem: {
        include: {
          supplierProduct: true,
        },
      },
    },
  });

  // const pendingOrders = supplierOrders.filter(
  //   (order) => order.status === "PENDING"
  // );
  // const approvedOrders = supplierOrders.filter(
  //   (order) => order.status === "APPROVED"
  // );
  // const deliveredOrders = supplierOrders.filter(
  //   (order) => order.status === "COMPLETED"
  // );

  // const totalOrderedItems = supplierOrders.reduce((acc, supplierOrder) => {
  //   return (
  //     acc +
  //     supplierOrder.items.reduce(
  //       (itemAcc, item) => itemAcc + item.orderedQty,
  //       0
  //     )
  //   );
  // }, 0);

  return (
    <div className="products-list flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-medium">Recent Orders and Sales</h2>
          <p className="text-sm font-extralight">
            Manage customer orders, deliveries and view sales
          </p>
        </div>
      </div>
      <OrdersAndSales sales={supplierSales} supplierOrders={supplierOrders} />
    </div>
  );
}
