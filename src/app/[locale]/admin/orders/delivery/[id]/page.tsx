import { ConfirmDeliveryButton } from "@/components/CompleteDeliveryButton";
import { db } from "@/lib/db";
import Link from "next/link";

type Params = Promise<{ id: string; locale: string }>;

export default async function AdminDeliveryPage(props: { params: Params }) {
  const { id } = await props.params;
  const { locale } = await props.params;

  const delivery = await db.delivery.findUnique({
    where: {
      id,
    },
    include: {
      order: {
        include: {
          Service: true,
        },
      },
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
  });

  return (
    <div className="bg-gray-950 p-4 rounded-md flex flex-col gap-5 w-full">
      <div className="order-header flex justify-between w-full">
        <h2 className="text-2xl font-semibold">Delivery Details</h2>
        <Link href={`/${locale}/admin/orders`}>
          <span className="ep--back"></span>
        </Link>
      </div>
      <div className="delivery-info flex flex-col gap-4 w-full">
        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-extralight">Delivery ID</p>
            <h4>{delivery?.id.slice(0, 8)}...</h4>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-extralight">Order Id</p>
            <h4>{delivery?.orderId.slice(0, 8)}...</h4>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-extralight">Scheduled Time</p>
              <h4>
                {delivery?.scheduledAt.toLocaleDateString()},{" "}
                {delivery?.scheduledAt.toLocaleTimeString()}
              </h4>
            </div>

            {delivery?.status === "ARRIVED" &&
              delivery.deliveredAt !== null && (
                <div className="flex flex-col gap-1 py-2">
                  <p className="text-sm font-extralight">Delivered Time</p>
                  <h4>
                    {delivery?.deliveredAt.toLocaleDateString()},{" "}
                    {delivery?.deliveredAt.toLocaleTimeString()}
                  </h4>
                </div>
              )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-extralight">Status</p>
            <h4
              className={
                delivery?.status === "COMPLETED"
                  ? "text-green-400 font-semibold"
                  : "text-orange-400 font-semibold"
              }
            >
              {delivery?.status}
            </h4>
          </div>
        </div>
      </div>
      <div className="customer-info">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-extralight">
            Name: {delivery?.order.Service?.businessName}
          </p>
          {/* <p>Phone: </p> */}
          <p className="text-sm font-extralight">
            Address: {delivery?.order.Service?.location}
          </p>
        </div>
      </div>
      <div className="items-info">
        <h3 className="text-lg font-semibold">Items</h3>
        <ul className="flex flex-col gap-2 p-2">
          {delivery?.deliveryItems.map((item) => (
            <li key={item.id}>
              <p className="text-sm font-extralight">
                - {item.orderItem.stockItem.name} - Qty: {item.quantity}
              </p>
            </li>
          ))}
        </ul>
      </div>
      {delivery?.notes && (
        <div className="delivery-notes flex flex-col gap-2">
          <h3>Notes</h3>
          <p>{delivery.notes}</p>
        </div>
      )}
      {delivery?.status !== "ARRIVED" && (
        <ConfirmDeliveryButton
          deliveryId={delivery?.id || ""}
          status={delivery?.status || ""}
          serviceId={delivery?.order.Service?.id || ""}
          orderId={delivery?.orderId || ""}
          role="SUPPLIER"
        />
      )}
    </div>
  );
}
