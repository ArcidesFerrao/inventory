import { SupplierProductForm } from "@/components/ProductForm";
import { db } from "@/lib/db";
import React from "react";

type Params = Promise<{ id: string }>;

export default async function EditSupplierProductPage(props: {
  params: Params;
}) {
  const { id } = await props.params;
  const product = await db.supplierProduct.findUnique({
    where: {
      id,
    },
    include: {
      Unit: true,
    },
  });
  if (!product) return <div>Product not found</div>;

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <h1 className="text-xl font-semibold">Edit Product: {id}</h1>
      <SupplierProductForm
        product={{
          ...product,
          quantity: product.unitQty,
          type: "SUPPLY",
          Unit: product.Unit
            ? { id: product.Unit.id, name: product.Unit.name }
            : undefined,
        }}
      />
    </div>
  );
}
