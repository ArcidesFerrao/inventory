import { SupplierProductDeleteButton } from "@/components/DeleteButton";
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
    <div className="flex flex-col gap-5 items-start w-full">
      <div className="flex justify-between w-full">
        <div>
          <h2 className="text-2xl font-semibold">{product?.name}</h2>
          <p className="text-xs font-thin">Id: {product?.id}</p>
        </div>
        <div className="flex gap-2 items-center">
          <SupplierProductDeleteButton supplierProductId={id} />
          <Link
            className="edit-button px-2 py-2 flex items-center "
            href={`/supply/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex gap-5">
          <div className="flex flex-col gap-2">
            <p>Quantity</p>
            <h2 className="font-bold text-xl">{product?.unitQty}</h2>
          </div>
          <div className="flex flex-col gap-2">
            <p>Unit</p>
            <h2 className="font-bold text-xl">{product?.Unit?.name}</h2>
          </div>
          <div className="flex flex-col gap-2">
            <p>Stock</p>
            <h2 className="font-bold text-xl">{product?.stock}</h2>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <p>Cost</p>
            <h2 className="font-bold text-xl">
              {product?.cost?.toFixed(2)} MZN
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            <p>Price</p>
            <h2 className="font-bold text-xl">
              {product?.price?.toFixed(2)} MZN
            </h2>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Description </h2>
          <span className="product-detail-desc p-2 text-md font-light">
            <p>{product?.description}</p>
          </span>
        </div>

        <div className="flex flex-col gap-2 justify-end">
          <p className="text-xs font-thin">
            Created At: {product?.createdAt.toLocaleDateString()}
          </p>
          <p className="text-xs font-thin">
            Updated At: {product?.updatedAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
