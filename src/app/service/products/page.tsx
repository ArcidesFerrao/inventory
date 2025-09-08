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
    where: {
      userId: session.user.id,
      type: "SERVICE",
    },
    include: {
      Category: true,
    },
  });

  if (products.length === 0) {
    <section>
      <p>No products found...</p>
    </section>;
  }

  const lanche = products.filter((p) => p.Category?.name === "Lanche");
  const bebidas = products.filter((p) => p.Category?.name === "Bebida");
  const refeicao = products.filter((p) => p.Category?.name === "Refeição");

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-medium">Menu</h2>
        <Link href="/service/products/new" className="add-product flex gap-1">
          <span>+</span>
          <span className="text-md">Product</span>
        </Link>
      </div>
      {products.length === 0 ? (
        <p>No products found...</p>
      ) : (
        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Lanche</h2>
            <ul className="flex flex-col gap-4">
              {lanche.map((item) => (
                <ListItem
                  stock={item.stock}
                  id={item.id}
                  name={item.name}
                  price={item.price || 0}
                  key={item.id}
                />
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Bebidas</h2>
            <ul className="flex flex-col gap-4">
              {bebidas.map((item) => (
                <ListItem
                  stock={item.stock}
                  id={item.id}
                  name={item.name}
                  price={item.price || 0}
                  key={item.id}
                />
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Refeicao</h2>
            <ul className="flex flex-col gap-4">
              {refeicao.map((item) => (
                <ListItem
                  stock={item.stock}
                  id={item.id}
                  name={item.name}
                  price={item.price || 0}
                  key={item.id}
                />
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
