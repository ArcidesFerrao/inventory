"use client";

import { Order, SupplierOrder, SupplierProduct } from "@prisma/client";
import { useState } from "react";

export const SupplierDelivery = ({
  supplierOrder,
  order,
  items,
}: {
  supplierOrder: SupplierOrder;
  order: Order;
  items: {
    id: string;
    price: number;
    supplierOrderId: string;
    supplierProductId: string;
    orderedQty: number;
    deliveredQty: number;
    supplierProduct: SupplierProduct;
  }[];
}) => {
  const [deliveryDate, setDeliveryDate] = useState();
  const [deliveryTime, setDeliveryTime] = useState();
  const [quantity, setQuantity] = useState<number>(0);
  return (
    <div className="schedule flex flex-col gap-5  w-full">
      <h3>Schedule New Delivery</h3>
      <div className="schedule-info">
        <h4>Requested Delivery Window:</h4>
        <div className="flex gap-2">
          <p>{order.requestedStartDate.toLocaleDateString()}</p>
          <p>-</p>
          <p>{order.requestedEndDate.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="delivery-schedule">
        <div className="flex flex-col">
          <h4>Delivery Date *</h4>
          <input
            type="date"
            name="deliveryDate"
            id="deliveryDate"
            value={deliveryDate}
          />
        </div>
        <div className="flex flex-col">
          <h4>Delivery Time *</h4>
          <input
            type="time"
            name="deliveryTime"
            id="deliveryTime"
            value={deliveryTime}
            // onChange={(e) => setDeliveryTime(e.target.value)}
          />
        </div>
        <ul>
          {items.map((i) => (
            <li key={i.id}>
              <div>
                <h3>{i.supplierProduct.name}</h3>
                <p>Quantities: {i.orderedQty} units</p>
              </div>
              <input
                type="number"
                max={i.orderedQty}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </li>
          ))}
        </ul>
        <div className="flex flex-col">
          <h4>Delivery Notes</h4>
          <textarea name="notes" id="notes" />
        </div>
      </div>
    </div>
  );
};
