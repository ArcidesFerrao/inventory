"use client";

import { PurchaseWithItems } from "@/types/types";
import { Order } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";

export default function PurchasesAndOrders({
  purchases,
  orders,
}: {
  purchases: PurchaseWithItems[];
  orders: Order[];
}) {
  const [view, setView] = useState<"purchases" | "orders">("purchases");
  const [orderFilter, setOrderFilter] = useState<
    "ALL" | "CONFIRMED" | "IN_DELIVERY"
  >("ALL");

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "CONFIRMED") return o.status === "CONFIRMED";
    if (orderFilter === "IN_DELIVERY") return o.status === "IN_DELIVERY";
    return true;
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="list-title">
          <h2 className="text-2xl font-medium">Recent Purchases & Orders</h2>
          <p>Manage your direct purchases and orders from suppliers</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/service/purchases/orders/new"
            className="add-product flex gap-1"
          >
            <span className="text-md px-2">Order</span>
          </Link>
          <Link
            href="/service/purchases/new"
            className="add-product flex gap-1"
          >
            <span className="text-md px-2">Purchase</span>
          </Link>
        </div>
      </div>
      <div className="toggle-buttons flex gap-2 my-2">
        <button
          className={`px-2 py-2 ${view === "purchases" && "toggled"}`}
          onClick={() => setView("purchases")}
        >
          Purchases
        </button>
        <button
          className={`px-2 py-2 ${view === "orders" && "toggled"}`}
          onClick={() => setView("orders")}
        >
          Orders
        </button>
      </div>

      {view === "purchases" && (
        <div className="purchase-list flex flex-col gap-5">
          <div className="purchases-header">
            <h3 className="text-xl font-bold underline">Purchases</h3>
          </div>
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
              <h2 className="text-2xl font-medium">54</h2>
            </div>
          </div>
          {purchases.length === 0 ? (
            <p>No purchases found...</p>
          ) : (
            <ul className=" w-full">
              {purchases.map((p) => (
                <li
                  key={p.id}
                  className="list-purchases flex flex-col gap-5 w-full"
                >
                  <div className="purchase-header flex justify-between">
                    <div className="purchase-title flex flex-col gap-2">
                      <h3 className="flex gap-2 items-center text-xl font-medium">
                        Purchase
                        <p className="text-sm font-light ">
                          #{p.id.slice(0, 6)}...
                        </p>
                      </h3>
                      <div className="title-details flex gap-4">
                        <div className="flex gap-2">
                          <span>
                            <span className="formkit--date"></span>
                          </span>
                          <p className="text-sm font-light">
                            {p.date.toLocaleDateString()} ,{" "}
                            {p.date.toLocaleTimeString()}
                          </p>
                        </div>
                        {p.PurchaseItems.length > 1 && (
                          <div className="flex items-center gap-2">
                            <span>
                              <span className="fluent--box-16-regular"></span>
                            </span>
                            <p className="text-sm font-light">
                              {p.PurchaseItems.length} items
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-light">{p.paymentType}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>Total Amount</p>
                      <h2 className="text-lg font-medium">
                        MZN {p.total.toFixed(2)}
                      </h2>
                    </div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Cost</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.PurchaseItems.map((i) => (
                        <tr key={i.id}>
                          <td>{i.product?.name}</td>
                          <td>{i.quantity}</td>
                          <td>MZN {i.unitCost}.00</td>
                          <td>MZN {i.totalCost}.00</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
