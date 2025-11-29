import { ProductForm } from "@/components/ProductForm";
import { db } from "@/lib/db";
import React from "react";

type Params = Promise<{ id: string }>;

export default async function EditProductPage(props: { params: Params }) {
  const { id } = await props.params;
  const item = await db.item.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      unit: true,
    },
  });
  if (!item) return <div>Product not found</div>;

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <h1 className="text-xl font-semibold">Edit Product: {item.name}</h1>
      <ProductForm
        serviceId={item.serviceId}
        item={{
          ...item,
          Category: item.category,
          Unit: item.unit
            ? {
                name: item.unit.name,
                id: item.unit.id,
                description: item.unit.description,
              }
            : null,
        }}
      />
    </div>
  );
}
