"use client";

import { useState } from "react";

export const ItemsDeliveryComponent = (items: {
  items: {
    id: string;
    name: string;
    price: number;
    orderedQty: number;
    deliveredQty: number;
  }[];
}) => {
  const [deliverQty, setDeliverQty] = useState<number>(0);
  const orderItems = items;
  if (!orderItems) return <p>Items not found!</p>;

  return (
    <div className="items-delivery">
      <div className="items-title">
        <span></span>
        <h3>Select Items for Delivery</h3>
      </div>
      <ul>
        {orderItems.items.map((i) => (
          <li key={i.id}>
            <div className="flex justify-between">
              <h4>{i.name}</h4>
              <p>{i.price}</p>
            </div>
            <div className="flex">
              <p>Ordered: {i.orderedQty}</p>
              <p>Delivered: {i.deliveredQty}</p>
              <p>Remaining: {i.orderedQty - i.deliveredQty}</p>
            </div>
            <div className="flex">
              <h4>Deliver Quantity</h4>
              <div>
                <span>-</span>
                <input
                  type="number"
                  value={deliverQty}
                  onChange={(e) => {
                    setDeliverQty(Number(e.target.value));
                  }}
                />
                <span>+</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="total-amount">
        <h3>Delivery Total:</h3>
        <h4>MZN 00.00</h4>
      </div>
    </div>
  );
};
