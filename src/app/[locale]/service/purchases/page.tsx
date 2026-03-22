import PurchasesAndOrders from "@/components/PurchasesAndOrders";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function PurchasesPage() {
  const session = await auth();
  const purchasesT = await getTranslations("Purchases");

  const serviceId = session?.user.serviceId;

  if (!serviceId) redirect("/login");

  const [purchases, orders, purchasesCount, ordersCount] = await Promise.all([
    db.purchase.findMany({
      where: { serviceId },
      include: {
        PurchaseItem: {
          include: { stockItem: true, item: true },
        },
      },
      orderBy: { timestamp: "desc" },
      take: 10,
    }),
    db.order.findMany({
      where: { serviceId },
      include: { orderItems: true },
      orderBy: { timestamp: "desc" },
      take: 10,
    }),
    db.purchase.count({ where: { serviceId } }),
    db.order.count({ where: { serviceId } }),
  ]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="list-title">
          <h2 className="text-2xl font-medium">{purchasesT("title")}</h2>
          <p className="text-md font-extralight">{purchasesT("subtitle")}</p>
        </div>
      </div>
      <PurchasesAndOrders
        purchases={purchases}
        orders={orders}
        orderCount={ordersCount}
        purchaseCount={purchasesCount}
      />
    </div>
  );
}
