import { RateButtons } from "@/components/ActionButton";
import { ConfirmDeliveryButton } from "@/components/CompleteDeliveryButton";
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

      supplierOrders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
          supplier: true,
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
            Created {order?.createdAt.toDateString()}
          </p>
        </div>
        <Link href="/service/purchases">
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
          {order?.status === "DELIVERED" ||
            (order?.status === "IN_DELIVERY" && (
              <ConfirmDeliveryButton
                deliveryId={order.confirmedDeliveries[0]?.id || ""}
                orderId={order.id}
                supplierOrderId={order.supplierOrders[0]?.id || ""}
                serviceId={order.serviceId || ""}
                status={order.confirmedDeliveries[0]?.status || ""}
                role="SERVICE"
              />
            ))}
        </div>
      </div>
      <div className="order-items flex flex-col gap-2 w-full">
        <h2 className="text-xl font-semibold">
          Supplier {order?.supplierOrders?.[0].supplier.name}
        </h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order?.supplierOrders?.[0].items.map((i) => (
              <tr key={i.id}>
                <td>{i.product.name}</td>
                <td>{i.orderedQty}</td>
                <td>MZN {i.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {order?.confirmedDeliveries && order.confirmedDeliveries.length > 0 && (
        <div className="deliveries-details flex flex-col gap-2 w-full">
          {order.confirmedDeliveries.map((d) => (
            <div
              key={d.id}
              className="p-4 flex justify-between delivery-details"
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Delivery #{d.id.slice(0, 5)}...</h3>
                <div className="delivery-info">
                  <p className="text-sm font-extralight">
                    Scheduled Date: {d.scheduledAt.toDateString()}
                  </p>
                  <p className="text-sm font-extralight">
                    Scheduled Time:{" "}
                    {d.scheduledAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
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
              <div className="delivery-settings flex flex-col justify-between">
                <div className="delivery-status flex flex-col gap-1">
                  <button
                    disabled
                    className="text-sm font-light text-center max-h-fit"
                  >
                    {d.status}
                  </button>
                  {d.status === "COMPLETED" && (
                    <p className="text-xs font-light ">
                      Delivered Time:{" "}
                      {d.deliveredAt?.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  )}
                </div>
                {d.status === "COMPLETED" && (
                  <div>
                    {d.rating !== null ? (
                      <div className="delivery-rating self-end">
                        <div className="rate-buttons flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={
                                star <= Number(d.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="delivery-rating">
                        <p>Rate this delivery:</p>
                        <RateButtons deliveryId={d.id} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {order?.confirmedDeliveries.length === 0 && <p>No deliveries yet...</p>}
    </div>
  );
}
