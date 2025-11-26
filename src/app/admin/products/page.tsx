import { getAdminItemsStats } from "@/app/actions/dashboardStats";
import { Card } from "@/components/Card";
import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user.isAdmin) {
    redirect("/");
  }

  const stats = await getAdminItemsStats();

  if (!stats) {
    redirect("/login");
  }
  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium underline">Products</h1>
      </div>
      <div className="py-4 flex justify-between">
        <Card title="Total Products" value={stats.items.itemsData.length} />
        <Card title="Inactive" value={stats.items.activeItems} />
        <Card title="Actice" value={stats.items.inactiveItems} />
      </div>
      <div className="admin-products flex flex-col gap-5">
        <h2 className="text-lg font-bold">Products List</h2>
        <table>
          <thead>
            <tr>
              <th>items</th>
              <th>Type</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {stats.items.itemsData.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>{p.category?.name}</td>
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
