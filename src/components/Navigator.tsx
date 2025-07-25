import Link from "next/link";
import React from "react";

export const Navigator = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/dashboard">Overview</Link>
        </li>
        <li>
          <Link href="/dashboard/products">Products</Link>
        </li>
        <li>
          <Link href="/dashboard/stock">Stock</Link>
        </li>
        <li>
          <Link href="/dashboard/logs">Active Logs</Link>
        </li>
      </ul>
    </nav>
  );
};
