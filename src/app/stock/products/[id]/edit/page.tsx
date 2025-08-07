import { ProductForm } from "@/components/ProductForm";
import { db } from "@/lib/db";
import React from "react";

type Params = Promise<{ id: string }>;

export default async function EditProductPage(props: { params: Params }) {
  const { id } = await props.params;
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      category: true,
      description: true,
    },
  });
  if (!product) return <div>Product not found</div>;

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <h1 className="text-xl font-semibold">Edit Product: {id}</h1>
      <ProductForm product={product} />
    </div>
  );
}
