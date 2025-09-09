import Link from "next/link";
import React from "react";
import { getServiceDashBoardStats } from "../actions/dashboardStats";

export default async function ServicePage() {
  const stats = await getServiceDashBoardStats();

  if (!stats) return <p>Please login to see the dashboard</p>;
  return (
    <section className="flex flex-col w-full ">
      <div className="dash-header flex items-center justify-between">
        <h1 className="text-4xl font-medium">Dashboard</h1>
        <Link href="/service/products/new" className="add-product flex gap-1">
          <span>+</span>
          <span className="text-md">Product</span>
        </Link>
      </div>
      <div className="dash-stats gap-4 flex py-8 w-full">
        <div className="balance flex flex-col p-4">
          <div className=" flex flex-col p-2">
            <h2 className="text-xl">Balance</h2>
            <h1 className="text-2xl py-2 whitespace-nowrap font-bold">
              MZN {stats.totalBalance},00
            </h1>
          </div>
          <div className=" flex flex-col p-2">
            <h2 className="text-xl">Profit</h2>
            <h1 className="text-2xl py-2 whitespace-nowrap font-bold">
              MZN {stats.totalBalance},00
            </h1>
          </div>
        </div>
        <div className="stats flex flex-col gap-4 w-full p-4">
          <h2 className="text-2xl font-bold">Statistics</h2>
          <div className="stats-container flex justify-between">
            <div className="earnings ">
              <h3 className="text-lg">Earnings</h3>
              <h2 className="text-xl py-2 font-medium">
                MZN {stats.totalEarnings},00
              </h2>
            </div>
            <span className="divider"></span>
            <div className="sales">
              <h3 className="text-lg">Number of Sales</h3>
              <h2 className="text-xl py-2  font-medium">{stats.salesCount}</h2>
            </div>
            <span className="divider"></span>
            <div className="products">
              <h3 className="text-lg">Number of Products</h3>
              <h2 className="text-xl py-2  font-medium">
                {stats.productCount}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
