"use client";

import { ProductWithCategory } from "@/types/types";
import Link from "next/link";
import React, { useState } from "react";
import { ListItem } from "./List";

export default function MenuAndStock(products: ProductWithCategory[]) {
  const [view, setView] = useState<"menu" | "stock">("menu");

  if (products.length === 0) {
    <section>
      <p>No products found...</p>
    </section>;
  }
  const menuProducts = products.filter((p) => p.type === "SERVICE");
  const stockProducts = products.filter((p) => p.type === "STOCK");

  const lanche = menuProducts.filter((p) => p.Category?.name === "Lanche");
  const bebidas = menuProducts.filter((p) => p.Category?.name === "Bebida");
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
          {view === "stock" && (
            <Link
              href="/service/purchases/stock/new"
              className="add-product flex gap-1"
            >
              <span className="text-md px-2 flex items-center gap-2">
                <span className="flowbite--cart-solid"></span>New Stock Product
              </span>
            </Link>
          )}
          {view === "menu" && (
            <Link
              href="/service/purchases/new"
              className="add-product flex gap-1"
            >
              <span className="text-md px-2 flex items-center gap-2">
                <span className="roentgen--bag"></span>New Menu Product
              </span>
            </Link>
          )}
        </div>
      </div>
      {view === "menu" && (
        <>
          <div className="list-header flex items-center justify-between w-full">
            <h2 className="text-2xl font-medium">Menu</h2>
            <Link
              href="/service/products/new"
              className="add-product flex gap-1"
            >
              <span>+</span>
              <span className="text-md">Product</span>
            </Link>
          </div>
          {products.length === 0 ? (
            <p>No products found...</p>
          ) : (
            <div className="menu-products flex justify-between gap-8">
              <div className="flex flex-col gap-4">
                <section className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium">Lanche</h2>
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
                  <h2 className="text-lg font-medium">Refeicao</h2>
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
              <section className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">Bebidas</h2>
                <ul className="flex flex-col gap-4">
                  {bebidas.map((item) => (
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
          )}
        </>
      )}
    </div>
  );
}
