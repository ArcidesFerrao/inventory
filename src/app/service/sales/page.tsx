import { SaleListItem } from "@/components/List";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function SalesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const sales = await db.sale.findMany({
    where: { serviceId: session.user.serviceId },
    include: {
      SaleItem: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="sales-title">
          <h2 className="text-2xl font-medium">Recent Sales</h2>
          <p className="text-md font-extralight">
            Track and manage your sales transactions
          </p>
        </div>
        <Link href="/service/sales/new" className="add-product flex gap-1">
          <span className="text-md px-2">New Sale</span>
        </Link>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p>Total Sales</p>
          <h2 className="text-xl font-bold">{sales.length}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Revenue</p>
          <h2 className="text-xl font-bold">
            MZN {sales.reduce((acc, sale) => acc + sale.total, 0)}.00
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Cogs</p>
          <h2 className="text-xl font-bold">
            MZN {sales.reduce((acc, sale) => acc + sale.cogs, 0)}.00
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Gross Profit</p>
          <h2 className="text-xl font-bold">
            MZN{" "}
            {sales.reduce((acc, sale) => acc + sale.total, 0) -
              sales.reduce((acc, sale) => acc + sale.cogs, 0)}
            .00
          </h2>
        </div>
      </div>
      {sales.length === 0 ? (
        <p>No sales found...</p>
      ) : (
        <ul className="w-full flex flex-col gap-2">
          {sales.map((sale) => (
            <SaleListItem key={sale.id} sale={sale} />
          ))}
        </ul>
      )}
    </div>
  );
}
