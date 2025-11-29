"use client";

import { ItemWithCategory } from "@/types/types";
import Link from "next/link";
import { useState } from "react";
import { ListDrinkItem, ListItem, ListStockItem } from "./List";

export default function MenuAndStock({ items }: { items: ItemWithCategory[] }) {
  const [view, setView] = useState<"menu" | "stock">("menu");
  console.log(items);
  if (items.length === 0) {
    <section className="flex gap-2">
      <p>No items found...</p>
      <p>Click on &quot;New Item&quot; to add on.</p>
    </section>;
  }
  const menuProducts = items.filter((p) => p.type === "SERVICE");
  const stockProducts = items.filter((p) => p.type === "STOCK");

  const lanche = menuProducts.filter((p) => p.category?.name === "Lunch");
  const bebidas = menuProducts.filter((p) => p.category?.name === "Drink");
  const refeicao = menuProducts.filter((p) => p.category?.name === "Meal");

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="header-p-o flex justify-between">
        <div className="toggle-buttons flex">
          <button
            className={`flex items-center gap-2 px-4 py-2 text-xl ${
              view === "menu" && "toggled border-b-2"
            }`}
            onClick={() => setView("menu")}
          >
            <span className="roentgen--bag"></span> Menu
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
          <Link href="/service/products/new" className="add-product flex gap-1">
            <span className="text-md px-2 flex items-center gap-2">
              New Item
            </span>
          </Link>
        </div>
      </div>
      {view === "menu" && (
        <>
          {items.length === 0 ? (
            <section className="flex flex-col gap-2">
              <p>No items found...</p>
              <p className="font-thin text-sm">
                Click on &quot;New Item&quot; to add one.
              </p>
            </section>
          ) : (
            <div className="menu-products flex justify-between gap-8">
              <div className="flex flex-col gap-4">
                <section className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium">Lunch</h2>
                  {/* <h2 className="text-lg font-medium">Lanche</h2> */}
                  <ul className="flex flex-col gap-4">
                    {lanche.map((item) => (
                      <ListItem
                        id={item.id}
                        name={item.name}
                        price={item.price || 0}
                        key={item.id}
                      />
                    ))}
                  </ul>
                </section>
                <section className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium">Meal</h2>
                  {/* <h2 className="text-lg font-medium">Refeição</h2> */}
                  <ul className="flex flex-col gap-4">
                    {refeicao.map((item) => (
                      <ListItem
                        id={item.id}
                        name={item.name}
                        price={item.price || 0}
                        key={item.id}
                      />
                    ))}
                  </ul>
                </section>
              </div>
              <section className="drinks-list flex flex-col p-4 gap-2 max-w-72 max-h-fit">
                <h2 className="text-lg font-medium">Drinks</h2>
                {/* <h2 className="text-lg font-medium">Bebidas</h2> */}
                <ul className="flex flex-col">
                  {bebidas.map((item) => (
                    <ListDrinkItem
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
        </>
      )}
      {view === "stock" && (
        <>
          {stockProducts.length === 0 ? (
            <section className="flex flex-col gap-2">
              <p>No items found...</p>
              <p className="font-thin text-sm">
                Click on &quot;New Product&quot; to add one.
              </p>
            </section>
          ) : (
            <section>
              <ul className="flex flex-col gap-4">
                {stockProducts.map((p) => (
                  <ListStockItem
                    id={p.id}
                    name={p.name}
                    price={p.price || 0}
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
