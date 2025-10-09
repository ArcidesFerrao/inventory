import PurchasesAndOrders from "@/components/PurchasesAndOrders";
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
    include: {
      PurchaseItem: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  // const sanitizedPurchases = purchases.map((p) => ({
  //   ...p,
  //   PurchaseItem: p.PurchaseItem.filter((i) => i.product !== null),
  // }));

  const orders = await db.order.findMany({
    where: { serviceId: session.user.serviceId },
    include: {
      supplierOrders: { include: { items: true } },
      confirmedDeliveries: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="list-title">
          <h2 className="text-2xl font-medium">Recent Purchases & Orders</h2>
          <p className="text-md font-extralight">
            Manage your direct purchases and orders from suppliers
          </p>
        </div>
      </div>
      <PurchasesAndOrders purchases={purchases} orders={orders} />
      {/*       
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
      <div className="divider-flat"></div>
      <div className="orders-list flex flex-col gap-5">
        <div className="purchases-header flex items-center justify-between w-full">
          <h3 className="text-xl font-bold underline">Orders</h3>
        </div>
        <div className="orders-data flex justify-between">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <p>Total Orders</p>
              <h2 className="text-2xl font-semibold">{orders.length}</h2>
            </div>
            <div className="flex flex-col ">
              <p>Total Value</p>
              <h2 className="text-2xl font-semibold">
                MZN {orders.reduce((acc, sale) => acc + sale.total, 0)}.00
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <p>Draft</p>
              <h2 className="text-2xl font-medium"></h2>
            </div>
            <div>
              <p>Confirmed</p>
              <h2 className="text-2xl font-medium"></h2>
            </div>
            <div>
              <p>In Delivery</p>
              <h2 className="text-2xl font-medium"></h2>
            </div>
          </div>
        </div>
        {orders.length === 0 ? (
          <p>No orders found...</p>
        ) : (
          <ul>
            {orders.map((o) => (
              <li key={o.id} className="list-orders flex justify-between">
                <div className="flex flex-col gap-5">
                  <div className="order-header flex flex-col gap-2">
                    <h3 className="order-title flex gap-2 items-center text-xl font-medium">
                      Order
                      <p className="text-sm font-light ">#{o.id.slice(0, 6)}</p>
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
          </ul>
        )}
      </div> */}
    </div>
  );
}
