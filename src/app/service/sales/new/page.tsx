import { SalesList } from "@/components/SalesList";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductWithMenuItems } from "@/types/types";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function NewSale() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const products = await db.product.findMany({
    where: {
      userId: session.user.id,
      type: "SERVICE",
    },
    include: {
      MenuItems: true,
      Category: true,
    },
  });

  const mappedProducts: ProductWithMenuItems[] = products.map((product) => ({
    ...product,
    price: product.price ?? 0,
    stock: product.stock ?? 0,
  }));

  return (
    <div className="sales-section flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-medium">New Sale</h2>
        <Link href="/service/sales" className="add-product flex gap-1">
          <span className="text-md px-2">Cancel</span>
        </Link>
      </div>
      <div className="sales-content flex justify-between gap-4">
        {products.length === 0 ? (
          <p>No products found...</p>
        ) : (
          <SalesList
            initialProducts={mappedProducts}
            userId={session.user.id}
          />
        )}
      </div>
    </div>
  );
}
