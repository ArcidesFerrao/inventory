"use client";

import {
  SupplierSaleWithItems,
  SupplierOrderWithOrderAndItems,
} from "@/types/types";
import React, { useState } from "react";
import { SupplierSaleListItem, SupplierOrderListItem } from "./List";

export default function PurchasesAndOrders({
  supplierOrders,
  sales,
}: {
  sales: SupplierSaleWithItems[];
  supplierOrders: SupplierOrderWithOrderAndItems[];
}) {
  const [view, setView] = useState<"sales" | "orders">("orders");

  const pendingOrders = supplierOrders.filter(
    (order) => order.status === "PENDING"
  );
  const approvedOrders = supplierOrders.filter(
    (order) => order.status === "APPROVED"
  );
  const deliveredOrders = supplierOrders.filter(
    (order) => order.status === "COMPLETED"
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
              <h2 className="text-2xl font-semibold">
                {approvedOrders.length}
              </h2>
            </div>
            <div className="flex flex-col ">
              <p>Delivered</p>
              <h2 className="text-2xl font-semibold">
                {deliveredOrders.length}
              </h2>
            </div>
            <div className="flex flex-col text-end">
              <p>Total Value</p>
              <h2 className="text-2xl font-semibold">
                MZN{" "}
                {supplierOrders.reduce(
                  (acc, supplierOrder) =>
                    acc + (supplierOrder.order?.total ?? 0),
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
        </>
      )}
      {view === "sales" && (
        <>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <p>Total Sales</p>
              <h2 className="text-xl font-bold">{sales.length}</h2>
            </div>
            <div className="flex flex-col gap-2">
              <p>Revenue</p>
              <h2 className="text-xl font-bold">
                MZN {sales.reduce((acc, sale) => acc + sale.total, 0)}.00
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              <p>Gross Profit</p>
              <h2 className="text-xl font-bold">
                MZN{" "}
                {sales.reduce((acc, sale) => acc + sale.total, 0) -
                  sales.reduce((acc, sale) => acc + sale.cogs, 0)}
                .00
              </h2>
            </div>
          </div>
          {sales.length === 0 ? (
            <p>No sales found</p>
          ) : (
            <ul>
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
