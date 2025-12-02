import Link from "next/link";
import { getServiceDashBoardStats } from "../actions/dashboardStats";
import { getItems } from "../actions/product";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ServicePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!session.user.serviceId) {
    redirect("/register/service");
  }

  const stats = await getServiceDashBoardStats();
  const stockProducts = await getItems(session.user.serviceId);
  const filteredProducts = stockProducts.filter(
    (product) =>
      (product.stock || product.stock == 0) &&
      product.stock < (product.critical ?? 10)
  );

  if (!stats) return <p>Please login to see the dashboard</p>;
  return (
    <section className="flex flex-col w-full ">
      <div className="dash-header flex items-center justify-between">
        <h1 className="text-4xl font-medium">
          {stats.service}&apos;s Dashboard
        </h1>
        <div className="flex gap-4">
          <Link href="/service/products/new" className="add-product flex gap-2">
            <span>+</span>
            <span className="text-md">Product</span>
          </Link>
          <Link href="/service/sales/new" className="add-product flex gap-2">
            <span>+</span>
            <span className="text-md">Sale</span>
          </Link>
        </div>
      </div>

      <div className="service-stats flex gap-4 my-8">
        <div className="stats profit-stats p-4 h-fit flex flex-col gap-2 min-w-52">
          <h2 className="text-2xl font-bold underline">Cash Flow</h2>
          <div className="flex flex-col cash-stats-container gap-2">
            <div>
              <h3 className="text-lg font-normal">Revenue</h3>
              <h4 className="text-lg py-1 whitespace-nowrap font-bold">
                MZN {stats.earnings.toFixed(2)}
              </h4>
            </div>
            <div>
              <h3 className="text-lg font-normal">Purchases</h3>
              <h4 className="text-lg py-1 whitespace-nowrap font-bold">
                MZN {stats.purchases.toFixed(2)}
              </h4>
            </div>
            <div>
              <h3 className="text-lg font-normal">Expenses</h3>
              <h4 className="text-lg py-1 whitespace-nowrap font-bold">
                MZN {stats.expenses.toFixed(2)}
              </h4>
            </div>
            <div>
              <h3 className="text-lg font-normal">Net Position</h3>
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
                  <h3 className="text-lg font-normal">Gross Profit</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    MZN {stats.profit.toFixed(2)}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Net Profit</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    MZN {stats.netProfit.toFixed(2)}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Margin</h3>
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
                  <h3 className="text-lg font-normal">Total Value</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    MZN {stats.inventoryValue.toFixed(2)}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Remaining</h3>
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
                  <h3 className="text-lg font-normal">Total Sales</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    {stats.salesCount}
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Avg. Value</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    MZN {stats.averageSaleValue.toFixed(2)}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex  w-fit gap-4">
        {filteredProducts.length > 0 && (
          <div className="items-list flex flex-col p-4 w-fit gap-4 justify-start items-start">
            <h2 className="text-xl font-bold">Critic Items</h2>
            <ul className="flex flex-col gap-1">
              {filteredProducts.map((item) => (
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
            <h2 className="text-xl font-bold">Top Items</h2>
            <ul className="flex flex-col gap-1">
              {stats.topItems.map(
                (item) =>
                  item && (
                    <li key={item.id} className="flex justify-between w-60">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.quantity}</span>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
