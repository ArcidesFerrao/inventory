// "use client";
// import { useSession } from "next-auth/react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { getAdminStats } from "../actions/dashboardStats";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.isAdmin) {
    redirect("/");
  }

  const stats = await getAdminStats();

  if (!stats) {
    redirect("/login");
  }

  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium">Admin Dashboard</h1>
      </div>
      <div className="admin-info flex gap-10">
        <div className="admin-user flex flex-col gap-5">
          <h2 className="text-2xl font-bold underline">Users</h2>
          <div className="flex  gap-5">
            <div className="flex flex-col ">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-normal">Total</p>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    {stats.totals.totalUsers}
                  </h4>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-normal">Active</p>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold"></h4>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-lg font-normal">Services</p>
                <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                  {stats.totals.totalServices}
                </h4>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-normal">Suppliers</p>
                <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                  {stats.totals.totalSuppliers}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-orders flex flex-col gap-2">
          <h2 className="text-2xl font-bold underline">Orders</h2>
          <div className="flex gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-normal">Total</p>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                {stats.totals.totalOrders}
              </h4>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-normal">Delivered</p>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold"></h4>
            </div>
          </div>
        </div>
        <div className="admin-orders flex flex-col gap-2">
          <h2 className="text-2xl font-bold underline">Products</h2>
          <div className="flex gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-normal">Total</p>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                {stats.totals.totalProducts}
              </h4>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-normal">Sales</p>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                {stats.totals.totalSales}
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="top-stats flex justify-between gap-4">
        <div className="top-suppliers flex flex-col gap-2">
          <h2>Top Suppliers</h2>
          <ul>
            {stats.topSuppliers.map((s) => (
              <li key={s.id}>
                <h3>{s.name}</h3>
                <p>{s.totalOrders} Orders</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="top-services flex flex-col gap-2">
          <h2>Top Services</h2>
          <ul>
            {stats.topServices.map((s) => (
              <li key={s.id}>
                <h3>{s.name}</h3>
                <p>{s.totalOrders} Orders</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
