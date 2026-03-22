import { getRecentSales } from "@/lib/actions/dashboardStats";
import { RecentActivity } from "@/components/RecentActivity";
import { Period } from "@/types/types";

type Props = { serviceId: string; userId: string; period: Period };

export async function RecentActivitySection({
  serviceId,
  userId,
  period,
}: Props) {
  const data = await getRecentSales(serviceId, userId, period);
  if (!data) return null;

  return <RecentActivity sales={data.recentSales} />;
}

export function RecentActivitySkeleton() {
  return (
    <div className="stats flex flex-col p-4 gap-4 animate-pulse">
      <div className="h-6 w-36 bg-base-300 rounded" />
      <ul className="flex flex-col gap-3 w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <div className="h-4 w-32 bg-base-300 rounded" />
              <div className="h-3 w-20 bg-base-300 rounded" />
            </div>
            <div className="h-5 w-20 bg-base-300 rounded" />
          </li>
        ))}
      </ul>
    </div>
  );
}
