import DashboardContent from "@/components/DashboardContent";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

type SearchParams = {
  period?: "daily" | "weekly" | "monthly";
};

function DashboardSkeleton() {
  const t = useTranslations("Common");

  return (
    <section className="flex flex-col gap-4 w-full ">
      <div className="dash-header flex items-center gap-2 justify-between">
        <h1 className="text-2xl font-semibold">{t("dashboard")}</h1>
        <span className="eos-icons--three-dots-loading"></span>
      </div>
      <div className="service-stats flex gap-4 my-4">
        <div className="stats profit-stats p-4 h-fit flex flex-col gap-2 min-w-52">
          <h2 className="text-2xl font-bold underline">{t("cashFlow")}</h2>
          <div className="flex flex-col cash-stats-container gap-2">
            <div>
              <h3 className="label-text text-lg font-normal">{t("revenue")}</h3>
              <h4 className="flex gap-2 items-center text-lg py-1 whitespace-nowrap font-bold">
                MZN
                <span className="eos-icons--three-dots-loading"></span>
              </h4>
            </div>
            <div>
              <h3 className="label-text text-lg font-normal">
                {t("purchases")}
              </h3>
              <h4 className="flex gap-2 items-center text-lg py-1 whitespace-nowrap font-bold">
                MZN
                <span className="eos-icons--three-dots-loading"></span>
              </h4>
            </div>
            <div>
              <h3 className="label-text text-lg font-normal">
                {t("expenses")}
              </h3>
              <h4 className="flex gap-2 items-center text-lg py-1 whitespace-nowrap font-bold">
                MZN
                <span className="eos-icons--three-dots-loading"></span>
              </h4>
            </div>
            <div>
              <h3 className="label-text text-lg font-normal">
                {t("netPosition")}
              </h3>
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
            <h2 className="text-2xl font-bold underline">{t("statistics")}</h2>
            <p className="font-thin">{t("statsDescription")}</p>
          </div>
          <span className="eos-icons--three-dots-loading"></span>
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
