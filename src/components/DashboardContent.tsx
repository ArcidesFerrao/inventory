import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DateFilter from "@/components/DateFilter";
import { CashFlowChart } from "@/components/CashFlowChart";
import { RecentActivity } from "@/components/RecentActivity";
import { getServiceDashBoardStats } from "@/app/actions/dashboardStats";

type SearchParams = {
  period?: "daily" | "weekly" | "monthly";
};

export default async function ServicePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();

  if (!session) {
    console.log("No session found, redirecting to login");
    redirect("/login");
  }

  if (!session.user.serviceId) {
    redirect("/register/service");
  }

  const params = await searchParams;
  const period = params.period || "monthly";
  const stats = await getServiceDashBoardStats(period);
  if (!stats) return <p>Please login to see the dashboard</p>;
  const lowStockItems = stats?.serviceStockItems.filter(
    (product) => (product.stock || product.stock == 0) && product.stock < 10,
  );

  return (
    <section className="flex flex-col gap-4 w-full ">
      <div className="dash-header flex items-center gap-2 justify-between">
        <h1 className="text-2xl font-semibold">
          {stats.service}&apos;s Dashboard
        </h1>
        <DateFilter currentPeriod={period} />
      </div>

      <div className="service-stats flex gap-4 my-4">
        <div className="stats profit-stats p-4 h-fit flex flex-col gap-2 min-w-52">
          <h2 className="text-2xl font-bold underline">Cash Flow</h2>
          <div className="flex flex-col cash-stats-container gap-2">
            <div>
              <h3 className="label-text text-lg font-normal">Revenue</h3>
              <h4 className="text-lg py-1 whitespace-nowrap font-bold">
                MZN {stats.earnings.toFixed(2)}
              </h4>
            </div>
            <div>
              <h3 className="label-text text-lg font-normal">Purchases</h3>
              <h4 className="text-lg py-1 whitespace-nowrap font-bold">
                MZN {stats.purchases.toFixed(2)}
              </h4>
            </div>
            <div>
              <h3 className="label-text text-lg font-normal">Expenses</h3>
              <h4 className="text-lg py-1 whitespace-nowrap font-bold">
                MZN {stats.expenses.toFixed(2)}
              </h4>
            </div>
            <div>
              <h3 className="label-text text-lg font-normal">Net Position</h3>
              <h4
                className={`text-lg py-1 whitespace-nowrap font-bold ${
                  Number(stats.balance.toFixed(2)) <= 0
                    ? "text-red-300"
                    : "text-green-300"
                }`}
              >
                MZN {stats.balance.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>
        <div className="stats stats-details flex w-full flex-col p-4 justify-between">
          <div className="stats-header flex flex-col gap-2">
            <h2 className="text-2xl font-bold underline">Statistics</h2>
            <p className="font-thin">stats of products, sales and earnings</p>
          </div>
          <div className="stats-details-container flex justify-between">
            <div className=" flex flex-col gap-2">
              <h2 className="text-lg font-semibold underline ">
                Profitability
              </h2>
              <div className="stats-container flex flex-col">
                <div>
                  <h3 className="label-text text-lg font-normal">
                    Gross Profit
                  </h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    MZN {stats.profit.toFixed(2)}
                  </h4>
                </div>
                <div>
                  <h3 className="label-text text-lg font-normal">Net Profit</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    MZN {stats.netProfit.toFixed(2)}
                  </h4>
                </div>
                <div>
                  <h3 className="label-text text-lg font-normal">Margin</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    {stats.grossMargin.toFixed(1)}%
                  </h4>
                </div>
              </div>
            </div>
            <span className="divider"></span>

            <div className=" flex flex-col gap-2">
              <h2 className="text-lg font-semibold underline">Inventory</h2>
              <div className="stats-container flex flex-col">
                <div>
                  <h3 className="label-text text-lg font-normal">
                    Total Value
                  </h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    MZN {stats.inventoryValue.toFixed(2)}
                  </h4>
                </div>
                <div>
                  <h3 className="label-text text-lg font-normal">Remaining</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    {stats.inventoryPercentage.toFixed(1)}%
                  </h4>
                </div>
              </div>
            </div>
            <span className="divider"></span>

            <div className=" flex flex-col gap-2">
              <h2 className="text-lg font-semibold underline">Sales</h2>
              <div className="stats-container flex flex-col">
                <div>
                  <h3 className="label-text text-lg font-normal">
                    Total Sales
                  </h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    {stats.salesCount}
                  </h4>
                </div>
                <div>
                  <h3 className="label-text text-lg font-normal">Avg. Value</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    MZN {stats.averageSaleValue.toFixed(2)}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-stats-details grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <CashFlowChart
            revenue={stats.earnings}
            purchases={stats.purchases}
            expenses={stats.expenses}
            balance={stats.balance}
          />
          <RecentActivity sales={stats.recentSales} />
        </div>
        <div className="flex flex-col gap-4 w-full">
          {lowStockItems.length > 0 && (
            <div className="items-list flex flex-col p-4 w-full gap-4 justify-between items-start">
              <h2 className="text-xl font-bold">Critic Items</h2>
              <ul className="flex flex-col  w-full gap-1">
                {lowStockItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.stockItem.name}</span>
                    <span className="font-medium">{item.stock}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stats.topItems.length > 0 && (
            <div className="items-list flex flex-col p-4   gap-4 justify-start items-start">
              <h2 className="text-xl font-bold">Top Items</h2>
              <ul className="flex flex-col w-full gap-1">
                {stats.topItems.map(
                  (item) =>
                    item && (
                      <li key={item.id} className="flex justify-between w-full">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.quantity}</span>
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
