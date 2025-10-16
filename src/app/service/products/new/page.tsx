import { ProductForm } from "@/components/ProductForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
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
    <div className="flex flex-col gap-5 items-center w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold">Add New Product</h1>
        <Link href="/service/products">
          <span className="ep--back"></span>
        </Link>
      </div>
      <ProductForm serviceId={session?.user.serviceId} />
    </div>
  );
}
