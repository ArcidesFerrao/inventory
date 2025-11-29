import React from "react";
import { NavLink, HomeNavLink } from "./NavLink";

export const Navigator = () => {
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <HomeNavLink
          href="/stock"
          label="Overview"
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href="/stock/products"
          label="Items"
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
        <HomeNavLink
          href="/service"
          label="Dashboard"
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href="/service/products"
          label="Items"
          icon={<span className="ant-design--product-filled"></span>}
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
        <NavLink
          href="/service/settings"
          label="Settings"
          icon={<span className="icon-park-outline--setting-one"></span>}
        />
      </ul>
    </nav>
  );
};

export const SupplyNav = () => {
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <HomeNavLink
          href="/supply"
          label="Dashboard"
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href="/supply/products"
          label="Stock"
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href="/supply/orders"
          label="Orders"
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href="/supply/logs"
          label="Active Logs"
          icon={<span className="lucide--logs"></span>}
        />
        <NavLink
          href="/supply/settings"
          label="Settings"
          icon={<span className="icon-park-outline--setting-one"></span>}
        />
      </ul>
    </nav>
  );
};

export const AdminNav = () => {
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <HomeNavLink
          href="/admin"
          label="Dashboard"
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href="/admin/users"
          label="Users"
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href="/admin/products"
          label="Items"
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href="/admin/orders"
          label="Orders"
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href="/admin/activity"
          label="Logs"
          icon={<span className="lucide--logs"></span>}
        />
        <NavLink
          href="/admin/settings"
          label="Settings"
          icon={<span className="icon-park-outline--setting-one"></span>}
        />
      </ul>
    </nav>
  );
};
