import { getSelectedStockItems } from "@/app/actions/product";
import { ListSupplierItem } from "@/components/List";
import { SearchInput } from "@/components/SearchInput";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

type SearchParams = {
  search?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

  const params = await searchParams;
  const searchQuery = params.search?.toLowerCase() || "";

  const items = await getSelectedStockItems(session.user.supplierId);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery) ||
      item.id.toLocaleLowerCase().includes(searchQuery);

    return matchesSearch;
  });

  const lowStockItems = items.filter(
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
          <h2 className="text-2xl font-medium">{lowStockItems.length}</h2>
        </div>
        <div>
          <p>Out of Stock</p>
          <h2 className="text-2xl font-medium">0</h2>
        </div>
      </div>

      <SearchInput currentSearch={searchQuery} />

      {filteredItems.length === 0 ? (
        <p>No items found...</p>
      ) : (
        <ViewList items={filteredItems} />
      )}
    </div>
  );
}

export const ViewList = ({
  items,
}: {
  items: {
    name: string;
    id: string;
    stock: number | null;
    price: number | null;
    category: {
      name: string;
    } | null;
  }[];
}) => {
  const itemsByCategory = items.reduce(
    (acc, item) => {
      const categoryName = item.category?.name || "";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(item);
      return acc;
    },
    {} as Record<
      string,
      {
        name: string;
        id: string;
        stock: number | null;
        price: number | null;
        category: {
          name: string;
        } | null;
      }[]
    >
  );

  const categories = Object.keys(itemsByCategory);
  const hasCategories =
    categories.length > 1 || (categories.length === 1 && categories[0]);

  return (
    // <div className="menu-products flex justify-between gap-8">
    <>
      {hasCategories ? (
        <>
          {categories.map((categoryName) => (
            <section
              className="flex flex-col gap-2  max-h-fit"
              key={categoryName}
            >
              <h2 className="text-lg font-medium">{categoryName}</h2>
              <ul className="flex flex-col gap-2">
                {itemsByCategory[categoryName].map((item) => (
                  <ListSupplierItem
                    id={item.id}
                    name={item.name}
                    price={item.price || 0}
                    key={item.id}
                    qty={item.stock || 0}
                  />
                ))}
              </ul>
            </section>
          ))}
        </>
      ) : (
        <section className="flex flex-col p-4 gap-2 max-h-fit">
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <ListSupplierItem
                id={item.id}
                name={item.name}
                price={item.price || 0}
                key={item.id}
                qty={item.stock || 0}
              />
            ))}
          </ul>
        </section>
      )}
    </>
  );
};
