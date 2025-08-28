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
    where: { userId: session.user.id },
  });

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-medium">Sales List</h2>
        <Link href="/service/sales/new" className="add-product flex gap-1">
          <span className="text-md px-2">Sell</span>
        </Link>
      </div>
      {sales.length === 0 ? (
        <p>No sales found...</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {sales.map((item) => (
            <p key={item.id}></p>
          ))}
        </ul>
      )}
    </div>
  );
}
