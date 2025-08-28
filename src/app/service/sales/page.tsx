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
        <h2 className="text-2xl font-medium">Recent Sales</h2>
        <div className="flex">
          <h2 className="text-lg font-bold">Total Sales:</h2>
          <p className="text-lg font-bold px-2">
            {sales.reduce((acc, sale) => acc + sale.total, 0)}
          </p>
        </div>
        <Link href="/service/sales/new" className="add-product flex gap-1">
          <span className="text-md px-2">Sell</span>
        </Link>
      </div>
      {sales.length === 0 ? (
        <p>No sales found...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total</th>
              <th>Payment Type</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td>{sale.total}</td>
                <td>{sale.paymentType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
