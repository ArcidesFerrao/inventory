import { SupplierDelivery } from "@/components/NewDelivery";
import { db } from "@/lib/db";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function NewDeliveryPage(props: { params: Params }) {
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
    },
  });

  if (!order) return <div>Order not found</div>;

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
              Order #{order.id.slice(0, 8)}...
            </p>
          </div>
        </div>
        <Link
          className="cancel-btn px-4 py-1 rounded-sm"
          href={`/supply/orders/${id}`}
        >
          Cancel
        </Link>
      </div>
      <SupplierDelivery order={order} items={order.orderItems} />
    </div>
  );
}
