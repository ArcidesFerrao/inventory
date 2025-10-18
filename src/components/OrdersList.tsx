"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrder } from "@/app/actions/orders";
import toast from "react-hot-toast";
import { SupplierProductsWithUnit } from "@/types/types";

export const OrdersList = ({
  initialProducts,
}: {
  initialProducts: SupplierProductsWithUnit[];
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const [products, setProducts] = useState(
    initialProducts.map((p) => ({ ...p, quantity: 0 }))
  );

  const handleCompleteOrder = async () => {
    console.log("creating order");
    setLoading(true);
    if (startDate === "" || endDate === "") {
      setError("Start and End dates required");
    } else {
      setError(null);
    }
    const orderItems = products.filter((product) => product.quantity > 0);

    if (orderItems.length === 0) {
      setListError("No order items");
    } else {
      setError(null);
    }

    const groupedBySupplier = orderItems.reduce((acc, item) => {
      if (!acc[item.supplierId]) acc[item.supplierId] = [];

      acc[item.supplierId].push({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price || 0,
      });

      return acc;
    }, {} as Record<string, { productId: string; name: string; price: number; quantity: number }[]>);

    const supplierOrdersList = Object.entries(groupedBySupplier).map(
      ([supplierId, items]) => ({
        supplierId,
        items,
      })
    );

    const result = await createOrder(supplierOrdersList, startDate, endDate);

    if (result.error || !result.success) {
      toast.error(result.error ?? "Order not processed successfully");
      setLoading(false);
    }

    if (result.success) {
      toast.success("Order Placed Successfuly");
      setTimeout(() => {
        setLoading(false);
        router.push("/service/purchases");
      }, 300);
    }

    console.log(result.error ? result.error : `Order placed: ${result.order}`);
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
    <div className="sales-content flex justify-between gap-4">
      <div className="products-selection flex flex-col gap-4 w-full p-4">
        <ul>
          {products.map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center py-2"
            >
              <div>
                <h3>{product.name}</h3>
              </div>

              <div className="flex gap-4 items-center max-w-6/12">
                <div className="amount-btn flex gap-2 items-center px-2">
                  <button onClick={() => handleDecrement(product.id)}>-</button>
                  <span className="w-12 text-center text-sm">
                    {product.quantity}
                  </span>
                  <button onClick={() => handleIncrement(product.id)}>+</button>
                </div>
                <span className="min-w-28">
                  <p>
                    {((product.price ?? 0) * product.quantity).toFixed(2)} MZN
                  </p>
                </span>
              </div>
            </li>
          ))}
        </ul>
        {listError && (
          <p className="font-extralight text-sm text-red-400">{listError}</p>
        )}
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
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h3>Start Date</h3>
            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate((e.target as HTMLInputElement).value)
              }
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h3>End Date</h3>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate((e.target as HTMLInputElement).value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {error && (
            <p className="font-extralight text-sm text-red-400">{error}</p>
          )}
          <button
            onClick={() => handleCompleteOrder()}
            disabled={loading}
            className="complete-btn border px-4 py-2 rounded mt-4"
          >
            {loading ? "..." : "Order"}
          </button>
        </div>
      </div>
    </div>
  );
};
