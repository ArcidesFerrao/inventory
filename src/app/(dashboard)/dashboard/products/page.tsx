"use client";

import { ListItem } from "@/components/List";
import React, { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/products`);
        const { data } = await res.json();

        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <section className="flex justify-center">
      {loading ? (
        <span className="eos-icons--three-dots-loading"></span>
      ) : (
        <div className="products-list flex flex-col gap-4">
          <h2 className="text-2xl font-medium">Products List</h2>
          <ul>
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
      )}
    </section>
  );
}
