"use client";

import { createPurchase } from "@/app/actions/purchase";
import { PurchasesProps } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export const PurchasesList = ({ initialProducts, userId }: PurchasesProps) => {
  const router = useRouter();
  const [products, setProducts] = useState(
    initialProducts.map((p) => ({ ...p, quantity: 0 }))
  );

  const handleCompleteSale = async () => {
    console.log("creating purchase");
    const purchaseItems = products.filter((product) => product.quantity > 0);
    if (purchaseItems.length === 0) return;

    const result = await createPurchase(purchaseItems, userId);
    if (result.success) {
      toast.success("Purchase Completed");
      setTimeout(() => {
        router.push("/service/purchases");
      }, 500);
    }

    console.log("Purchase completed:", result);
  };

  const handleIncrement = (id: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, stock: product.stock + 1 } : product
      )
    );
  };

  const handleDecrement = (id: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id && product.stock > 0
          ? { ...product, stock: product.stock - 1 }
          : product
      )
    );
  };

  const totalItems = products.reduce((sum, product) => {
    return sum + product.stock;
  }, 0);
  const totalPrice = products.reduce((sum, product) => {
    return sum + product.price * product.stock;
  }, 0);

  return (
    <>
      <div className="products-selection flex flex-col gap-4 w-full">
        <ul className="p-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center py-2"
            >
              <h3>{product.name}</h3>

              <div className="flex gap-2 items-center max-w-6/12">
                <div className="amount-btn flex gap-2 items-center px-2 py-1">
                  <button onClick={() => handleDecrement(product.id)}>-</button>
                  <span className="w-12 text-center">{product.stock}</span>
                  <button onClick={() => handleIncrement(product.id)}>+</button>
                </div>
                <span className="min-w-32">
                  <p>{(product.price * product.stock).toFixed(2)} MZN</p>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="order-summary flex flex-col gap-4 w-1/3">
        <h2 className="text-xl font-medium">Purchase Summary</h2>
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
          className="border px-4 py-2 rounded mt-4"
        >
          Complete
        </button>
      </div>
    </>
  );
};
