import { ServiceOrder } from "@/components/ServiceOrder";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewOrder({
  params,
}: {
  params: { locale: string };
}) {
  const locale = await params.locale;

  const session = await auth();

  if (!session?.user.serviceId) redirect("/login");

  const suppliers = await db.supplier.findMany({
    where: {
      businessName: {
        not: "Direct Purchase",
      },
    },
    include: {
      StockItems: {
        include: {
          unit: true,
          supplier: true,
        },
      },
    },
  });

  return (
    <>
      <div className="sales-section flex flex-col gap-5 w-full">
        <div className="list-header flex items-center justify-between w-full">
          <h2 className="text-2xl font-bold">Suppliers List</h2>
          <Link
            href={`/${locale}/service/purchases`}
            className="cancel-btn add-product flex"
          >
            <span className="text-md px-2">Cancel</span>
          </Link>
        </div>
        {suppliers.length > 0 ? (
          <ServiceOrder
            serviceId={session.user.serviceId}
            suppliers={suppliers}
          />
        ) : (
          <p>No suppliers found...</p>
        )}
      </div>
    </>
  );
}
