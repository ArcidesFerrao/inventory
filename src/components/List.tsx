import React from "react";

type ProductsProps = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export const ListItem = ({ id, name, price, stock }: ProductsProps) => {
  return (
    <li key={id} className="flex p-4 justify-between">
      <div className="flex flex-col gap-4 justify-between ">
        <h3 className="text-lg font-medium">{name}</h3>
        <p className="text-xs font-light">Stock: {stock} </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <h2 className="text-xl font-bold ">MZN {price},00</h2>
        <button className="edit-button p-2 flex ">
          <span className="mdi--edit"></span>
        </button>
      </div>
    </li>
  );
};
