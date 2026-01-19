"use client";

import { OrderWithStockItems, SupplierSaleWithItems } from "@/types/types";
import { useState } from "react";
import { SupplierSaleListItem, SupplierOrderListItem } from "./List";

export default function OrdersAndSales({
  orders,
  sales,
}: {
  orders: OrderWithStockItems[];
  sales: SupplierSaleWithItems[];
}) {
  const [view, setView] = useState<"sales" | "orders">("orders");

  const pendingOrders = orders.filter((order) => order.status === "DRAFT");
  const approvedOrders = orders.filter((order) => order.status === "SUBMITTED");
  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  );

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
    <div className="flex flex-col gap-5">
      <div className="toggle-buttons flex">
        <button
          className={` flex items-center gap-2 px-4 py-2 text-xl ${
            view === "orders" && "toggled border-b-2"
          }`}
          onClick={() => setView("orders")}
        >
          <span className="flowbite--cart-solid"></span> Orders
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 text-xl ${
            view === "sales" && "toggled border-b-2"
          }`}
          onClick={() => setView("sales")}
        >
          <span className="roentgen--bag"></span> Sales
        </button>
      </div>
      {view === "orders" && (
        <>
          <div className="orders-data flex justify-between">
            <div className="flex flex-col gap-1">
              <p>Total Orders</p>
              <h2 className="text-xl font-bold">{orders.length}</h2>
            </div>
            <div className="flex flex-col  gap-1">
              <p>Pending</p>
              <h2 className="text-xl font-bold">{pendingOrders.length}</h2>
            </div>
            <div className="orders-approved flex flex-col  gap-1">
              <p>Approved</p>
              <h2 className="text-xl font-bold">{approvedOrders.length}</h2>
            </div>
            <div className="orders-delivered flex flex-col  gap-1">
              <p>Delivered</p>
              <h2 className="text-xl font-bold">{deliveredOrders.length}</h2>
            </div>
            <div className="flex flex-col text-end gap-1">
              <p>Total Value</p>
              <h4 className="text-xl font-bold">
                MZN{" "}
                {orders
                  .filter((so) => so.status !== "CANCELLED")
                  .reduce((acc, order) => acc + (order.total ?? 0), 0)}
                .00
              </h4>
            </div>
          </div>
          {orders.length === 0 ? (
            <p>No orders found...</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {orders.map((order) => (
                <SupplierOrderListItem key={order.id} order={order} />
              ))}
            </ul>
          )}
        </>
      )}
      {view === "sales" && (
        <>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <p>Total Sales</p>
              <h2 className="text-xl font-bold">{sales.length}</h2>
            </div>
            <div className="flex flex-col gap-1">
              <p>Revenue</p>
              <h4 className="text-xl font-bold">
                MZN {sales.reduce((acc, sale) => acc + sale.total, 0)}.00
              </h4>
            </div>
            <div className="flex flex-col gap-1">
              <p>Gross Profit</p>
              <h4 className="text-xl font-bold">
                MZN{" "}
                {sales.reduce((acc, sale) => acc + sale.total, 0) -
                  sales.reduce((acc, sale) => acc + sale.cogs, 0)}
                .00
              </h4>
            </div>
          </div>
          {sales.length === 0 ? (
            <p>No sales found</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {sales.map((sale) => (
                <SupplierSaleListItem key={sale.id} sale={sale} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
