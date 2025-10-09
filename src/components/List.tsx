import Link from "next/link";
import React from "react";
import { DeleteButton } from "./DeleteButton";

type ProductsStockProps = {
  id: string;
  name: string;
  price: number;
  stock: number;
};
type ProductsProps = {
  id: string;
  name: string;
  price: number;
};

type SupplierProductsProps = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export const ListStockItem = ({
  id,
  name,
  price,
  stock,
}: ProductsStockProps) => {
  return (
    <li key={id} className="listing-item flex p-4 justify-between">
      <div className="flex flex-col gap-4 justify-between ">
        <Link href={`/supply/products/${id}`}>
          <h3 className="text-lg font-medium">{name}</h3>
        </Link>
        <p className="text-sm font-light">Quantity: {stock}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <h2 className="text-xl font-bold ">MZN {price},00</h2>
        <div className="flex gap-2">
          <DeleteButton productId={id} />
          <Link
            className="edit-button p-2 flex "
            href={`/supply/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div>
      </div>
    </li>
  );
};
export const ListItem = ({ id, name, price }: ProductsProps) => {
  return (
    <li key={id} className="listing-item flex p-4 justify-between">
      <div className="flex flex-col gap-4 justify-between ">
        <Link href={`/supply/products/${id}`}>
          <h3 className="text-lg font-medium">{name}</h3>
        </Link>
      </div>
      <div className="flex flex-col items-end gap-2">
        <h2 className="text-xl font-bold ">MZN {price},00</h2>
        <div className="flex gap-2">
          <DeleteButton productId={id} />
          <Link
            className="edit-button p-2 flex "
            href={`/supply/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div>
      </div>
    </li>
  );
};
export const ListDrinkItem = ({ id, name, price }: ProductsProps) => {
  return (
    <li key={id} className="flex gap-4 justify-between py-1">
      <Link href={`/supply/products/${id}`}>
        <h4 className="text-md font-light hover:underline">{name}</h4>
      </Link>
      <h2 className="text-md font-semibold ">MZN {price},00</h2>
    </li>
  );
};
export const ListSupplierItem = ({
  id,
  name,
  price,
  qty,
}: SupplierProductsProps) => {
  return (
    <li key={id} className="listing-item flex p-4 justify-between">
      <div className="flex flex-col gap-4 justify-between ">
        <Link href={`/supply/products/${id}`}>
          <h3 className="text-lg font-medium">{name}</h3>
        </Link>
        <span className="text-sm font-light">Qty: {qty}</span>
      </div>
      <div className="flex flex-col items-end gap-2">
        <h2 className="text-xl font-bold ">MZN {price},00</h2>
        <div className="flex gap-2">
          <DeleteButton productId={id} />
          <Link
            className="edit-button p-2 flex "
            href={`/supply/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div>
      </div>
    </li>
  );
};
