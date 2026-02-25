import { getAdminSalesStats } from "@/lib/actions/dashboardStats";
import { Card } from "@/components/Card";
import { auth } from "@/lib/auth";
import Link from "next/link";

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function SalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const cs = await getTranslations("Sales");
  const ct = await getTranslations("Common");

  if (!session?.user.isAdmin) {
    redirect("/");
  }

  const stats = await getAdminSalesStats();

  if (!stats) {
    redirect("/login");
  }

  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium underline">{ct("sales")}</h1>
      </div>
      <div className="py-4 flex justify-between">
        <Card title={cs("totalSales")} value={stats.sales.totalSales} />
      </div>
      <div className="admin-orders flex flex-col gap-5">
        <h2 className="text-lg font-bold">{ct("salesList")}</h2>
        <table>
          <thead>
            <tr>
              <th>{cs("sale")}</th>
              <th>{cs("agent")}</th>
              <th>{ct("items")}</th>
              <th>{ct("total")}</th>
            </tr>
          </thead>
          <tbody>
            {stats.sales.salesData.map((s) => (
              <tr key={s.id}>
                <td>
                  <Link href={`/${locale}/admin/sales/${s.id}`}>
                    {s.id.slice(0, 5)}...
                  </Link>
                </td>
                <td>{s.Service?.businessName ?? s.Supplier?.businessName}</td>
                <td>{s.SaleItem.length}</td>
                <td>MZN {s.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
