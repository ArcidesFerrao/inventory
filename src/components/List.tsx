import React from "react";

type ProductsProps = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export const ListItem = ({ id, name, price, stock }: ProductsProps) => {
  return (
    <li key={id} className=" flex">
      <div>
        <h3>{name}</h3>
        <p>Stock: {stock} </p>
      </div>
      <div>
        <h2>{price}</h2>
        <button>Edit</button>
      </div>
    </li>
  );
};
