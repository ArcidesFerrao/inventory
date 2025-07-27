import Link from "next/link";
import React from "react";

export const Navigator = () => {
  return (
    <nav>
      <ul className="flex flex-col">
        <li className="py-4 px-8 flex items-center gap-2">
          <span className="mage--dashboard-fill"></span>
          <Link href="/dashboard">Overview</Link>
        </li>
        <li className="py-4 px-8 flex items-center gap-2">
          <span className="ant-design--product-filled"></span>
          <Link href="/dashboard/products">Products</Link>
        </li>
        <li className="py-4 px-8 flex items-center gap-2">
          <span className="lsicon--management-stockout-filled"></span>
          <Link href="/dashboard/stock">Stock</Link>
        </li>
        <li className="py-4 px-8 flex items-center gap-2">
          <span className="lucide--logs"></span>
          <Link href="/dashboard/logs">Active Logs</Link>
        </li>
      </ul>
    </nav>
  );
};
