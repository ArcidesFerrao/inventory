import { NewDelivery } from "@/components/NewDelivery";
import { db } from "@/lib/db";
import React from "react";

type Params = Promise<{ id: string }>;

export default async function NewDeliveryPage(props: { params: Params }) {
  const { id } = await props.params;
  const supplierOrder = await db.supplierOrder.findUnique({
    where: {
      id,
    },
    include: {
      order: true,
      items: true,
    },
  });
  if (!supplierOrder) return <div>Order not found</div>;

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <div className="delivery-header flex flex-col self-start px-4">
        <h1 className="text-xl font-semibold">Create Delivery</h1>
        <p>Order #{supplierOrder.order.id.slice(0, 5)}...</p>
      </div>
      <NewDelivery
        order={supplierOrder.order}
        supplierOrder={supplierOrder}
        items={supplierOrder.items}
      />
    </div>
  );
}
