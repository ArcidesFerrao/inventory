import { db } from "@/lib/db";
import React, { useState } from "react";

type Params = Promise<{ id: string }>;

export default async function NewDeliveryPage(props: { params: Params }) {
  const { id } = await props.params;
  const order = await db.supplierOrder.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });
  if (!order) return <div>Order not found</div>;

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <div className="delivery-header flex flex-col">
        <div className="delivery-title px-4">
          <h1 className="text-xl font-semibold">Create Delivery</h1>
          <p>Order # ...</p>
        </div>
        <div className="data-section flex justify-between px-4">
          <div className="flex flex-col">
            <span>1</span>
            <p>Schedule</p>
          </div>
          <div className="flex flex-col">
            <span>2</span>
            <p>Items</p>
          </div>
          <div className="flex flex-col">
            <span>3</span>
            <p>Review</p>
          </div>
        </div>
      </div>
      <ScheduleDelivery />
      <div className="buttons-mng flex gap-4 w-full">
        <button className="bg-amber-50 p-4">Back</button>
        <button className="bg-blue-600 p-4">Continue</button>
        {/* <button className="bg-green-600 p-4">Schedule Delivery</button> */}
      </div>
    </div>
  );
}

export const ScheduleDelivery = () => {
  return (
    <div className="schedule flex flex-col">
      <div className="schedule-title">
        <span></span>
        <h3>Schedule Delivery</h3>
      </div>
      <div className="schedule-info">
        <h4>Requested Delivery Window:</h4>
        <p>2025-10-12</p>
      </div>
      <div className="delivery-schedule">
        <div className="flex flex-col">
          <h4>Delivery Date *</h4>
          <input type="date" name="deliveryDate" id="deliveryDate" />
        </div>
        <div className="flex flex-col">
          <h4>Delivery Time *</h4>
          <input type="time" name="deliveryTime" id="deliveryTime" />
        </div>
        <div className="flex flex-col">
          <h4>Delivery Notes</h4>
          <textarea name="notes" id="notes" />
        </div>
      </div>
    </div>
  );
};

export const ReviewDelivery = (
  items: {
    id: string;
    name: string;
    price: number;
    deliverQty: number;
  }[]
) => {
  return (
    <div className="flex flex-col gap-4">
      <h3>Review Delivery</h3>
      <div className="delivery-details-info">
        <div className="flex fap-2">
          <span></span>
          <h4>Delivery Schedule</h4>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p>Date:</p>
            <h4>Oct 6, 2025</h4>
          </div>
          <div className="flex justify-between">
            <p>Time:</p>
            <h4>14:30</h4>
          </div>
        </div>
      </div>
      <div className="delivery-items-list flex flex-col gap-4">
        <ul>
          {items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <div className="flex">
                <h4>{i.name}</h4>
              </div>
              <div className="flex flex-col">
                <p>{i.price}</p>
                <p>Delivered: {i.deliverQty}</p>
              </div>
            </li>
          ))}
        </ul>
        <div>
          <h4>Total</h4>
          <h3>MZN 00.00</h3>
        </div>
      </div>
      {/* <div className="delivery-proof">
        <div className="flex">
          <span></span>
          <h3>Proof of Delivery</h3>
        </div>
        <input type="text" />
      </div> */}
    </div>
  );
};
