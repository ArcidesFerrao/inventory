import { getAdminItemsStats } from "@/lib/actions/dashboardStats";
import { Card } from "@/components/Card";
import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function AdminItemsPage() {
  const session = await auth();

  if (!session?.user.isAdmin) {
    redirect("/");
  }

  const t = await getTranslations("Common");

  const stats = await getAdminItemsStats();

  if (!stats) {
    redirect("/login");
  }
  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium underline">{t("items")}</h1>
      </div>
      <div className="py-4 flex flex-wrap justify-between gap-2">
        <Card title="Items" value={stats.items.itemsData.length} />
        <Card
          title={t("active")}
          value={stats.items.activeItems + stats.items.activeStockItems}
        />
        <Card
          title={t("inactive")}
          value={stats.items.inactiveItems + stats.items.inactiveStockItems}
        />
        <Card title="Stock Items" value={stats.items.stockItemsData.length} />
      </div>
      <div className="admin-products flex flex-col gap-5">
        <h2 className="text-lg font-bold">{t("itemsList")}</h2>
        <table>
          <thead>
            <tr>
              <th>{t("items")}</th>
              <th>{t("from")}</th>
              <th>{t("category")}</th>
              <th>{t("status")}</th>
              <th>{t("createdAt")}</th>
            </tr>
          </thead>
          <tbody>
            {stats.items.itemsData.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.service.businessName}</td>
                <td>{p.category?.name}</td>
                <td>{p.status}</td>
                <td>{p.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {stats.items.stockItemsData.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.supplier.businessName}</td>
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
