"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("Common");

  const pathname = usePathname();
  const base = pathname.split("/")[1] || "pt";
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <HomeNavLink
          href={`/${base}/service`}
          label={t("dashboard")}
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href={`/${base}/service/products`}
          label={t("items")}
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href={`/${base}/service/sales`}
          label={t("sales")}
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href={`/${base}/service/purchases`}
          label={t("purchases")}
          icon={<span className="f7--purchased"></span>}
        />
        <NavLink
          href={`/${base}/service/expenses`}
          label={t("expenses")}
          icon={<span className="mdi--cart-sale"></span>}
        />
        <NavLink
          href={`/${base}/service/logs`}
          label={t("activityLogs")}
          icon={<span className="icon-park-twotone--log"></span>}
        />
        <NavLink
          href={`/${base}/service/settings`}
          label={t("settings")}
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
  const t = useTranslations("Common");

  const base = pathname.split("/")[1] || "pt";
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <HomeNavLink
          href={`/${base}/supply`}
          label={t("dashboard")}
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href={`/${base}/supply/products`}
          label={t("stock")}
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href={`/${base}/supply/orders`}
          label={t("orders")}
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href={`/${base}/supply/logs`}
          label={t("activityLogs")}
          icon={<span className="icon-park-twotone--log"></span>}
        />
        <NavLink
          href={`/${base}/supply/settings`}
          label={t("settings")}
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
  const t = useTranslations("Common");

  // const base = `/${locale}`;
  return (
    <nav className="navigator">
      <ul className="flex flex-col gap-2">
        <HomeNavLink
          href={`/${base}/admin`}
          label={t("dashboard")}
          icon={<span className="mage--dashboard-fill"></span>}
        />
        <NavLink
          href={`/${base}/admin/users`}
          label={t("users")}
          icon={<span className="ant-design--product-filled"></span>}
        />
        <NavLink
          href={`/${base}/admin/products`}
          label={t("items")}
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href={`/${base}/admin/orders`}
          label={t("orders")}
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href={`/${base}/admin/sales`}
          label={t("sales")}
          icon={<span className="carbon--sales-ops"></span>}
        />
        <NavLink
          href={`/${base}/admin/activity`}
          label={t("activityLogs")}
          icon={<span className="icon-park-twotone--log"></span>}
        />
        <NavLink
          href={`/${base}/admin/settings`}
          label={t("settings")}
          icon={<span className="icon-park-outline--setting-one"></span>}
        />
      </ul>
    </nav>
  );
};
