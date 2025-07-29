"use client";

import { ProductForm } from "@/components/ProductForm";
import { useParams } from "next/navigation";
import React from "react";

export default function EditProductPage() {
  // const { id } = useParams();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;

  if (!id) return <div>Product not found</div>;

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <h1 className="text-xl font-semibold">Edit Product: {id}</h1>
      <ProductForm id={id} />
    </div>
  );
}
