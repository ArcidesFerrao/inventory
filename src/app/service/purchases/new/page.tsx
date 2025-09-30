import { PurchasesList } from "@/components/PurchasesList";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function NewPurchase() {
  const session = await getServerSession(authOptions);

  if (!session?.user.serviceId) redirect("/login");

  const products = await db.product.findMany({
    where: {
      serviceId: session.user.serviceId,
      type: "STOCK",
    },
  });

  return (
    <div className="sales-section flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-medium">New Purchase</h2>
        <Link href="/service/purchases" className="add-product flex gap-1">
          <span className="text-md px-2">Cancel</span>
        </Link>
      </div>
      <div className="sales-content flex justify-between gap-4">
        {products.length === 0 ? (
          <p>No products found...</p>
        ) : (
          <PurchasesList
            initialProducts={products.map((product) => ({
              ...product,
              price: product.price ?? 0,
              quantity: 0,
            }))}
            serviceId={session.user.serviceId}
          />
        )}
      </div>
    </div>
  );
}
