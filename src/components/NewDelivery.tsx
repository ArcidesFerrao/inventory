"use client";

import { createDelivery } from "@/app/actions/deliveries";
import { Order, SupplierProduct } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const SupplierDelivery = ({
  supplierOrderId,
  order,
  items,
}: {
  supplierOrderId: string;
  order: Order;
  items: {
    id: string;
    price: number;
    supplierOrderId: string;
    supplierProductId: string;
    orderedQty: number;
    deliveredQty: number;
    product: SupplierProduct;
  }[];
}) => {
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const [deliveredQty, setDeliveredQty] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleCreateDelivery = async () => {
    setLoading(true);
    if (!deliveryDate || !deliveryTime) {
      setError("Please set both date and time!");
      setLoading(false);
      return;
    }

    const deliveryData = {
      supplierOrderId,
      orderId: order.id,
      deliveryDate,
      deliveryTime,
      notes,
      items: Object.entries(deliveredQty).map(([itemId, qty]) => ({
        itemId,
        deliveredQty: qty,
      })),
    };

    const delivery = await createDelivery(deliveryData);

    if (delivery.success) {
      toast.success("Delivery scheduled successfully!");
      setTimeout(() => {
        setLoading(false);
        router.push("/supply/orders");
      }, 100);
    }
  };

  return (
    <div className="schedule flex flex-col gap-5  w-full">
      <div className="schedule-info">
        <h4 className="font-semibold">Requested Delivery Window:</h4>
        <div className="flex gap-2">
          <p>{order.requestedStartDate.toLocaleDateString()}</p>
          <p>-</p>
          <p>{order.requestedEndDate.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="delivery-schedule flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h4>Delivery Date *</h4>
          <input
            type="date"
            name="deliveryDate"
            id="deliveryDate"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h4>Delivery Time *</h4>
          <input
            type="time"
            name="deliveryTime"
            id="deliveryTime"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
          />
        </div>
        <ul className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Delivery Items</h3>
          {items.map((i) => (
            <li key={i.id} className="delivery-item flex justify-between ">
              <div>
                <h3>{i.product.name}</h3>
                <p className="font-light text-sm">
                  Quantities: {i.orderedQty} units
                </p>
              </div>
              <input
                type="number"
                max={i.orderedQty}
                min={0}
                value={deliveredQty[i.id] ?? ""}
                onChange={(e) =>
                  setDeliveredQty((prev) => ({
                    ...prev,
                    [i.id]: Math.min(Number(e.target.value), i.orderedQty),
                  }))
                }
              />
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          <h4>Delivery Notes</h4>
          <textarea
            name="notes"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="text-red-400">*{error}*</p>}
      <button
        onClick={handleCreateDelivery}
        className="schedule-button py-2"
        disabled={loading}
      >
        {loading ? "..." : "Schedule Delivery"}
      </button>
    </div>
  );
};
