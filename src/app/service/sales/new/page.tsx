import { SalesList } from "@/components/SalesList";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SaleProductWithMenuItems } from "@/types/types";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewSale() {
  const session = await auth();

  if (!session?.user.serviceId) redirect("/login");

  const products = await db.product.findMany({
    where: {
      serviceId: session.user.serviceId,
      type: "SERVICE",
    },
    include: {
      MenuItems: {
        include: {
          stock: true,
        },
      },
      Category: true,
    },
  });

  const mappedProducts: SaleProductWithMenuItems[] = products.map(
    (product) => ({
      ...product,
      price: product.price ?? 0,
      stock: product.stock ?? 0,
      quantity: 0,
    })
  );

  return (
    <div className="sales-section flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold">Menu Products</h2>
        <Link href="/service/sales" className="add-product flex gap-1">
          <span className="text-md px-2">Cancel</span>
        </Link>
      </div>
      <div className="sales-content flex justify-between gap-4">
        {products.length === 0 ? (
          <p>No products found...</p>
        ) : (
          <SalesList
            initialProducts={mappedProducts}
            serviceId={session.user.serviceId}
          />
        )}
      </div>
    </div>
  );
}
