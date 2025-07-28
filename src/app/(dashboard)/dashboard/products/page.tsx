import { ListItem } from "@/components/List";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const products = await db.product.findMany({
    where: { userId: session.user.id },
  });

  return (
    <section className="flex justify-center">
      {/* {loading ? (
        <span className="eos-icons--three-dots-loading"></span>
      ) : ( */}
      <div className="products-list flex flex-col gap-4">
        <div className="list-header flex items-center justify-between">
          <h2 className="text-2xl font-medium">Products List</h2>
          <Link
            href="/dashboard/products/new"
            className="add-product flex gap-1"
          >
            <span>+</span>
            <span className="text-md">Product</span>
          </Link>
        </div>
        <ul className="flex flex-col gap-4">
          {products.map((item) => (
            <ListItem
              stock={item.stock}
              id={item.id}
              name={item.name}
              price={item.price}
              key={item.id}
            />
          ))}
        </ul>
      </div>
      {/* )} */}
    </section>
  );
}
