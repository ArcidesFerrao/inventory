import { DashSaleListItem } from "./List";
import { Sale } from "@/generated/prisma";

export const RecentActivity = async ({ sales }: { sales: Sale[] }) => {
  if (sales.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-normal">Recent Sales</h3>
      <ul className="flex flex-col gap-2">
        {sales.map((sale) => (
          <DashSaleListItem sale={sale} key={sale.id} />
        ))}
      </ul>
    </div>
  );
};
