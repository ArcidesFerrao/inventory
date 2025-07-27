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
    <section>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="products-list">
          <h2>Products List</h2>
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
