import { getSelectedSupplierProducts } from "@/app/actions/product";
import { ListSupplierItem } from "@/components/List";
import { authOptions } from "@/lib/auth";
// import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

  // const products = await db.supplierProduct.findMany({
  //   where: {
  //     supplierId: session.user.supplierId,
  //   },
  // });

  const products = await getSelectedSupplierProducts(session.user.supplierId);

  const filteredProducts = products.filter(
    (product) => (product.stock || product.stock == 0) && product.stock < 10
  );

  return (
    <div className="products-list flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="list-title">
          <h2 className="text-2xl font-medium">Products</h2>
          <p className="text-md font-extralight">
            Manage your product catalog and inventory
          </p>
        </div>
        <Link href="/supply/products/new" className="add-product flex gap-1">
          <span>+</span>
          <span className="text-md">Product</span>
        </Link>
      </div>
      <div className="state-products flex justify-between w-full">
        <div>
          <p>Total Products</p>
          <h2 className="text-2xl font-medium">{products.length}</h2>
        </div>
        <div>
          <p>Low Stock</p>
          <h2 className="text-2xl font-medium">{filteredProducts.length}</h2>
        </div>
        <div>
          <p>Out of Stock</p>
          <h2 className="text-2xl font-medium">0</h2>
        </div>
      </div>
      {products.length === 0 ? (
        <p>No products found...</p>
      ) : (
        <ul className="flex flex-col gap-4 w-full">
          {products.map((item) => (
            <ListSupplierItem
              id={item.id}
              name={item.name}
              price={item.price || 0}
              qty={item.stock || 0}
              key={item.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
