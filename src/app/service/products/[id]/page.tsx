import { DeleteButton } from "@/components/DeleteButton";
import { db } from "@/lib/db";
import Link from "next/link";
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
      MenuItems: {
        include: {
          stock: {
            select: {
              name: true,
            },
          },
        },
      },
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
          <DeleteButton productId={id} />
          <Link
            className="edit-button px-2 py-2 flex items-center "
            href={`/service/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div>
      </div>
      <div className="flex  justify-between w-full  my-5">
        <div className="flex flex-col gap-5">
          {product?.type === "STOCK" && (
            <div className="flex gap-5 justify-between">
              <div className="flex flex-col gap-2">
                <p>Unit Quantity</p>
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
          )}

          <div className="flex gap-5 justify-between">
            {product?.type === "SERVICE" && (
              <div className="flex flex-col gap-2">
                <p>Category</p>
                <h2 className="font-bold text-xl">{product?.Category?.name}</h2>
              </div>
            )}

            {product?.type === "STOCK" && (
              <div className="flex flex-col gap-2">
                <p>Status</p>
                <h2 className="font-bold text-xl">{product?.status}</h2>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-fit">
          <div className="flex flex-col gap-2">
            <p>Type</p>
            <h2 className="font-bold text-xl">{product?.type}</h2>
          </div>
          {product?.type === "STOCK" && (
            <div className="flex flex-col gap-2">
              <p>Cost</p>
              <h2 className="font-bold text-xl">
                {product?.price?.toFixed(2)} MZN
              </h2>
            </div>
          )}
          {product?.type === "SERVICE" && (
            <div className="flex flex-col gap-2">
              <p>Price</p>
              <h2 className="font-bold text-xl">
                {product?.price?.toFixed(2)} MZN
              </h2>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Description </h2>
          <span className="product-detail-desc p-2 text-md font-light">
            <p>{product?.description}</p>
          </span>
          {product?.type === "SERVICE" && (
            <ul className="flex flex-col recipe-items-list p-2">
              <h2 className="font-semibold underline">Recipe Items</h2>
              {product.MenuItems.filter((i) => i.quantity > 0).map((item) => (
                <li className="flex justify-between py-1" key={item.id}>
                  <p className="font-light">{item.stock.name}</p>
                  <p>{item.quantity}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col self-end gap-2 w-fit">
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
