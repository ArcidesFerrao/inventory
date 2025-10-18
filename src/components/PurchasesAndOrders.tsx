"use client";

import { OrderWithSupplierOrders, PurchaseWithItems } from "@/types/types";
import Link from "next/link";
import React, { useState } from "react";
import { OrderListItem, PurchaseListItem } from "./List";

export default function PurchasesAndOrders({
  purchases,
  orders,
}: {
  purchases: PurchaseWithItems[];
  orders: OrderWithSupplierOrders[];
}) {
  const [view, setView] = useState<"purchases" | "orders">("purchases");
  const [orderFilter, setOrderFilter] = useState<
    | "ALL"
    | "SUBMITTED"
    | "DRAFT"
    | "CONFIRMED"
    | "IN_DELIVERY"
    | "IN_PREPARATION"
    | "DELIVERED"
    | "CANCELLED"
  >("ALL");

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "SUBMITTED") return o.status === "SUBMITTED";
    if (orderFilter === "DRAFT") return o.status === "DRAFT";
    if (orderFilter === "CONFIRMED") return o.status === "CONFIRMED";
    if (orderFilter === "IN_DELIVERY") return o.status === "IN_DELIVERY";
    if (orderFilter === "IN_PREPARATION") return o.status === "IN_PREPARATION";
    if (orderFilter === "DELIVERED") return o.status === "DELIVERED";
    if (orderFilter === "CANCELLED") return o.status === "CANCELLED";
    return true;
  });

  const totalPurchasedItems = purchases.reduce((acc, purchase) => {
    return (
      acc + purchase.PurchaseItem.reduce((sum, item) => sum + item.stock, 0)
    );
  }, 0);

  const totalOrderedItems = orders.reduce((acc, order) => {
    return (
      acc +
      order.supplierOrders
        .filter((so) => so.status !== "CANCELLED")
        .reduce((supplierAcc, supplierOrder) => {
          return (
            supplierAcc +
            supplierOrder.items.reduce(
              (itemAcc, item) => itemAcc + item.orderedQty,
              0
            )
          );
        }, 0)
    );
  }, 0);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="header-p-o flex justify-between">
        <div className="toggle-buttons flex">
          <button
            className={`flex items-center gap-2 px-4 py-2 text-xl ${
              view === "purchases" && "toggled border-b-2"
            }`}
            onClick={() => setView("purchases")}
          >
            <span className="roentgen--bag"></span> Purchases
          </button>
          <button
            className={` flex items-center gap-2 px-4 py-2 text-xl ${
              view === "orders" && "toggled border-b-2"
            }`}
            onClick={() => setView("orders")}
          >
            <span className="flowbite--cart-solid"></span> Orders
          </button>
        </div>
        <div className="flex gap-2 items-center">
          {view === "orders" && (
            <Link
              href="/service/purchases/orders/new"
              className="add-product flex gap-1"
            >
              <span className="text-md px-2 flex items-center gap-2">
                <span className="flowbite--cart-solid"></span>New Order
              </span>
            </Link>
          )}
          {view === "purchases" && (
            <Link
              href="/service/purchases/new"
              className="add-product flex gap-1"
            >
              <span className="text-md px-2 flex items-center gap-2">
                <span className="roentgen--bag"></span>New Purchase
              </span>
            </Link>
          )}
        </div>
      </div>

      {view === "purchases" && (
        <div className="purchase-list flex flex-col gap-5">
          <div className="purchases-data flex justify-between w-full">
            <div>
              <p>Total Purchases</p>
              <h2 className="text-2xl font-medium">{purchases.length}</h2>
            </div>
            <div>
              <p>Total Spent</p>
              <h2 className="text-2xl font-medium">
                MZN {purchases.reduce((acc, sale) => acc + sale.total, 0)}.00
              </h2>
            </div>
            <div>
              <p>Items Purchased</p>
              <h2 className="text-2xl font-medium">{totalPurchasedItems}</h2>
            </div>
          </div>
          {purchases.length === 0 ? (
            <p>No purchases found...</p>
          ) : (
            <ul className="flex flex-col gap-2 w-full">
              {purchases.map((p) => (
                <PurchaseListItem key={p.id} purchases={p} />
              ))}
            </ul>
          )}
        </div>
      )}
      {view === "orders" && (
        <div className="orders-list flex flex-col gap-5">
          <div className="orders-data flex justify-between">
            <div className="flex flex-col ">
              <p>Total Ordered</p>
              <h2 className="text-2xl font-semibold">{totalOrderedItems}</h2>
            </div>
            <div className="flex flex-col text-end">
              <p>Total Value</p>
              <h2 className="text-2xl font-semibold">
                MZN{" "}
                {orders
                  .filter((so) => so.status !== "CANCELLED")
                  .reduce((acc, sale) => acc + sale.total, 0)}
                .00
              </h2>
            </div>
          </div>

          {orders.length === 0 ? (
            <p>No orders found...</p>
          ) : (
            <ul className="flex flex-col gap-2">
              <div className="orders-filter flex gap-2">
                {[
                  { value: "ALL", label: "All" },
                  { value: "DRAFT", label: "Draft" },
                  { value: "SUBMITTED", label: "Submitted" },
                  { value: "IN_PREPARATION", label: "In Preparation" },
                  { value: "IN_DELIVERY", label: "In Delivery" },
                  { value: "DELIVERED", label: "Delivered" },
                  { value: "CONFIRMED", label: "Confirmed" },
                  { value: "CANCELLED", label: "Cancelled" },
                ].map((filter) => (
                  <label
                    key={filter.value}
                    className={`cursor-pointer px-4 py-2 text-sm  ${
                      orderFilter === filter.value
                        ? "font-bold border-b-2"
                        : " hover:border-b-2 font-medium"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderFilter"
                      value={filter.value}
                      checked={orderFilter === filter.value}
                      onChange={(e) =>
                        setOrderFilter(e.target.value as typeof orderFilter)
                      }
                      className="hidden"
                    />
                    {filter.label}
                  </label>
                ))}
              </div>
              {filteredOrders.length === 0 ? (
                <p>No orders found...</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {filteredOrders.map((o) => (
                    <OrderListItem key={o.id} order={o} />
                  ))}
                </ul>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
