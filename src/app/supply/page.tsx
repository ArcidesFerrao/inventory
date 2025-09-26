import Link from "next/link";
import React from "react";
import { getServiceDashBoardStats } from "../actions/dashboardStats";
import { getProducts } from "../actions/product";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function SupplyPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const supplier = await db.supplier.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!supplier) {
    redirect("/supply/register");
  }

  const stats = await getServiceDashBoardStats();
  const stockProducts = await getProducts();
  const filteredProducts = stockProducts.filter(
    (product) => (product.stock || product.stock == 0) && product.stock < 10
  );

  if (!stats) return <p>Please login to see the dashboard</p>;
  return (
    <section className="flex flex-col w-full ">
      <div className="dash-header flex items-center justify-between">
        <h1 className="text-4xl font-medium">Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/service/products/new" className="add-product flex gap-2">
            <span>+</span>
            <span className="text-md">Product</span>
          </Link>
          <Link href="/service/sales/new" className="add-product flex gap-2">
            <span>+</span>
            <span className="text-md">Sale</span>
          </Link>
        </div>
      </div>

      <div className=" flex gap-4 my-8">
        <div className="stats p-4 h-fit flex flex-col justify-between gap-2 min-w-52">
          <h2 className="text-2xl font-bold underline">Cash Flow</h2>
          <div className="flex flex-col stats-container gap-1">
            <div>
              <h3 className="text-lg font-normal">Revenue</h3>
              <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                MZN {stats.earnings.toFixed(2)}
              </h4>
            </div>

            <div>
              <h3 className="text-lg font-normal">Net Position</h3>
              <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                MZN {stats.balance.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>
        <div className="stats flex w-full flex-col p-4 justify-between">
          <div className="stats-header flex flex-col gap-2">
            <h2 className="text-xl font-medium underline">Statistics</h2>
            <p className="font-thin">stats of products, sales and earnings</p>
          </div>
          <div className="stats-container flex justify-between">
            <div className=" flex flex-col gap-2">
              <h2 className="text-xl font-medium underline ">Profitability</h2>
              <div className="stats-container flex flex-col">
                <div>
                  <h3 className="text-lg font-normal">Gross Profit</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    MZN {stats.profit.toFixed(2)}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Margin</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {stats.grossMargin.toFixed(1)}%
                  </h4>
                </div>
              </div>
            </div>
            <span className="divider"></span>

            <div className=" flex flex-col gap-2">
              <h2 className="text-xl font-medium underline">Inventory</h2>
              <div className="stats-container flex flex-col">
                <div>
                  <h3 className="text-lg font-normal">Total Value</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    MZN {stats.inventoryValue.toFixed(2)}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Remaining</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {stats.inventoryPercentage.toFixed(1)}%
                  </h4>
                </div>
              </div>
            </div>
            <span className="divider"></span>

            <div className=" flex flex-col gap-2">
              <h2 className="text-xl font-medium underline">Sales</h2>
              <div>
                <div className="stats-container flex flex-col">
                  <h3 className="text-lg font-normal">Total Sales</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {stats.salesCount}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Avg. Value</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    MZN {stats.averageSaleValue.toFixed(2)}
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
            <h2 className="text-2xl font-bold">Critic Items</h2>
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
            <h2 className="text-2xl font-bold">Top Products</h2>
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
