import { OrdersList } from "@/components/OrdersList";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function NewOrder() {
  const products = await db.supplierProduct.findMany({
    include: {
      Unit: true,
    },
  });

  return (
    <div className="sales-section flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold">Purchase Products</h2>
        <Link href="/service/purchases" className="add-product flex gap-1">
          <span className="text-md px-2">Cancel</span>
        </Link>
      </div>
      <div className="sales-content flex justify-between gap-4">
        {products.length === 0 ? (
          <p>No products found...</p>
        ) : (
          <OrdersList initialProducts={products} />
        )}
      </div>
    </div>
  );
}
