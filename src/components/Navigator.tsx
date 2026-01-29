"use client";

import { NavLink, HomeNavLink } from "./NavLink";
import { usePathname } from "next/navigation";

export const Navigator = () => {
  // const { locale } = useParams();

  // const base = `/${locale}`;

  const pathname = usePathname();
  const base = pathname.split("/")[1] || "pt";
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <HomeNavLink
          href={`${base}/stock`}
          label="Overview"
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href={`${base}/stock/products`}
          label="Items"
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href={`${base}/stock/inventory`}
          label="Stock"
          icon={<span className="lsicon--management-stockout-filled"></span>}
        />
        <NavLink
          href={`${base}/stock/logs`}
          label="Active Logs"
          icon={<span className="icon-park-twotone--log"></span>}
        />
      </ul>
    </nav>
  );
};

export const ServiceNav = () => {
  // const { locale } = useParams();

  // const base = `/${locale}`;

  const pathname = usePathname();
  const base = pathname.split("/")[1] || "pt";
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <HomeNavLink
          href={`/${base}/service`}
          label="Dashboard"
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href={`/${base}/service/products`}
          label="Items"
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href={`/${base}/service/sales`}
          label="Sales"
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href={`/${base}/service/purchases`}
          label="Purchases"
          icon={<span className="f7--purchased"></span>}
        />
        <NavLink
          href={`/${base}/service/expenses`}
          label="Expenses"
          icon={<span className="mdi--cart-sale"></span>}
        />
        <NavLink
          href={`/${base}/service/logs`}
          label="Active Logs"
          icon={<span className="icon-park-twotone--log"></span>}
        />
        <NavLink
          href={`/${base}/service/settings`}
          label="Settings"
          icon={<span className="icon-park-outline--setting-one"></span>}
        />
      </ul>
    </nav>
  );
};

export const SupplyNav = () => {
  // const { locale } = useParams();

  // const base = `/${locale}`;
  const pathname = usePathname();
  const base = pathname.split("/")[1] || "pt";
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <HomeNavLink
          href={`/${base}/supply`}
          label="Dashboard"
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href={`/${base}/supply/products`}
          label="Stock"
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href={`/${base}/supply/orders`}
          label="Orders"
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href={`/${base}/supply/logs`}
          label="Active Logs"
          icon={<span className="icon-park-twotone--log"></span>}
        />
        <NavLink
          href={`/${base}/supply/settings`}
          label="Settings"
          icon={<span className="icon-park-outline--setting-one"></span>}
        />
      </ul>
    </nav>
  );
};

export const AdminNav = () => {
  // const { locale } = useParams();
  const pathname = usePathname();
  const base = pathname.split("/")[1] || "pt";

  // const base = `/${locale}`;
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <HomeNavLink
          href={`/${base}/admin`}
          label="Dashboard"
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href={`/${base}/admin/users`}
          label="Users"
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href={`/${base}/admin/products`}
          label="Items"
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href={`/${base}/admin/orders`}
          label="Orders"
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href={`/${base}/admin/sales`}
          label="Sales"
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href={`/${base}/admin/activity`}
          label="Logs"
          icon={<span className="icon-park-twotone--log"></span>}
        />
        <NavLink
          href={`/${base}/admin/settings`}
          label="Settings"
          icon={<span className="icon-park-outline--setting-one"></span>}
        />
      </ul>
    </nav>
  );
};
