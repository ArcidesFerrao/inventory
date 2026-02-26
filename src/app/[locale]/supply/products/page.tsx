import { getSelectedStockItems } from "@/lib/actions/product";
import { ListSupplierItem } from "@/components/List";
import { SearchInput } from "@/components/SearchInput";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  search?: string;
};

type Params = {
  locale: string;
};

export default async function ProductsPage({
  params,
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
  params: Promise<Params>;
}) {
  const session = await auth();
  const t = await getTranslations("Common");
  const it = await getTranslations("Items");

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

  const { locale } = await params;
  const query = await searchParams;
  const searchQuery = query.search?.toLowerCase() || "";

  const items = await getSelectedStockItems(session.user.supplierId);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery) ||
      item.id.toLocaleLowerCase().includes(searchQuery);

    return matchesSearch;
  });

  const lowStockItems = items.filter(
    (item) => (item.stock || item.stock == 0) && item.stock < 10,
  );

  return (
    <div className="products-list flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="list-title">
          <h2 className="text-2xl font-medium">{t("items")}</h2>
          <p className="text-md font-extralight">{it("description")}</p>
        </div>
        <Link
          href={`/${locale}/supply/products/new`}
          className="add-product flex gap-1"
        >
          <span>+</span>
          <span className="text-md">{t("item")}</span>
        </Link>
      </div>
      <div className="state-products flex justify-between w-full">
        <div>
          <p>{it("totalItems")}</p>
          <h2 className="text-2xl font-medium">{items.length}</h2>
        </div>
        <div>
          <p>{it("lowStock")}</p>
          <h2 className="text-2xl font-medium">{lowStockItems.length}</h2>
        </div>
        <div>
          <p>{it("outOfStock")}</p>
          <h2 className="text-2xl font-medium">0</h2>
        </div>
      </div>

      <SearchInput currentSearch={searchQuery} />

      {filteredItems.length === 0 ? (
        <p>{t("noItems")}...</p>
      ) : (
        <ViewList items={filteredItems} />
      )}
    </div>
  );
}

const ViewList = ({
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
    >,
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
