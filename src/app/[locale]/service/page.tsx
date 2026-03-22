import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DateFilter from "@/components/DateFilter";
import { Suspense } from "react";
import {
  CashFlowSection,
  CashFlowSkeleton,
} from "@/components/dashboard/CashFlowSection";
import {
  StatisticsSection,
  StatisticsSkeleton,
} from "@/components/dashboard/StatisticsSection";
import {
  InventorySection,
  InventorySkeleton,
} from "@/components/dashboard/InventorySection";
import {
  RecentActivitySection,
  RecentActivitySkeleton,
} from "@/components/dashboard/RecentActivitySection";

type SearchParams = {
  period?: "daily" | "weekly" | "monthly";
};

export default async function ServicePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (!session.user.serviceId) redirect("/register/service");

  const { period = "monthly" } = await searchParams;
  const { serviceId, id: userId } = session.user;

  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="dash-header flex items-center gap-2 justify-between">
        <h1 className="text-2xl font-semibold">{session.user.name}</h1>
        <DateFilter currentPeriod={period} />
      </div>

      <div className="service-stats flex flex-col gap-4 my-4">
        <Suspense fallback={<CashFlowSkeleton />}>
          <CashFlowSection
            serviceId={serviceId}
            userId={userId}
            period={period}
          />
        </Suspense>

        <Suspense fallback={<StatisticsSkeleton />}>
          <StatisticsSection
            serviceId={serviceId}
            userId={userId}
            period={period}
          />
        </Suspense>
      </div>

      <div className="dash-stats-details grid grid-cols-2 gap-4">
        <Suspense fallback={<InventorySkeleton />}>
          <InventorySection
            serviceId={serviceId}
            userId={userId}
            period={period}
          />
        </Suspense>

        <Suspense fallback={<RecentActivitySkeleton />}>
          <RecentActivitySection
            serviceId={serviceId}
            userId={userId}
            period={period}
          />
        </Suspense>
      </div>
    </section>
  );
}
