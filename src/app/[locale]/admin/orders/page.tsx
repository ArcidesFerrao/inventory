import { getAdminOrdersStats } from "@/lib/actions/dashboardStats";
import { Card } from "@/components/Card";
import { auth } from "@/lib/auth";
import Link from "next/link";

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await params;
  const session = await auth();

  if (!session?.user.isAdmin) {
    redirect("/");
  }

  const stats = await getAdminOrdersStats();

  const t = await getTranslations("Common");

  if (!stats) {
    redirect("/login");
  }

  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium underline">{t("orders")}</h1>
      </div>
      <div className="py-4 flex flex-wrap gap-2 justify-between">
        <Card title="Total Orders" value={stats.orders.totalOrders} />
        <Card title="Delivered Orders" value={stats.orders.delivered} />
        <Card title="Confirmed Orders" value={stats.orders.confirmed} />
        <Card title="Cancelled Orders" value={stats.orders.cancelled} />
      </div>
      <div className="admin-orders flex flex-col gap-5">
        <h2 className="text-lg font-bold">{t("ordersList")}</h2>
        <table>
          <thead>
            <tr>
              <th>{t("order")}</th>
              <th>{t("service")}</th>
              <th>{t("supplier")}</th>
              <th>{t("status")}</th>
              <th>{t("total")}</th>
            </tr>
          </thead>
          <tbody>
            {stats.orders.ordersData.map((s) => (
              <tr key={s.id}>
                <td>
                  <Link href={`/${locale}/admin/orders/${s.id}`}>
                    {s.id.slice(0, 5)}...
                  </Link>
                </td>
                <td>{s.Service?.businessName}</td>
                <td>{s.supplier.businessName}</td>
                <td>{s.status}</td>
                <td>MZN {s.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
