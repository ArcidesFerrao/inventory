"use client";

import { createNewDelivery } from "@/lib/actions/deliveries";
import { Order, OrderItem, StockItem } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export const SupplierDelivery = ({
  order,
  items,
}: {
  order: Order;
  items: (OrderItem & {
    stockItem: StockItem;
  })[];
}) => {
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const t = useTranslations("Common");
  const dt = useTranslations("Delivery");
  const rt = useTranslations("Responses");

  const handleCreateDelivery = async () => {
    setLoading(true);
    if (!deliveryDate || !deliveryTime) {
      setError(rt("setDateTime"));
      setLoading(false);
      return;
    }

    const deliveryData = {
      orderId: order.id,
      deliveryDate,
      deliveryTime,
      notes,
      items,
    };

    const delivery = await createNewDelivery(deliveryData);

    if (delivery.success) {
      toast.success(rt("scheduleDeliverySuccess"));
      setTimeout(() => {
        setLoading(false);
        router.push("/supply/orders");
      }, 100);
    }

    if (delivery.error) {
      setError(delivery.error);
      setLoading(false);
      return;
    }
  };

  return (
    <div className="schedule flex flex-col gap-5  w-full">
      <div className="schedule-info">
        <h4 className="font-semibold">{dt("requestedWindow")}:</h4>
        <div className="flex gap-2">
          <p>{order.requestedStartDate.toLocaleDateString()}</p>
          <p>-</p>
          <p>{order.requestedEndDate.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="delivery-schedule flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h4>{dt("deliveryDate")}*</h4>
          <input
            type="date"
            name="deliveryDate"
            id="deliveryDate"
            value={deliveryDate}
            min={new Date(order.requestedStartDate).toISOString().split("T")[0]}
            max={new Date(order.requestedEndDate).toISOString().split("T")[0]}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h4>{dt("deliveryTime")}*</h4>
          <input
            type="time"
            name="deliveryTime"
            id="deliveryTime"
            min="09:00"
            max="16:00"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
          />
        </div>
        <ul className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{dt("deliveryItems")}</h3>
          {items.map((i) => (
            <li key={i.id} className="delivery-item flex justify-between ">
              <div>
                <h3>{i.stockItem.name}</h3>
                <p className="font-light text-sm">
                  {t("quantity")}: {i.orderedQty} {t("units")}
                </p>
              </div>
              <p>{dt("fullDelivery")}</p>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          <h4>{dt("deliveryNotes")}</h4>
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
        {loading ? "..." : dt("scheduleDelivery")}
      </button>
    </div>
  );
};
