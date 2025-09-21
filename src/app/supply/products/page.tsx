import { ListItem } from "@/components/List";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const products = await db.supplierProduct.findMany({
    where: {
      supplierId: session.user.id,
    },
  });

  //   if (products.length === 0) {
  //     <section>
  //       <p>No products found...</p>
  //     </section>;
  //   }

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-medium">Products</h2>
        <Link href="/service/products/new" className="add-product flex gap-1">
          <span>+</span>
          <span className="text-md">Product</span>
        </Link>
      </div>
      {products.length === 0 ? (
        <p>No products found...</p>
      ) : (
        <div className="menu-products flex justify-between gap-8">
          <ul className="flex flex-col gap-4">
            {products.map((item) => (
              <ListItem
                id={item.id}
                name={item.name}
                price={item.price || 0}
                key={item.id}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
