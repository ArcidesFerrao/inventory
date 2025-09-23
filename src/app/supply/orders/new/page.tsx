import { SalesList } from "@/components/SalesList";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewOrder() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const products = await db.supplierProduct.findMany({
    where: {
      supplierId: session.user.id,
    },
    include: {
      Unit: true,
    },
  });

  return (
    <div className="sales-section flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold">Menu Products</h2>
        <Link href="/supply/orders" className="add-product flex gap-1">
          <span className="text-md px-2">Cancel</span>
        </Link>
      </div>
      <div className="sales-content flex justify-between gap-4">
        {products.length === 0 ? (
          <p>No products found...</p>
        ) : (
          <SalesList initialProducts={products} userId={session.user.id} />
        )}
      </div>
    </div>
  );
}
