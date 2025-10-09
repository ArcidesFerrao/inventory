"use client";

import { ProductWithCategory } from "@/types/types";
import Link from "next/link";
import React, { useState } from "react";
import { ListDrinkItem, ListItem, ListStockItem } from "./List";

export default function MenuAndStock({
  products,
}: {
  products: ProductWithCategory[];
}) {
  const [view, setView] = useState<"menu" | "stock">("menu");

  if (products.length === 0) {
    <section>
      <p>No products found...</p>
    </section>;
  }
  const menuProducts = products.filter((p) => p.type === "SERVICE");
  const stockProducts = products.filter((p) => p.type === "STOCK");

  const lanche = menuProducts.filter((p) => p.Category?.name === "Lanche");
  const bebidas = menuProducts.filter((p) => p.Category?.name === "Bebidas");
  const refeicao = menuProducts.filter((p) => p.Category?.name === "Refeicao");

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
              New Product
            </span>
          </Link>
        </div>
      </div>
      {view === "menu" && (
        <>
          {products.length === 0 ? (
            <p>No products found...</p>
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
              <section className="drinks-list flex flex-col p-4 gap-2 max-w-72">
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
    </div>
  );
}
