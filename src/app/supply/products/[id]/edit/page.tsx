import { SupplierProductForm } from "@/components/ProductForm";
import { db } from "@/lib/db";
import Link from "next/link";
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
    <div className="flex flex-col gap-5  w-full">
      <div className="edit-product-header flex justify-between gap-5">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">Edit Product</h1>
          <p className="text-xs font-extralight">Id: {id}</p>
        </div>
        <Link href="/supply/products">
          <span className="ep--back"></span>
        </Link>
      </div>
      <SupplierProductForm
        supplierProduct={{
          ...product,
          quantity: product.unitQty,
          type: "SUPPLY",
          Unit: product.Unit
            ? {
                id: product.Unit.id,
                name: product.Unit.name,
                description: product.Unit.description,
              }
            : null,
        }}
        supplierId={product.supplierId}
      />
    </div>
  );
}
