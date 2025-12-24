"use client";

import { createSale } from "@/app/actions/sales";
import { SaleProductsProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const SalesList = ({ initialItems, serviceId }: SaleProductsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState(
    initialItems.map((p) => ({ ...p, quantity: 0 }))
  );

  const handleCompleteSale = async () => {
    setLoading(true);
    const saleItems = items.filter((item) => item.quantity > 0);
    const result = await createSale(saleItems, serviceId);

    if (saleItems.length === 0) {
      toast.error("Sale not processed successfully");
      setLoading(false);
    }

    if (result.success && !result.message) {
      toast.success("Sale Completed");
      setTimeout(() => {
        setLoading(false);
        router.push("/service/sales");
      }, 100);
    }

    if (!result.success) {
      toast.error(result.message as string);
      setLoading(false);
    }

    setLoading(false);
  };

  const handleIncrement = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const recipe = item.CatalogItems ?? [];

    if (recipe.length === 0) {
      if ((item.stock ?? 0) <= item.quantity) {
        toast.error(`Not enough stock of ${item.name}`);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      return;
    }

    for (const recipeItem of recipe) {
      // const stockItem = recipeItem.serviceStockItem.stockItem;
      // const totalNeed = (item.quantity + 1) * recipeItem.quantity;
      // const ingredientStock =
      //   recipeItem.serviceStockItem.stockItem?.stock ?? 0;
      const serviceStock = recipeItem.serviceStockItem;
      const totalAvailable = serviceStock?.stockQty ?? 0;
      const totalNeeded = (item.quantity + 1) * recipeItem.quantity;

      if (totalAvailable < totalNeeded) {
        toast.error(
          `Not enough ${
            recipeItem.serviceStockItem.stockItem.name ?? "ingredient"
          } to make another ${item.name}`
        );
        return;
      }
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // const handleIncrementSafe = (id: string) => {
  //   setItems((prevItems) => {
  //     return prevItems.map((item) => {
  //       if (item.id !== id) return item;
  //       const recipe = item.CatalogItems ?? [];

  //       if (recipe.length === 0) {
  //         if ((item.stock ?? 0) <= item.quantity) {
  //           toast.error(`Not enough stock of ${item.name}`);
  //           return item;
  //         }
  //         return { ...item, quantity: item.quantity + 1 };
  //       }

  //       for (const recipeItem of recipe) {
  // const stockItem = recipeItem.serviceStockItem.stockItem;
  // const totalNeed = (item.quantity + 1) * recipeItem.quantity;
  // const ingredientStock =
  //   recipeItem.serviceStockItem.stockItem?.stock ?? 0;
  //         const serviceStock = recipeItem.serviceStockItem;
  //         const totalAvailable = serviceStock?.stockQty ?? 0;
  //         const totalNeeded = (item.quantity + 1) * recipeItem.quantity;

  //         if (totalAvailable < totalNeeded) {
  //           toast.error(
  //             `Not enough ${
  //               recipeItem.serviceStockItem.stockItem.name ?? "ingredient"
  //             } to make another ${item.name}`
  //           );
  //           return item;
  //         }
  //       }
  //       return { ...item, quantity: item.quantity + 1 };
  //     });
  //   });
  // };

  const handleDecrement = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const totalItems = items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
  const totalPrice = items.reduce((sum, item) => {
    return sum + (item.price ?? 0) * item.quantity;
  }, 0);

  return (
    <>
      <div className="products-selection flex flex-col gap-4 w-full p-4">
        <div className="flex flex-col">
          <h3 className="text-md font-medium underline">List</h3>
          <ul>
            {items.map((item) => {
              return (
                <li key={item.id} className="flex justify-between items-center">
                  <h3>{item.name}</h3>

                  <div className="sales-amount flex gap-4 items-center max-w-6/12">
                    <div className="amount-btn flex gap-2 items-center px-2 py-1">
                      <button onClick={() => handleDecrement(item.id)}>
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button onClick={() => handleIncrement(item.id)}>
                        +
                      </button>
                    </div>
                    <span className="min-w-28">
                      <p>
                        {((item.price ?? 0) * item.quantity).toFixed(2)} MZN
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
