import { SupplierDelivery } from "@/components/NewDelivery";
import { db } from "@/lib/db";
import Link from "next/link";
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
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  if (!supplierOrder) return <div>Order not found</div>;

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <div className="delivery-header flex justify-between w-full items-center">
        <div className="flex items-start">
          <span className="p-2">
            <span className="formkit--date"></span>
          </span>
          <div>
            <h2 className="text-2xl font-bold">Schedule New Delivery</h2>
            <p className="text-xs font-extralight">
              Order #{supplierOrder.order.id.slice(0, 8)}...
            </p>
          </div>
        </div>
        <Link className="px-4 py-1 rounded-sm" href={`/supply/orders/${id}`}>
          Cancel
        </Link>
      </div>
      <SupplierDelivery
        order={supplierOrder.order}
        items={supplierOrder.items}
      />
    </div>
  );
}
