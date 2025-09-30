"use client";

import { createPurchase } from "@/app/actions/purchase";
import { PurchasesProps } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export const PurchasesList = ({
  initialProducts,
  serviceId,
}: PurchasesProps) => {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  const handleCompleteSale = async () => {
    setLoading(true);
    console.log("creating purchase");
    const purchaseItems = products.filter((product) => product.quantity > 0);
    if (purchaseItems.length === 0) return;

    const result = await createPurchase(purchaseItems, serviceId);
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
    return sum + (product.price ?? 0) * product.quantity;
  }, 0);

  return (
    <>
      <div className="products-selection flex flex-col gap-4 w-full">
        <div className="items p-4">
          <h2 className="text-xl font-medium">Items</h2>
          <ul>
            {products.map((product) => (
              <li
                key={product.id}
                className="flex justify-between items-center py-2"
              >
                <h3>{product.name}</h3>

                <div className="flex gap-2 items-center max-w-6/12">
                  <div className="amount-btn flex gap-4 items-center px-2 ">
                    <button onClick={() => handleDecrement(product.id)}>
                      -
                    </button>
                    <span className="w-12 text-center">{product.quantity}</span>
                    <button onClick={() => handleIncrement(product.id)}>
                      +
                    </button>
                  </div>
                  <span className="min-w-32">
                    <p>
                      {((product.price ?? 0) * product.quantity).toFixed(2)} MZN
                    </p>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
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
          disabled={loading}
          className="complete-btn border px-4 py-2 rounded mt-4"
        >
          {loading ? "..." : "Complete"}
        </button>
      </div>
    </>
  );
};
