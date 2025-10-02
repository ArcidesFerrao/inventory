import { DeleteButton } from "@/components/DeleteButton";
import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";
type Params = Promise<{ id: string }>;

export default async function ProductPage(props: { params: Params }) {
  const { id } = await props.params;
  const product = await db.supplierProduct.findUnique({
    where: {
      id,
    },
    include: {
      Unit: true,
    },
  });
  return (
    <div className="flex flex-col gap-5 items-start">
      <div className="flex justify-between w-full">
        <div>
          <h2 className="text-2xl font-semibold">{product?.name}</h2>
          <p className="text-xs font-thin">Id: {product?.id}</p>
        </div>
        <div className="flex gap-2">
          <DeleteButton productId={id} />
          <Link
            className="edit-button px-3 py-2 flex items-center "
            href={`/supply/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div>
      </div>
      <div className="flex gap-10">
        <div>
          <h2>Quantity: {product?.unitQty}</h2>
          <h2>Unit: {product?.Unit?.name}</h2>
          <h2>Cost: {product?.cost?.toFixed(2)} MZN</h2>
          <h2>Stock: {product?.stock}</h2>
        </div>
        <h2>Price: {product?.price?.toFixed(2)} MZN</h2>
      </div>
      <h2>Description: {product?.description}</h2>
      <div className="flex justify-between gap-4 w-full">
        <p className="text-xs font-thin">
          Created At: {product?.createdAt.toLocaleDateString()}
        </p>
        <p className="text-xs font-thin">
          Updated At: {product?.updatedAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
