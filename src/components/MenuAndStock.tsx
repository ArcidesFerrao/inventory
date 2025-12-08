"use client";

import { ItemWithCategory } from "@/types/types";
import Link from "next/link";
import { useState } from "react";
import { ListItem, ListStockItem } from "./List";
import { ServiceStockItem, StockItem } from "@/generated/prisma";

export default function MenuAndStock({
  items,
  stockItems,
}: {
  items: ItemWithCategory[];
  stockItems: (ServiceStockItem & {
    stockItem: StockItem;
  })[];
}) {
  const [view, setView] = useState<"list" | "stock">("list");

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="header-p-o flex justify-between">
        <div className="toggle-buttons flex">
          <button
            className={`flex items-center gap-2 px-4 py-2 text-xl ${
              view === "list" && "toggled border-b-2"
            }`}
            onClick={() => setView("list")}
          >
            <span className="roentgen--bag"></span> List
          </button>
          <button
            className={` flex items-center gap-2 px-4 py-2 text-xl ${
              view === "stock" && "toggled border-b-2"
            }`}
            onClick={() => setView("stock")}
          >
            <span className="flowbite--cart-solid"></span> Stock
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <Link
            href={
              view === "list" ? "/service/products/new" : "/service/stock/new"
            }
            className="add-product flex gap-1"
          >
            <span className="text-md px-2 flex items-center gap-2">
              New {view === "stock" && "Stock"} Item
            </span>
          </Link>
        </div>
      </div>
      {view === "list" && (
        <>
          {items.length === 0 ? (
            <section className="flex flex-col gap-2">
              <p>No items found...</p>
              <p className="font-thin text-sm">
                Click on &quot;New Item&quot; to add one.
              </p>
            </section>
          ) : (
            <ViewList items={items} />
          )}
        </>
      )}
      {view === "stock" && (
        <>
          {stockItems.length === 0 ? (
            <section className="flex flex-col gap-2">
              <p>No items found...</p>
              <p className="font-thin text-sm">
                Click on &quot;New Product&quot; to add one.
              </p>
            </section>
          ) : (
            <section>
              <ul className="flex flex-col gap-4">
                {stockItems.map((p) => (
                  <ListStockItem
                    id={p.id}
                    name={p.stockItem.name}
                    price={p.cost || 0}
                    stock={p.stock || 0}
                    key={p.id}
                  />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export const ViewList = ({ items }: { items: ItemWithCategory[] }) => {
  const itemsByCategory = items.reduce((acc, item) => {
    const categoryName = item.category?.name || "";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }

    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, ItemWithCategory[]>);

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
                  <ListItem
                    id={item.id}
                    name={item.name}
                    price={item.price || 0}
                    key={item.id}
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
              <ListItem
                id={item.id}
                name={item.name}
                price={item.price || 0}
                key={item.id}
              />
            ))}
          </ul>
        </section>
      )}
      {/* </div> */}
    </>
  );
};
