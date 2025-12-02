import { getSelectedStockItems } from "@/app/actions/product";
import { ListSupplierItem } from "@/components/List";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

  const items = await getSelectedStockItems(session.user.supplierId);

  const filteredItems = items.filter(
    (item) => (item.stock || item.stock == 0) && item.stock < 10
  );

  return (
    <div className="products-list flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="list-title">
          <h2 className="text-2xl font-medium">Items</h2>
          <p className="text-md font-extralight">
            Manage your item catalog and inventory
          </p>
        </div>
        <Link href="/supply/products/new" className="add-product flex gap-1">
          <span>+</span>
          <span className="text-md">Item</span>
        </Link>
      </div>
      <div className="state-products flex justify-between w-full">
        <div>
          <p>Total Items</p>
          <h2 className="text-2xl font-medium">{items.length}</h2>
        </div>
        <div>
          <p>Low Stock</p>
          <h2 className="text-2xl font-medium">{filteredItems.length}</h2>
        </div>
        <div>
          <p>Out of Stock</p>
          <h2 className="text-2xl font-medium">0</h2>
        </div>
      </div>
      {items.length === 0 ? (
        <p>No items found...</p>
      ) : (
        <ul className="flex flex-col gap-4 w-full">
          {items.map((item) => (
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
