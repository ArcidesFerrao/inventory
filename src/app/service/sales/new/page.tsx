import { SalesList } from "@/components/SalesList";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SaleItemWithCatalogItems } from "@/types/types";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewSale() {
  const session = await auth();

  if (!session?.user.serviceId) redirect("/login");

  const items = await db.item.findMany({
    where: {
      serviceId: session.user.serviceId,
      type: "SERVICE",
    },
    include: {
      CatalogItems: {
        include: {
          serviceStockItem: {
            include: {
              stockItem: true,
            },
          },
        },
      },
      category: true,
    },
  });

  const mappedItems: SaleItemWithCatalogItems[] = items.map((item) => ({
    ...item,
    price: item.price ?? 0,
    stock: item.stock ?? 0,
    quantity: 0,
  }));

  return (
    <div className="sales-section flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold">Catalog Items</h2>
        <Link href="/service/sales" className="add-product flex gap-1">
          <span className="text-md px-2">Cancel</span>
        </Link>
      </div>
      <div className="sales-content flex justify-between gap-4">
        {items.length === 0 ? (
          <p>No items found...</p>
        ) : (
          <SalesList
            initialItems={mappedItems}
            serviceId={session.user.serviceId}
          />
        )}
      </div>
    </div>
  );
}
