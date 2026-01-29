import { PurchasesList } from "@/components/PurchasesList";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewPurchase({
  params,
}: {
  params: { locale: string };
}) {
  const locale = await params.locale;

  const session = await auth();

  if (!session?.user.serviceId) redirect("/login");

  const stockItems = await db.serviceStockItem.findMany({
    where: {
      serviceId: session.user.serviceId,
    },
    include: {
      stockItem: true,
    },
  });

  return (
    <div className="sales-section flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-medium">New Purchase</h2>
        <Link
          href={`/${locale}/service/purchases`}
          className="add-product flex gap-1"
        >
          <span className="text-md px-2">Cancel</span>
        </Link>
      </div>
      <div className="sales-content flex justify-between gap-4">
        {stockItems.length === 0 ? (
          <p>No items found...</p>
        ) : (
          <PurchasesList
            initialStockItems={stockItems.map((item) => ({
              ...item,
              price: item.stockItem.price ?? 0,
              quantity: 0,
            }))}
            serviceId={session.user.serviceId}
          />
        )}
      </div>
    </div>
  );
}
