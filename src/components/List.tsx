import Link from "next/link";
import React from "react";
import DeleteButton from "./DeleteButton";

type ProductsProps = {
  id: string;
  name: string;
  price: number;
};

export const ListItem = ({ id, name, price }: ProductsProps) => {
  return (
    <li key={id} className="flex p-4 justify-between">
      <div className="flex flex-col gap-4 justify-between ">
        <Link href={`/dashboard/products/${id}`}>
          <h3 className="text-lg font-medium">{name}</h3>
        </Link>
      </div>
      <div className="flex flex-col items-end gap-2">
        <h2 className="text-xl font-bold ">MZN {price},00</h2>
        <div className="flex gap-2">
          <DeleteButton productId={id} />
          <Link
            className="edit-button p-2 flex "
            href={`/dashboard/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div>
      </div>
    </li>
  );
};
