import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function NewSale() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const products = await db.product.findMany({
    where: { userId: session.user.id },
  });

  return (
    <div className="sales-section flex gap-4 w-full">
      <div>
        <h2>Products</h2>
        <ul className=" w-lg">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center p-1 border-b"
            >
              <h3>{product.name}</h3>

              <div className="flex gap-2 items-center w-46">
                <div className="amount-btn flex gap-2 items-center px-2 py-1">
                  <button>-</button>
                  <span>0</span>
                  <button>+</button>
                </div>
                <span>
                  <p>{product.price} MZN</p>
                </span>
              </div>
            </li>
          ))}
          <li className="flex justify-between items-center p-2 border-b">
            <h3>Hamburguer</h3>

            <div className="flex gap-2 items-center w-40">
              <div className="flex gap-2 items-center px-2 py-1">
                <button>-</button>
                <span>0</span>
                <button>+</button>
              </div>
              <span>
                <p>150.00 MZN</p>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <h2>Order Summary</h2>
        <div>
          <h3>Items:</h3>
          <p>3</p>
        </div>
        <div>
          <h3>Total:</h3>
          <p>300.00 MZN</p>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded mt-4">
          Complete Sale
        </button>
      </div>
    </div>
  );
}
