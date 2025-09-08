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
    where: {
      userId: session.user.id,
      type: "STOCK",
    },
  });

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Stock</h2>
      <div className="flex gap-2">
        <h3>Number of Products:</h3>
        <p>{products.length}</p>
      </div>
      {products.length > 0 && (
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
                <td>
                  <p>{item.stock}</p>
                </td>
                <td className="flex justify-center">
                  {item.stock > 5 ? (
                    <span className="inline-block w-4 h-4 bg-green-600 rounded-full"></span>
                  ) : item.stock > 0 ? (
                    <span className="inline-block w-4 h-4 bg-amber-400  rounded-full"></span>
                  ) : (
                    <span className="inline-block w-4 h-4 bg-red-400  rounded-full"></span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
