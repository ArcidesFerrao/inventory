import { getAdminProductsStats } from "@/app/actions/dashboardStats";
import { Card } from "@/components/Card";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.isAdmin) {
    redirect("/");
  }

  const stats = await getAdminProductsStats();

  if (!stats) {
    redirect("/login");
  }
  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium underline">Products</h1>
      </div>
      <div className="py-4 flex justify-between">
        <Card
          title="Total Products"
          value={stats.products.productsData.length}
        />
        <Card title="Inactive" value={stats.products.activeProducts} />
        <Card title="Actice" value={stats.products.inactiveProducts} />
      </div>
      <div className="admin-products flex flex-col gap-5">
        <h2 className="text-lg font-bold">Products List</h2>
        <table>
          <thead>
            <tr>
              <th>Products</th>
              <th>Type</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {stats.products.productsData.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>{p.Category?.name}</td>
                <td>{p.status}</td>
                <td>{p.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
