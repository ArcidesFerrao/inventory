import { getSupplierDashBoardStats } from "@/lib/actions/dashboardStats";
import { getStockItems } from "@/lib/actions/product";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DateFilter from "@/components/DateFilter";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  period?: "daily" | "weekly" | "monthly";
};

export default async function SupplyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  const t = await getTranslations("Common");
  const st = await getTranslations("Supplier");
  const ot = await getTranslations("Orders");

  if (!session) {
    console.log("No session found, redirecting to login");

    redirect("/login");
  }

  if (!session.user.supplierId) {
    redirect("/register/supplier");
  }

  const params = await searchParams;
  const period = params.period || "monthly";

  const stats = await getSupplierDashBoardStats(period);
  const stockItems = await getStockItems(session.user.supplierId);
  const filteredItems = stockItems.filter(
    (item) => (item.stock || item.stock == 0) && item.stock < 10,
  );

  if (!stats) return <p>{t("pleaseLogin")}</p>;
  return (
    <section className="flex flex-col w-full ">
      <div className="dash-header flex items-center justify-between">
        <h1 className="text-4xl font-semibold">{stats.supplier}</h1>
        {/* <Link
          href="/supply/products/new"
          className="add-product add-product-dash flex gap-2"
        >
          <span>+</span>
          <span className="text-md">Item</span>
        </Link> */}
        <DateFilter currentPeriod={period} />
      </div>

      <div className="supply-stats flex gap-4 my-8">
        <div className="stats profit-stats p-4 flex flex-col gap-2 min-w-52">
          <h2 className="text-2xl font-semibold underline">
            {st("financials")}
          </h2>
          {/* <div className="flex flex-col stats-container gap-1"> */}
          {/* <div>
            <h3 className="text-lg font-normal">Total Revenue</h3>
            <h4 className="text-xl py-1 whitespace-nowrap font-medium">
              MZN {stats.revenue.toFixed(2)}
            </h4>
          </div> */}

          <div>
            <h3 className="text-lg font-normal">{t("grossProfit")}</h3>
            <h4 className="text-xl py-1 whitespace-nowrap font-medium">
              MZN {stats.profit.toFixed(2)}
            </h4>
          </div>
          {/* </div> */}
        </div>
        <div className="stats stats-details flex w-full flex-col p-4 gap-2">
          <div className="stats-header flex flex-col gap-1">
            <h2 className="text-2xl font-semibold underline">
              {t("statistics")}
            </h2>
            <p className="font-thin">{st("statsSubtitle")}</p>
          </div>
          <div className="stats-details-container  flex justify-between">
            <div className=" flex flex-col gap-2">
              <h2 className="text-lg font-medium underline ">
                {t("profitability")}
              </h2>
              <div className="stats-container flex flex-col">
                <div>
                  <h3 className="text-lg font-normal">{t("sales")}</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {stats.saleCount}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">{t("grossMargin")}</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {stats.grossMargin.toFixed(1)}%
                  </h4>
                </div>
              </div>
            </div>
            <span className="divider"></span>

            <div className=" flex flex-col gap-2">
              <h2 className="text-lg font-medium underline">
                {st("customers")}
              </h2>
              <div className="stats-container flex flex-col">
                <div>
                  <h3 className="text-lg font-normal">
                    {st("totalCustomers")}
                  </h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {stats.customerCount}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">{ot("avgOrderValue")}</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    MZN {stats.averageOrderValue.toFixed(2)}
                  </h4>
                </div>
              </div>
            </div>
            <span className="divider"></span>

            <div className=" flex flex-col gap-2">
              <h2 className="text-lg font-medium underline">{t("items")}</h2>
              <div className="stats-container flex flex-col">
                <div>
                  <h3 className="text-lg font-normal">{t("itemsOffered")}</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {stats.stockItemCount}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">{t("lowStock")}</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-medium">
                    {filteredItems.length}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="suppliertop-list flex  w-fit gap-4">
        {filteredItems.length > 0 && (
          <div className="items-list flex flex-col p-4 w-fit gap-4 justify-start items-start">
            <h2 className="text-2xl font-bold">
              {t("lowStock")} {t("items")}
            </h2>
            <ul className="flex flex-col gap-1">
              {filteredItems.map((item) => (
                <li key={item.id} className="flex justify-between w-60">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.stock}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {stats.topItems.length > 0 && (
          <div className="items-list flex flex-col p-4 w-fit gap-4 justify-start items-start">
            <h2 className="text-2xl font-bold">
              {t("topOrdered")} {t("items")}
            </h2>
            <ul className="flex flex-col gap-1">
              {stats.topItems.map((item) => (
                <li key={item.id} className="flex justify-between w-60">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
