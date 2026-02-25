import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";

import { getAdminStats } from "@/lib/actions/dashboardStats";
import { Card } from "@/components/Card";
import { getTranslations } from "next-intl/server";

export default async function AdminPage() {
  const session = await auth();
  const t = await getTranslations("Common");

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
        <h1 className="text-4xl font-medium">{t("dashboard")}</h1>
      </div>
      <div className="flex flex-wrap gap-2 justify-between py-4">
        <Card title={t("suppliers")} value={stats.totals.totalSuppliers} />
        <Card title={t("services")} value={stats.totals.totalServices} />
        <Card title={t("orders")} value={stats.totals.totalOrders} />
        <Card title={t("sales")} value={stats.totals.totalSales} />
      </div>
      <div className="top-stats grid grid-cols-2 gap-5 ">
        <div className="top-suppliers flex flex-col gap-5">
          <h2 className="text-lg font-bold">{t("topSuppliers")}</h2>
          <div className="top-lists flex flex-col gap-2 p-4">
            <div className="flex justify-between">
              <h3>{t("supplier")}</h3>
              <p>{t("orders")}</p>
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
          <h2 className="text-lg font-bold">{t("topServices")} </h2>
          <div className="top-lists flex flex-col gap-2 p-4">
            <div className="flex justify-between">
              <h3>{t("service")}</h3>
              <p>{t("orders")}</p>
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
