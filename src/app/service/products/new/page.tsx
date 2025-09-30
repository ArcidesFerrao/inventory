import { ProductForm } from "@/components/ProductForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import React from "react";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (!session.user.serviceId) {
    redirect("/register/service");
  }
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <h1 className="text-xl font-semibold">Add New Product</h1>
      <ProductForm serviceId={session?.user.serviceId} />
    </div>
  );
}
