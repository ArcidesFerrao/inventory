import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import React from "react";

export default async function StockPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return (
      <section>
        <div>
          <p>User not found!</p>
        </div>
      </section>
    );

  const products = await db.product.findMany({
    where: { userId: session.user.id },
  });

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Stock</h2>
      <div className="flex gap-2">
        <h3>Number of Products:</h3>
        <p>{products.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.stock}</td>
              <td>
                {item.stock > 5 ? (
                  <span className="w-4 h-4 bg-green-600"></span>
                ) : item.stock > 0 ? (
                  <span className="w-4 h-4 bg-amber-400"></span>
                ) : (
                  <span className="w-4 h-4 bg-red-400"></span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
