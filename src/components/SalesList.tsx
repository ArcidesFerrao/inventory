"use client";

import { createSale } from "@/app/actions/sales";
import React, { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type ProductsProps = {
  initialProducts: Product[];
  userId: string;
};

export const SalesList = ({ initialProducts, userId }: ProductsProps) => {
  const [products, setProducts] = useState(
    initialProducts.map((p) => ({ ...p, quantity: 0 }))
  );

  const handleCompleteSale = async () => {
    const saleItems = products.filter((product) => product.quantity > 0);
    if (saleItems.length === 0) return;

    const result = await createSale(saleItems, userId);

    console.log("Sale completed:", result);
  };

  const handleIncrement = (id: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const handleDecrement = (id: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id && product.quantity > 0
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const totalItems = products.reduce((sum, product) => {
    return sum + product.quantity;
  }, 0);
  const totalPrice = products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  return (
    <>
      <div className="products-selection flex flex-col gap-4 w-full">
        <h2 className="text-xl font-medium">Products</h2>
        <ul className="">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center py-2"
            >
              <h3>{product.name}</h3>

              <div className="flex gap-2 items-center w-6/12">
                <div className="amount-btn flex gap-2 items-center px-2 py-1">
                  <button onClick={() => handleDecrement(product.id)}>-</button>
                  <span className="w-12 text-center">{product.quantity}</span>
                  <button onClick={() => handleIncrement(product.id)}>+</button>
                </div>
                <span>
                  <p>{(product.price * product.quantity).toFixed(2)} MZN</p>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="order-summary flex flex-col gap-4 w-1/3">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <div className="flex justify-between">
          <h3>Items:</h3>
          <p>{totalItems}</p>
        </div>
        <div className="flex justify-between">
          <h3>Total:</h3>
          <p>{totalPrice} MZN</p>
        </div>
        <button
          onClick={() => handleCompleteSale()}
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Complete Sale
        </button>
      </div>
    </>
  );
};
