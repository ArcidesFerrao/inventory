// import { DeleteOrderButton } from "@/components/DeleteButton";
import { AcceptButton } from "@/components/ActionButton";
import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";

type Params = Promise<{ id: string }>;

export default async function OrderPage(props: { params: Params }) {
  const { id } = await props.params;

  const supplierOrder = await db.supplierOrder.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      order: {
        include: {
          Service: true,
          confirmedDeliveries: {
            include: {
              deliveryItems: {
                include: {
                  orderItem: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-5 items-start w-full">
      <div className="order-header flex justify-between w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">
            Order #{supplierOrder?.id.slice(0, 5)}...
          </h2>
          <p className="text-xs font-extralight">
            Created {supplierOrder?.order.createdAt.toDateString()}
          </p>
        </div>
        <button disabled className="text-sm font-light text-center max-h-fit">
          {supplierOrder?.status}
        </button>
      </div>
      <div className="order-details flex justify-between gap-4 w-full p-4">
        <div className="info-details flex flex-col gap-4">
          <div className="flex gap-2">
            <span className="p-1">
              <span className="formkit--date"></span>
            </span>
            <div>
              <p className="text-md font-extralight">Requested Start</p>
              <h4 className="text-md py-1 whitespace-nowrap font-semibold">
                {supplierOrder?.order.requestedStartDate.toDateString()}
              </h4>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="p-1">
              <span className="formkit--date"></span>
            </span>
            <div>
              <p className="text-md font-extralight">Requested End</p>
              <h4 className="text-md py-1 whitespace-nowrap font-semibold">
                {supplierOrder?.order.requestedEndDate.toDateString()}
              </h4>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="p-1">
              <span className="fluent-mdl2--table-total-row"></span>
            </span>
            <div>
              <p className="text-md font-extralight">Total Amount</p>
              <h4 className="text-md py-1 whitespace-nowrap font-semibold">
                MZN {supplierOrder?.order.total.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>
        {supplierOrder?.status === "PENDING" && (
          <div className="order-buttons flex flex-col gap-4 justify-end">
            <AcceptButton
              supplierOrderId={supplierOrder?.id || ""}
              orderId={supplierOrder?.orderId || ""}
            />
            <button className="deny-btn">Deny</button>
          </div>
        )}

        {supplierOrder?.status === "APPROVED" && (
          <div className="order-buttons flex flex-col justify-end">
            <Link
              className="delivery-btn bg-blue-600"
              href={`/supply/orders/${supplierOrder?.id}/deliveries/new`}
            >
              Delivery
            </Link>
          </div>
        )}
      </div>
      <div className="order-items flex flex-col gap-2 w-full">
        <h2 className="text-xl font-semibold">
          Ordered Items by {supplierOrder?.order.Service?.businessName}
        </h2>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Ordered</th>
              <th>Delivered</th>
              <th>Remaining</th>
              <th>Price (MZN)</th>
              <th>Total (MZN)</th>
            </tr>
          </thead>
          <tbody>
            {supplierOrder?.items.map((item) => (
              <tr key={item.id}>
                <td>{item.product.name}</td>
                <td>{item.orderedQty}</td>
                <td>{item.deliveredQty}</td>
                <td>{item.orderedQty - item.deliveredQty}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{(item.price * item.orderedQty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {supplierOrder?.order.confirmedDeliveries &&
        supplierOrder.order.confirmedDeliveries.length > 0 && (
          <div className="deliveries-details flex flex-col gap-2 w-full">
            <h2 className="text-xl font-semibold">Deliveries</h2>
            {supplierOrder.order.confirmedDeliveries.map((d) => (
              <div key={d.id} className="p-4 delivery-details">
                <div className="delivery-header flex justify-between">
                  <div className="delivery-info">
                    <h3 className="font-medium">Delivery #{d.id}</h3>
                    <p className="text-sm font-extralight">
                      Scheduled Date: {d.scheduledAt.toDateString()}
                    </p>
                    <p className="text-sm font-extralight">
                      Scheduled Time: {d.scheduledAt.toLocaleTimeString()}
                    </p>
                    {d.status === "DELIVERED" && (
                      <p>
                        Delivered Time: {d.deliveredAt?.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  <button
                    disabled
                    className="text-sm font-light text-center max-h-fit"
                  >
                    {d.status}
                  </button>
                </div>
                <div className="delivery-items px-4 py-2">
                  <h4 className="font-medium">Items:</h4>
                  <ul className="flex flex-col gap-2">
                    {d.deliveryItems.map((item) => (
                      <li key={item.id}>
                        <p className="text-sm font-extralight">
                          - {item.orderItem.product.name} - Qty: {item.quantity}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
