"use client";

import { createPurchase } from "@/app/actions/purchase";
import { PurchasesProps } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export const PurchasesList = ({
  initialStockItems,
  serviceId,
}: PurchasesProps) => {
  const router = useRouter();
  const [items, setItems] = useState(initialStockItems);
  const [loading, setLoading] = useState(false);

  const handleCompleteSale = async () => {
    setLoading(true);
    console.log("creating purchase");
    const purchaseItems = items.filter(
      (item) => item.quantity > 0 && (item.price ?? 0) > 0
    );
    if (purchaseItems.length === 0) {
      toast.error("Add at least one item with a valid price.");
      setLoading(false);
      return;
    }
    const result = await createPurchase(purchaseItems, serviceId);

    if (result.message) {
      toast.error(result.message ?? "Purchase not processed successfully");
      setLoading(false);
    }
    if (result.success && !result.message) {
      toast.success("Purchase Completed");
      setTimeout(() => {
        router.push("/service/purchases");
      }, 500);
    }

    console.log("Purchase completed:", result);
  };

  const handleIncrement = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((stockItem) =>
        stockItem.id === id
          ? { ...stockItem, quantity: stockItem.quantity + 1 }
          : stockItem
      )
    );
  };

  const handleDecrement = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((stockItem) =>
        stockItem.id === id && stockItem.quantity > 0
          ? { ...stockItem, quantity: stockItem.quantity - 1 }
          : stockItem
      )
    );
  };

  const totalItems = items.reduce((sum, stockItem) => {
    return sum + stockItem.quantity;
  }, 0);
  const totalPrice = items.reduce((sum, stockItem) => {
    return sum + (stockItem.price ?? 0) * stockItem.quantity;
  }, 0);

  return (
    <>
      <div className="products-selection flex flex-col gap-4 w-full">
        <div className="items">
          <h2 className="text-xl font-medium  p-4">Items</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id} className=" flex justify-between px-4 py-2">
                <div className="flex flex-col justify-between gap-2">
                  <h3 className="font-semibold ">{item.stockItem.name}</h3>
                  <label
                    className="flex gap-2 text-sm items-center"
                    htmlFor="price"
                  >
                    Price:{" "}
                    <input
                      className="max-w-20 text-xs"
                      type="number"
                      value={item.price ?? ""}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((p) =>
                            p.id === item.id
                              ? { ...p, price: parseFloat(e.target.value) || 0 }
                              : p
                          )
                        )
                      }
                    />
                  </label>
                </div>
                <div className="flex flex-col gap-2 items-center text-sm">
                  <div className="amount-btn flex gap-4  px-2 ">
                    <button onClick={() => handleDecrement(item.id)}>-</button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <button onClick={() => handleIncrement(item.id)}>+</button>
                  </div>
                  <span className="self-end">
                    <p>{((item.price ?? 0) * item.quantity).toFixed(2)} MZN</p>
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
