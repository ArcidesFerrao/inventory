import DashboardContent from "@/components/DashboardContent";
import { Suspense } from "react";

type SearchParams = {
  period?: "daily" | "weekly" | "monthly";
};

function DashboardSkeleton() {
  return (
    <section className="flex flex-col gap-4 w-full ">
      <div className="dash-header flex items-center gap-2 justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <span className="eos-icons--three-dots-loading"></span>
      </div>
      <div className="service-stats flex gap-4 my-4">
        <div className="stats profit-stats p-4 h-fit flex flex-col gap-2 min-w-52">
          <h2 className="text-2xl font-bold underline">Cash Flow</h2>
          <div className="flex flex-col cash-stats-container gap-2">
            <div>
              <h3 className="text-lg font-normal">Revenue</h3>
              <h4 className="flex gap-2 items-center text-lg py-1 whitespace-nowrap font-bold">
                MZN
                <span className="eos-icons--three-dots-loading"></span>
              </h4>
            </div>
            <div>
              <h3 className="text-lg font-normal">Purchases</h3>
              <h4 className="flex gap-2 items-center text-lg py-1 whitespace-nowrap font-bold">
                MZN
                <span className="eos-icons--three-dots-loading"></span>
              </h4>
            </div>
            <div>
              <h3 className="text-lg font-normal">Expenses</h3>
              <h4 className="flex gap-2 items-center text-lg py-1 whitespace-nowrap font-bold">
                MZN
                <span className="eos-icons--three-dots-loading"></span>
              </h4>
            </div>
            <div>
              <h3 className="text-lg font-normal">Net Position</h3>
              <h4
                className={`flex gap-2 items-center text-lg py-1 whitespace-nowrap font-bold`}
              >
                MZN
                <span className="eos-icons--three-dots-loading"></span>
              </h4>
            </div>
          </div>
        </div>
        <div className="stats stats-details flex w-full flex-col p-4 justify-between">
          <div className="stats-header flex flex-col gap-2">
            <h2 className="text-2xl font-bold underline">Statistics</h2>
            <p className="font-thin">stats of products, sales and earnings</p>
          </div>
          <span className="eos-icons--three-dots-loading"></span>

          {/* <div className="stats-details-container flex justify-between">
            <div className=" flex flex-col gap-2">
              <h2 className="text-lg font-semibold underline ">
                Profitability
              </h2>
              <div className="stats-container flex flex-col">
                <div>
                  <h3 className="text-lg font-normal">Gross Profit</h3>
                  <h4 className="flex gap-2 items-center text-xl py-1 whitespace-nowrap font-bold">
                    MZN
                    <span className="eos-icons--three-dots-loading"></span>
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Net Profit</h3>
                  <h4 className="flex gap-2 items-center text-xl py-1 whitespace-nowrap font-bold">
                    MZN
                    <span className="eos-icons--three-dots-loading"></span>
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Margin</h3>
                  <h4 className="flex gap-2 items-center text-xl py-1 whitespace-nowrap font-bold">
                    <span className="eos-icons--three-dots-loading"></span>
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
                    MZN
                    <span className="eos-icons--three-dots-loading"></span>
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Remaining</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    <span className="eos-icons--three-dots-loading"></span>
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
                    <span className="eos-icons--three-dots-loading"></span>
                  </h4>
                </div>
                <div>
                  <h3 className="text-lg font-normal">Avg. Value</h3>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold">
                    MZN
                    <span className="eos-icons--three-dots-loading"></span>
                  </h4>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default async function ServicePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}
