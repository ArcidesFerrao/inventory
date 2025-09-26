import { ProductForm } from "@/components/ProductForm";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import React from "react";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);

  const service = await db.service.findUnique({
    where: {
      userId: session?.user.id,
    },
  });
  if (!service) {
    redirect("/login");
  }
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <h1 className="text-xl font-semibold">Add New Product</h1>
      <ProductForm serviceId={service.id} />
    </div>
  );
}
