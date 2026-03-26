"use client";

import { createSale } from "@/lib/actions/sales";
import { SaleProductsProps } from "@/types/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const SalesList = ({ initialItems, serviceId }: SaleProductsProps) => {
  const router = useRouter();
  const t = useTranslations("Common");
  const st = useTranslations("Sales");

  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState(
    initialItems.map((p) => ({ ...p, quantity: 0 })),
  );

  const handleCompleteSale = async () => {
    setLoading(true);

    const saleItems = items.filter((item) => item.quantity > 0);
    if (saleItems.length === 0) {
      toast.error(st("processSaleSuccess"));
      setLoading(false);
    }

    const result = await createSale(saleItems, serviceId);

    if (result.success && !result.message) {
      toast.success(st("saleCompleted"));
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
        toast.error(`${t("notEnoughStock")} ${item.name}`);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
      return;
    }

    for (const recipeItem of recipe) {
      // const stockItem = recipeItem.serviceStockItem.stockItem;
      // const totalNeed = (item.quantity + 1) * recipeItem.quantity;
      // const ingredientStock =
      //   recipeItem.serviceStockItem.stockItem?.stock ?? 0;
      const serviceStock = recipeItem.serviceStockItem;
      const totalStock = Number(serviceStock.stock);
      const totalAvailable = serviceStock?.stockQty ?? 0;
      const totalStockNeeded = (item.quantity + 1) * recipeItem.quantity;
      const totalNeeded =
        (item.quantity + 1) * recipeItem.quantity * item.unitQty;
      // console.log(totalStock);
      // console.log(totalAvailable);
      // console.log(totalStockNeeded);
      // console.log(totalNeeded);
      // console.log(recipeItem.quantity);

      if (recipeItem.usageType === "UNIT") {
        if (totalStock < totalStockNeeded) {
          toast.error(
            `${t("notEnough")} ${
              recipeItem.serviceStockItem.stockItem.name ?? t("ingredient")
            } `,
          );
          return;
        }
      } else {
        if (totalAvailable < totalNeeded) {
          toast.error(
            `${t("notEnough")} ${
              recipeItem.serviceStockItem.stockItem.name ?? t("ingredient")
            }`,
          );
          return;
        }
      }
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
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
          : item,
      ),
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
          <h3 className="text-md font-medium underline py-2">{t("list")}</h3>
          <ul>
            {items.map((item) => {
              return (
                <li
                  key={item.id}
                  className={`${item.quantity === 0 ? "" : "product-selected"} flex justify-between items-center`}
                >
                  <div className="flex flex-col">
                    <h3>{item.name}</h3>
                    <p>{(item.price ?? 0).toFixed(2)} MZN</p>
                  </div>

                  <div className="sales-amount flex gap-2 items-center max-w-6/12">
                    <div className="amount-btn flex items-center min-w-fit">
                      <button
                        className="px-3 py-1"
                        onClick={() => handleDecrement(item.id)}
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        className="px-3 py-1"
                        onClick={() => handleIncrement(item.id)}
                      >
                        +
                      </button>
                    </div>
                    <span className="min-w-20 text-right">
                      <p>
                        {item.quantity === 0
                          ? "—"
                          : `${((item.price ?? 0) * item.quantity).toFixed(2)} MZN`}
                      </p>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="order-summary flex flex-col gap-4 w-96">
        <h2 className="text-lg font-medium">{st("orderSummary")}</h2>
        {totalItems > 0}
        <div className="flex justify-between">
          <h3>{t("items")}:</h3>
          <p>{totalItems}</p>
        </div>
        <div className="flex justify-between">
          <h3>Total:</h3>
          <p>{totalPrice} MZN</p>
        </div>
        <button
          onClick={() => handleCompleteSale()}
          disabled={loading || totalItems === 0}
          className="complete-btn border px-4 py-2 rounded mt-4"
        >
          {loading ? "..." : st("completeSale")}
        </button>
      </div>
    </>
  );
};
