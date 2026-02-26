import { SaleListItem } from "@/components/List";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations("Common");
  const st = await getTranslations("Sales");

  if (!session?.user) redirect("/login");

  const sales = await db.sale.findMany({
    where: { serviceId: session.user.serviceId },
    include: {
      SaleItem: {
        include: {
          item: true,
        },
      },
    },
    orderBy: { timestamp: "desc" },
  });

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <div className="list-header sales-list-header flex items-center justify-between w-full">
        <div className="sales-title">
          <h2 className="text-2xl font-medium">{t("recentSales")}</h2>
          <p className="text-md font-extralight">{st("subtitle")}</p>
        </div>
        <Link
          href={`/${locale}/service/sales/new`}
          className="add-product flex gap-1"
        >
          <span className="text-md px-2">{st("newSale")}</span>
        </Link>
      </div>
      <div className="flex justify-between">
        <div className="total-sales-title flex flex-col gap-2">
          <p>{st("totalSales")}</p>
          <h4 className="text-xl font-bold">{sales.length}</h4>
        </div>
        <div className="flex flex-col gap-2">
          <p>{st("totalRevenue")}</p>
          <h4 className="text-xl font-bold">
            MZN {sales.reduce((acc, sale) => acc + sale.total, 0).toFixed(2)}
          </h4>
        </div>
        <div className="total-sales-title flex flex-col gap-2">
          <p>{t("cogs")}</p>
          <h4 className="text-xl font-bold">
            MZN {sales.reduce((acc, sale) => acc + sale.cogs, 0).toFixed(2)}
          </h4>
        </div>
        <div className="flex flex-col gap-2">
          <p>{t("grossProfit")}</p>
          <h4 className="text-xl font-bold">
            MZN{" "}
            {(
              sales.reduce((acc, sale) => acc + sale.total, 0) -
              sales.reduce((acc, sale) => acc + sale.cogs, 0)
            ).toFixed(2)}
          </h4>
        </div>
      </div>
      {sales.length === 0 ? (
        <p>{st("noItems")}</p>
      ) : (
        <ul className="w-full flex flex-col gap-4">
          {sales.map((sale) => (
            <SaleListItem key={sale.id} sale={sale} />
          ))}
        </ul>
      )}
    </div>
  );
}
