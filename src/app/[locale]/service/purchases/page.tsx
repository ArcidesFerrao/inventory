import PurchasesAndOrders from "@/components/PurchasesAndOrders";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function PurchasesPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const purchases = await db.purchase.findMany({
    where: { serviceId: session.user.serviceId },
    include: {
      PurchaseItem: {
        include: {
          stockItem: true,
          item: true,
        },
      },
    },
    orderBy: { timestamp: "desc" },
  });

  const orders = await db.order.findMany({
    where: { serviceId: session.user.serviceId },
    include: {
      orderItems: true,
    },
    orderBy: { timestamp: "desc" },
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="list-title">
          <h2 className="text-2xl font-medium">Recent Purchases & Orders</h2>
          <p className="text-md font-extralight">
            Manage your direct purchases and orders from suppliers
          </p>
        </div>
      </div>
      <PurchasesAndOrders purchases={purchases} orders={orders} />
    </div>
  );
}
