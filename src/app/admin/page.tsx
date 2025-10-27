// "use client";
// import { useSession } from "next-auth/react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { getAdminStats } from "../actions/dashboardStats";
import { Card } from "@/components/Card";

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
      <div className="flex justify-between py-4">
        <Card title="Total Suppliers" value={stats.users.totalUsers} />
        <Card title="Total Services" value={stats.totals.totalServices} />
        <Card title="Total Orders" value={stats.totals.totalOrders} />
        <Card title="Total Sales" value={stats.totals.totalSales} />
      </div>
      <div className="top-stats grid grid-cols-2 gap-5 ">
        <div className="top-suppliers flex flex-col gap-5">
          <h2 className="text-lg font-bold">Top Suppliers</h2>
          <ul className="top-list-admin flex flex-col gap-2 p-4">
            <li className="flex justify-between">
              <h3>Supplier</h3>
              <p>Orders</p>
            </li>
            <div className="top-lists">
              {stats.topSuppliers.map((s) => (
                <li key={s.id} className="flex justify-between py-1">
                  <h3>{s.name}</h3>
                  <p>{s.totalOrders}</p>
                </li>
              ))}
            </div>
          </ul>
        </div>
        <div className="top-services flex flex-col gap-5">
          <h2 className="text-lg font-bold">Top Services</h2>
          <ul className="top-list-admin flex flex-col gap-2 p-4">
            <li className="flex justify-between">
              <h3>Service</h3>
              <p>Orders</p>
            </li>
            <div className="top-lists">
              {stats.topServices.map((s) => (
                <li key={s.id} className="flex justify-between py-1">
                  <h3>{s.name}</h3>
                  <p>{s.totalOrders}</p>
                </li>
              ))}
            </div>
          </ul>
        </div>
      </div>
    </>
  );
}
