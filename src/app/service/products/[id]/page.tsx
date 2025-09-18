import { db } from "@/lib/db";
import React from "react";
type Params = Promise<{ id: string }>;

export default async function ProductPage(props: { params: Params }) {
  const { id } = await props.params;
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      Category: true,
      Unit: true,
    },
  });
  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex justify-between w-full">
        <div>
          <h2 className="text-xl">{product?.name}</h2>
          <p className="text-xs font-thin">Id: {product?.id}</p>
        </div>
        <div className="flex gap-2">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
      <div className="flex gap-10">
        <div>
          {product?.type === "STOCK" && (
            <div>
              <h2>Unit: {product?.Unit?.name}</h2>
              <h2>Quantity: {product?.quantity}</h2>
              <h2>Stock: {product?.stock ? "Yes" : "No"}</h2>
              <h2>Cost: {product?.cost}</h2>
            </div>
          )}
          <h2>Price: {product?.price?.toFixed(2)} MZN</h2>
        </div>

        <div>
          <h2>Type: {product?.type}</h2>
          <h2>Category: {product?.Category?.name}</h2>
          {product?.type === "STOCK" && <h2>Status: {product?.status}</h2>}
        </div>
      </div>
      <h2>Description: {product?.description}</h2>
      <h2>Created At: {product?.createdAt.toLocaleDateString()}</h2>
      <h2>Updated At: {product?.updatedAt.toLocaleDateString()}</h2>
    </div>
  );
}
