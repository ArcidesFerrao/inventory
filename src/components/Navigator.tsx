import Link from "next/link";
import React from "react";

export const Navigator = () => {
  return (
    <nav>
      <ul className="flex flex-col">
        <li className="py-4 px-8">
          <Link href="/dashboard">Overview</Link>
        </li>
        <li className="py-4 px-8">
          <Link href="/dashboard/products">Products</Link>
        </li>
        <li className="py-4 px-8">
          <Link href="/dashboard/stock">Stock</Link>
        </li>
        <li className="py-4 px-8">
          <Link href="/dashboard/logs">Active Logs</Link>
        </li>
      </ul>
    </nav>
  );
};
