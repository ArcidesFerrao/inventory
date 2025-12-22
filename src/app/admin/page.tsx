import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";

import { getAdminStats } from "../actions/dashboardStats";
import { Card } from "@/components/Card";

export default async function AdminPage() {
  const session = await auth();

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
      <div className="flex flex-wrap gap-2 justify-between py-4">
        <Card title="Suppliers" value={stats.totals.totalSuppliers} />
        <Card title="Services" value={stats.totals.totalServices} />
        <Card title="Orders" value={stats.totals.totalOrders} />
        <Card title="Sales" value={stats.totals.totalSales} />
      </div>
      <div className="top-stats grid grid-cols-2 gap-5 ">
        <div className="top-suppliers flex flex-col gap-5">
          <h2 className="text-lg font-bold">Top Suppliers</h2>
          <div className="top-lists flex flex-col gap-2 p-4">
            <div className="flex justify-between">
              <h3>Supplier</h3>
              <p>Orders</p>
            </div>

            <ul className="top-list-admin flex flex-col gap-2">
              {stats.topSuppliers.map((s) => (
                <li key={s.id} className="flex justify-between py-1">
                  <h3>{s.name}</h3>
                  <p>{s.totalOrders}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="top-services flex flex-col gap-5">
          <h2 className="text-lg font-bold">Top Services</h2>
          <div className="top-lists flex flex-col gap-2 p-4">
            <div className="flex justify-between">
              <h3>Service</h3>
              <p>Orders</p>
            </div>
            <ul className="top-list-admin flex flex-col gap-2">
              {stats.topServices.map((s) => (
                <li key={s.id} className="flex justify-between py-1">
                  <h3>{s.name}</h3>
                  <p>{s.totalOrders}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
