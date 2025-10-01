import Link from "next/link";
import React from "react";
import { getSupplierDashBoardStats } from "../actions/dashboardStats";
import { getSupplierProducts } from "../actions/product";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function SupplyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const supplierCheck = await db.supplier.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  // if (!session.user.supplyId) {
  if (!supplierCheck?.id) {
    console.log("No supplier registered");
    redirect("/register/supplier");
  }

  const stats = await getSupplierDashBoardStats();
  // const stockProducts = await getSupplierProducts(session.user.supplyId);
  const stockProducts = await getSupplierProducts(supplierCheck?.id);
  const filteredProducts = stockProducts.filter(
    (product) => (product.stock || product.stock == 0) && product.stock < 10
  );

  if (!stats) return <p>Please login to see the dashboard</p>;
  return (
    <section className="flex flex-col w-full ">
      <div className="dash-header flex items-center justify-between">
        <h1 className="text-4xl font-medium">Supplier Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/supply/products/new" className="add-product flex gap-2">
            <span>+</span>
            <span className="text-md">Product</span>
          </Link>
          <Link href="/supply/orders/new" className="add-product flex gap-2">
            <span>+</span>
            <span className="text-md">Order</span>
          </Link>
        </div>
      </div>

      <div className=" flex gap-4 my-8">
        <div className="stats p-4 h-fit flex flex-col justify-between gap-2 min-w-52">
          <h2 className="text-2xl font-bold underline">Financials</h2>
          <div className="flex flex-col stats-container gap-1">
            <div>
              <h3 className="text-lg font-normal">Total Revenue</h3>
              <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                MZN {stats.revenue.toFixed(2)}
              </h4>
            </div>

            <div>
              <h3 className="text-lg font-normal">Gross Profit</h3>
              <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                MZN {stats.profit.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>

        <div className="stats flex w-full flex-col p-4 justify-between">
          <div className="stats-header flex flex-col gap-2">
            <h2 className="text-xl font-medium underline">Statistics</h2>
            <p className="font-thin">
              metrics on orders, customers and profitability
            </p>
          </div>
          <div className="stats-container flex justify-between">
            <div className=" flex flex-col gap-2">
              <h2 className="text-xl font-medium underline ">Profitability</h2>
              <div className="stats-container flex flex-col">
                <div>
                  <h3 className="text-lg font-normal">Orders</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    MZN {stats.orderCount}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Gross Margin</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {stats.grossMargin.toFixed(1)}%
                  </h4>
                </div>
              </div>
            </div>
            <span className="divider"></span>

            <div className=" flex flex-col gap-2">
              <h2 className="text-xl font-medium underline">Customers</h2>
              <div className="stats-container flex flex-col">
                <div>
                  <h3 className="text-lg font-normal">Total Customers</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    MZN {stats.customerCount}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Avg. Order Value</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {stats.averageOrderValue.toFixed(2)}
                  </h4>
                </div>
              </div>
            </div>
            <span className="divider"></span>

            <div className=" flex flex-col gap-2">
              <h2 className="text-xl font-medium underline">Products</h2>
              <div>
                <div className="stats-container flex flex-col">
                  <h3 className="text-lg font-normal">Products Offered</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {stats.productCount}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Low Stock</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {filteredProducts.length}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex  w-fit gap-4">
        {filteredProducts.length > 0 && (
          <div className="items-list flex flex-col p-4 w-fit gap-4 justify-start items-start">
            <h2 className="text-2xl font-bold">Low Stock Items</h2>
            <ul className="flex flex-col gap-1">
              {filteredProducts.map((item) => (
                <li key={item.id} className="flex justify-between w-60">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.stock}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {stats.topProducts.length > 0 && (
          <div className="items-list flex flex-col p-4 w-fit gap-4 justify-start items-start">
            <h2 className="text-2xl font-bold">Top Ordered Products</h2>
            <ul className="flex flex-col gap-1">
              {stats.topProducts.map((item) => (
                <li key={item.id} className="flex justify-between w-60">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
