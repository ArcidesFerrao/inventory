import { SupplierDelivery } from "@/components/NewDelivery";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type Params = Promise<{ id: string; locale: string }>;

export default async function NewDeliveryPage(props: { params: Params }) {
  const session = await auth();

  const { id } = await props.params;
  const { locale } = await props.params;

  const t = await getTranslations("Common");
  const ot = await getTranslations("Orders");

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

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

  if (!order) return <div>{ot("notFoundOrder")}</div>;

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <div className="delivery-header flex justify-between w-full items-center">
        <div className="flex items-start">
          <span className="p-2">
            <span className="formkit--date"></span>
          </span>
          <div>
            <h2 className="text-2xl font-bold">{ot("scheduleDelivery")}</h2>
            <p className="text-xs font-extralight">
              {ot("order")} #{order.id.slice(0, 8)}...
            </p>
          </div>
        </div>
        <Link
          className="cancel-btn px-4 py-1 rounded-sm"
          href={`/${locale}/supply/orders/${id}`}
        >
          {t("cancel")}
        </Link>
      </div>
      <SupplierDelivery order={order} items={order.orderItems} />
    </div>
  );
}
