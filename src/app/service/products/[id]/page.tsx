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
    <div>
      <h1>Id: {product?.id}</h1>
      <h2>Name: {product?.name}</h2>
      <h2>Price: {product?.price}</h2>
      <h2>Description: {product?.description}</h2>
      <h2>Type: {product?.type}</h2>
      <h2>Category: {product?.Category?.name}</h2>
      <h2>Quantity: {product?.quantity}</h2>
      <h2>Unit: {product?.Unit?.name}</h2>
      <h2>Stock: {product?.stock ? "Yes" : "No"}</h2>
      <h2>Cost: {product?.cost || "..."}</h2>
      <h2>Status: {product?.status}</h2>
      <h2>Created At: {product?.createdAt.toLocaleDateString()}</h2>
      <h2>Updated At: {product?.updatedAt.toLocaleDateString()}</h2>
    </div>
  );
}
