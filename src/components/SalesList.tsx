"use client";

import { createSale } from "@/app/actions/sales";
import { ProductsProps } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export const SalesList = ({ initialProducts, serviceId }: ProductsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState(
    initialProducts.map((p) => ({ ...p, quantity: 0 }))
  );

  const handleCompleteSale = async () => {
    console.log("creating sale");
    setLoading(true);
    const saleItems = products.filter((product) => product.quantity > 0);

    if (saleItems.length === 0) return;

    const result = await createSale(saleItems, serviceId);

    if (result.success) {
      toast.success("Sale Completed");
      setTimeout(() => {
        setLoading(false);
        router.push("/service/sales");
      }, 500);
    }

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
    return sum + (product.price ?? 0) * product.quantity;
  }, 0);

  return (
    <>
      <div className="products-selection flex flex-col gap-4 w-full p-4">
        <div className="flex flex-col">
          <h3 className="text-md font-medium underline">Refeição</h3>
          <ul>
            {products.map((product) => {
              if (product.Category?.name === "Refeicao")
                return (
                  <li
                    key={product.id}
                    className="flex justify-between items-center py-2"
                  >
                    <h3>{product.name}</h3>

                    <div className="flex gap-4 items-center max-w-6/12">
                      <div className="amount-btn flex gap-2 items-center px-2 py-1">
                        <button onClick={() => handleDecrement(product.id)}>
                          -
                        </button>
                        <span className="w-12 text-center">
                          {product.quantity}
                        </span>
                        <button onClick={() => handleIncrement(product.id)}>
                          +
                        </button>
                      </div>
                      <span className="min-w-28">
                        <p>
                          {((product.price ?? 0) * product.quantity).toFixed(2)}{" "}
                          MZN
                        </p>
                      </span>
                    </div>
                  </li>
                );
            })}
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="text-md font-medium underline">Lanches</h3>
          <ul>
            {products.map((product) => {
              if (product.Category?.name === "Lanche")
                return (
                  <li
                    key={product.id}
                    className="flex justify-between items-center py-2"
                  >
                    <h3>{product.name}</h3>

                    <div className="flex gap-4 items-center max-w-6/12">
                      <div className="amount-btn flex gap-2 items-center px-2 py-1">
                        <button onClick={() => handleDecrement(product.id)}>
                          -
                        </button>
                        <span className="w-12 text-center">
                          {product.quantity}
                        </span>
                        <button onClick={() => handleIncrement(product.id)}>
                          +
                        </button>
                      </div>
                      <span className="min-w-28">
                        <p>
                          {((product.price ?? 0) * product.quantity).toFixed(2)}{" "}
                          MZN
                        </p>
                      </span>
                    </div>
                  </li>
                );
            })}
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="text-md font-medium underline">Bebidas</h3>
          <ul>
            {products.map((product) => {
              if (product.Category?.name === "Bebidas")
                return (
                  <li
                    key={product.id}
                    className="flex justify-between items-center py-2"
                  >
                    <h3>{product.name}</h3>

                    <div className="flex gap-4 items-center max-w-6/12">
                      <div className="amount-btn flex gap-2 items-center px-2 py-1">
                        <button onClick={() => handleDecrement(product.id)}>
                          -
                        </button>
                        <span className="w-12 text-center">
                          {product.quantity}
                        </span>
                        <button onClick={() => handleIncrement(product.id)}>
                          +
                        </button>
                      </div>
                      <span className="min-w-28">
                        <p>
                          {((product.price ?? 0) * product.quantity).toFixed(2)}{" "}
                          MZN
                        </p>
                      </span>
                    </div>
                  </li>
                );
            })}
          </ul>
        </div>
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
          disabled={loading}
          className="complete-btn border px-4 py-2 rounded mt-4"
        >
          {loading ? "..." : "Complete Sale"}
        </button>
      </div>
    </>
  );
};
