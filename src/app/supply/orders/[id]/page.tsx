// import { DeleteOrderButton } from "@/components/DeleteButton";
import { AcceptButton, DenyButton } from "@/components/ActionButton";
import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";

type Params = Promise<{ id: string }>;

export default async function OrderPage(props: { params: Params }) {
  const { id } = await props.params;

  const order = await db.order.findUnique({
    where: {
      id,
    },
    include: {
      orderItems: {
        include: {
          stockItem: true,
        },
      },
      Service: true,
      delivery: {
        include: {
          deliveryItems: {
            include: {
              orderItem: {
                include: {
                  stockItem: true,
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
            Order #{order?.id.slice(0, 5)}...
          </h2>
          <p className="text-xs font-extralight">
            Created {order?.timestamp.toDateString()}
          </p>
        </div>
        <Link href="/supply/orders">
          <span className="ep--back"></span>
        </Link>
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
                {order?.requestedStartDate.toDateString()}
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
                {order?.requestedEndDate.toDateString()}
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
                MZN {order?.total.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <button
            disabled
            className="text-sm font-light text-center px-4 py-2 rounded-sm "
          >
            {order?.status}
          </button>
          {order?.status === "DRAFT" && (
            <div className="order-buttons flex flex-col gap-4">
              <AcceptButton orderId={order?.id || ""} />
              <DenyButton orderId={order?.id || ""} />
            </div>
          )}

          {order?.status === "SUBMITTED" && (
            <div className="order-buttons flex flex-col ">
              <Link
                className="delivery-btn bg-blue-600 text-center"
                href={`/supply/orders/${order?.id}/deliveries/new`}
              >
                Delivery
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="order-items flex flex-col gap-2 w-full">
        <h2 className="text-xl font-semibold">
          Ordered Items by {order?.Service?.businessName}
        </h2>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Ordered</th>
              <th className="order-items-data">Delivered</th>
              <th className="order-items-data">Remaining</th>
              <th>Price (MZN)</th>
              <th>Total (MZN)</th>
            </tr>
          </thead>
          <tbody>
            {order?.orderItems.map((i) => (
              <tr key={i.id}>
                <td>{i.stockItem.name}</td>
                <td>{i.orderedQty}</td>
                <td className="order-items-data">{i.deliveredQty}</td>
                <td className="order-items-data">
                  {i.orderedQty - i.deliveredQty}
                </td>
                <td>{i.price.toFixed(2)}</td>
                <td>{(i.price * i.orderedQty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {order?.delivery && (
        <div className="deliveries-details flex flex-col gap-2 w-full">
          <h2 className="text-xl font-semibold">Deliveries</h2>
          <div className="p-4 delivery-details">
            <div className="delivery-header flex justify-between">
              <div className="delivery-info">
                <Link href={`/supply/orders/delivery/${order?.delivery.id}`}>
                  <h3 className="font-medium">
                    Delivery #{order?.delivery.id.slice(0, 5)}...
                  </h3>
                </Link>
                <p className="text-sm font-extralight">
                  Scheduled Date: {order?.delivery.scheduledAt.toDateString()}
                </p>
                <p className="text-sm font-extralight">
                  Scheduled Time:{" "}
                  {order?.delivery.scheduledAt.toLocaleTimeString()}
                </p>
                {order?.delivery.status === "COMPLETED" && (
                  <p>
                    Delivered Time:{" "}
                    {order?.delivery.deliveredAt?.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <button
                disabled
                className="text-sm font-light text-center max-h-fit"
              >
                {order?.delivery.status}
              </button>
            </div>
            <div className="delivery-items px-4 py-2">
              <h4 className="font-medium">Items:</h4>
              <ul className="flex flex-col gap-2">
                {order?.delivery.deliveryItems.map((item) => (
                  <li key={item.id}>
                    <p className="text-sm font-extralight">
                      - {item.orderItem.stockItem.name} - Qty: {item.quantity}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
