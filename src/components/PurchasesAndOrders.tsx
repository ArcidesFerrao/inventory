"use client";

import { OrderWithSupplierOrders, PurchaseWithItems } from "@/types/types";
import Link from "next/link";
import React, { useState } from "react";

export default function PurchasesAndOrders({
  purchases,
  orders,
}: {
  purchases: PurchaseWithItems[];
  orders: OrderWithSupplierOrders[];
}) {
  const [view, setView] = useState<"purchases" | "orders">("purchases");
  const [orderFilter, setOrderFilter] = useState<
    "ALL" | "PLACED" | "DRAFT" | "CONFIRMED" | "IN_DELIVERY"
  >("ALL");

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "PLACED") return o.status === "PLACED";
    if (orderFilter === "DRAFT") return o.status === "DRAFT";
    if (orderFilter === "CONFIRMED") return o.status === "CONFIRMED";
    if (orderFilter === "IN_DELIVERY") return o.status === "IN_DELIVERY";
    return true;
  });

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
                        {p.PurchaseItem.length > 1 && (
                          <div className="flex items-center gap-2">
                            <span>
                              <span className="fluent--box-16-regular"></span>
                            </span>
                            <p className="text-sm font-light">
                              {p.PurchaseItem.length} items
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
                      {p.PurchaseItem.map((i) => (
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
      {view === "orders" && (
        <div className="orders-list flex flex-col gap-5">
          <div className="orders-data flex justify-between">
            <div className="flex flex-col ">
              <p>Total Value</p>
              <h2 className="text-2xl font-semibold">
                MZN {orders.reduce((acc, sale) => acc + sale.total, 0)}.00
              </h2>
            </div>
          </div>

          {/* <div className="orders-filter flex gap-4">
            <div className="flex gap-5 items-center justify-between">
            <p>All</p>
              <span className="filter-order">{orders.length}</span>
              </div>
            <div className="flex gap-5 items-center justify-between">
            <p>Draft</p>
              <span className="filter-order">{orders.length}</span>
            </div>
            <div className="flex gap-5 items-center justify-between">
            <p>Confirmed</p>
            <span className="filter-order">{orders.length}</span>
            </div>
            <div className="flex gap-5 items-center justify-between">
              <p>In Delivery</p>
              <span className="filter-order">{orders.length}</span>
            </div>
            </div> */}
          {orders.length === 0 ? (
            <p>No orders found...</p>
          ) : (
            <ul className="flex flex-col gap-2">
              <div className="orders-filter flex gap-2">
                {[
                  { value: "ALL", label: "All" },
                  { value: "PLACED", label: "Placed" },
                  { value: "DRAFT", label: "Draft" },
                  { value: "CONFIRMED", label: "Confirmed" },
                  { value: "IN_DELIVERY", label: "In Delivery" },
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
                <>
                  {filteredOrders.map((o) => (
                    <li key={o.id} className="list-orders flex justify-between">
                      <div className="flex flex-col gap-5">
                        <div className="order-header flex flex-col gap-2">
                          <h3 className="order-title flex gap-2 items-center text-xl font-medium">
                            Order
                            <p className="text-sm font-light ">
                              #{o.id.slice(0, 6)}
                            </p>
                          </h3>
                          <div className="order-info flex items-center gap-4">
                            <div className="flex gap-2 items-center">
                              <span>
                                <span className="formkit--date"></span>
                              </span>
                              <p className="text-sm font-light">
                                {o.createdAt.toLocaleDateString()},{" "}
                                {o.createdAt.toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>
                                <span className="fluent--box-16-regular"></span>
                              </span>
                              <p className="text-sm font-light">
                                {o.supplierOrders.length} items
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="delivery-window flex flex-col gap-2">
                          <p className="text-sm font-light">
                            Requested Delivery Window
                          </p>
                          <div className=" flex gap-2">
                            <p className="text-md font-medium">
                              {o.requestedStartDate.toLocaleDateString()}
                            </p>
                            -
                            <p className="text-md font-medium">
                              {o.requestedEndDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="order-status flex flex-col justify-between">
                        <button disabled className="text-sm">
                          {o.status}
                        </button>
                        <div className="order-amount">
                          <p className="text-sm ">Order Total</p>
                          <h2 className="text-lg font-semibold">
                            MZN {o.total.toFixed(2)}
                          </h2>
                        </div>
                      </div>
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
