"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrder } from "@/lib/actions/orders";
import toast from "react-hot-toast";
import { SupplierStockItems } from "@/types/types";

export const OrdersList = ({
  initialItems,
  serviceId,
  supplierId,
}: {
  initialItems: SupplierStockItems[];
  serviceId: string;
  supplierId: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const [items, setItems] = useState(
    initialItems.map((p) => ({ ...p, quantity: 0 })),
  );

  const handleCompleteOrder = async () => {
    // console.log("creating order");
    setLoading(true);
    if (startDate === "" || endDate === "") {
      setError("Start and End dates required");
    } else {
      setError(null);
    }
    const orderItems = items.filter((item) => item.quantity > 0);

    if (orderItems.length === 0) {
      setListError("No order items");
    } else {
      setError(null);
    }

    const result = await createOrder(
      orderItems,
      serviceId,
      supplierId,
      startDate,
      endDate,
    );

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

    // console.log(result.error ? result.error : `Order placed: ${result.order}`);
  };

  const handleIncrement = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

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
    <div className="sales-content flex justify-between gap-4">
      <div className="products-selection flex flex-col gap-4 w-full p-4">
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center py-2"
            >
              <div>
                <h3>{item.name}</h3>
              </div>

              <div className="amount-input flex gap-4 items-center max-w-6/12">
                <div className="amount-btn flex gap-2 items-center px-2">
                  <button onClick={() => handleDecrement(item.id)}>-</button>
                  <span className="w-12 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button onClick={() => handleIncrement(item.id)}>+</button>
                </div>
                <span className="min-w-28">
                  <p>{((item.price ?? 0) * item.quantity).toFixed(2)} MZN</p>
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
