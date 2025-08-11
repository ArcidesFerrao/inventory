import React from "react";
import { NavLink } from "./NavLink";

export const Navigator = () => {
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <NavLink
          href="/stock"
          label="Overview"
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href="/stock/products"
          label="Products"
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href="/stock/inventory"
          label="Stock"
          icon={<span className="lsicon--management-stockout-filled"></span>}
        />
        <NavLink
          href="/stock/logs"
          label="Active Logs"
          icon={<span className="lucide--logs"></span>}
        />
      </ul>
    </nav>
  );
};
export const ServiceNav = () => {
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <NavLink
          href="/service"
          label="Dashboard"
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href="/service/products"
          label="Products"
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href="/service/stock"
          label="Stock"
          icon={<span className="lsicon--management-stockout-filled"></span>}
        />
        <NavLink
          href="/service/purchases"
          label="Purchases"
          icon={<span className="f7--purchased"></span>}
        />
        <NavLink
          href="/service/sales"
          label="Sales"
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href="/service/logs"
          label="Active Logs"
          icon={<span className="lucide--logs"></span>}
        />
      </ul>
    </nav>
  );
};
