import { ServiceOrder } from "@/components/ServiceOrder";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function NewOrder() {
  const suppliers = await db.supplier.findMany({
    include: {
      products: {
        include: {
          Unit: true,
          supplier: true,
        },
      },
    },
  });

  return (
    <>
      <div className="sales-section flex flex-col gap-5 w-full">
        <div className="list-header flex items-center justify-between w-full">
          <h2 className="text-2xl font-bold">Suppliers List</h2>
          <Link href="/service/purchases" className="add-product flex gap-1">
            <span className="text-md px-2">Cancel</span>
          </Link>
        </div>
        {suppliers.length > 0 ? (
          <ServiceOrder suppliers={suppliers} />
        ) : (
          <p>No suppliers found...</p>
        )}
      </div>
    </>
  );
}
