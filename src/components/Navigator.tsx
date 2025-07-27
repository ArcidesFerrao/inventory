import React from "react";
import { NavLink } from "./NavLink";

export const Navigator = () => {
  return (
    <nav className="navigator">
      <ul className="flex flex-col">
        <NavLink
          href="/dashboard"
          label="Overview"
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href="/dashboard/products"
          label="Products"
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href="/dashboard/stock"
          label="Stock"
          icon={<span className="lsicon--management-stockout-filled"></span>}
        />
        <NavLink
          href="/dashboard/logs"
          label="Active Logs"
          icon={<span className="lucide--logs"></span>}
        />
      </ul>
    </nav>
  );
};
