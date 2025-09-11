import Link from "next/link";
import React from "react";
import { getServiceDashBoardStats } from "../actions/dashboardStats";
import { getProducts } from "../actions/product";

export default async function ServicePage() {
  const stats = await getServiceDashBoardStats();
  const stockProducts = await getProducts();
  const filteredProducts = stockProducts.filter(
    (product) => product.stock && product.stock < 10
  );

  if (!stats) return <p>Please login to see the dashboard</p>;
  return (
    <section className="flex flex-col w-full ">
      <div className="dash-header flex items-center justify-between">
        <h1 className="text-4xl font-medium">Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/service/products/new" className="add-product flex gap-2">
            <span>+</span>
            <span className="text-md">Product</span>
          </Link>
          <Link href="/service/sales/new" className="add-product flex gap-2">
            <span>+</span>
            <span className="text-md">Sale</span>
          </Link>
        </div>
      </div>
      <div className="dash-stats gap-4 flex py-8 w-full">
        <div className="balance flex flex-col p-4">
          <div className=" flex flex-col">
            <h2 className="text-2xl font-bold">Balance</h2>
            <h1 className="text-xl py-2 whitespace-nowrap font-medium">
              MZN {stats.balance},00
            </h1>
          </div>
          <div className=" flex flex-col">
            <h2 className="text-2xl font-bold">Profit</h2>
            <h1 className="text-xl py-2 whitespace-nowrap font-medium">
              MZN {stats.profit},00
            </h1>
          </div>
        </div>
        <div className="stats flex flex-col justify-between w-full p-4">
          <h2 className="text-2xl font-bold underline">Statistics</h2>
          <p className="font-thin">stats of products, sales and earnings</p>
          <div className="stats-container flex justify-between">
            <div className="earnings ">
              <h3 className="text-lg">Earnings</h3>
              <h2 className="text-lg py-2 font-medium">
                MZN {stats.earnings},00
              </h2>
            </div>
            <span className="divider"></span>
            <div className="sales">
              <h3 className="text-lg">Number of Sales</h3>
              <h2 className="text-xl py-2  font-medium">{stats.salesCount}</h2>
            </div>
            <span className="divider"></span>
            <div className="products">
              <h3 className="text-lg">Number of Products</h3>
              <h2 className="text-xl py-2  font-medium">
                {stats.productCount}
              </h2>
            </div>
          </div>
        </div>
      </div>
      {filteredProducts.length > 0 && (
        <div className="items-list flex flex-col p-4 w-fit gap-4 justify-start items-start">
          <h2 className="text-2xl font-bold">Critic Items</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
