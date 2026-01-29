"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { HomeNavLink, NavLink } from "./NavLink";
import { NotificationBell } from "./Bell";
import { LogOutButton } from "./LogOutButton";

export const MenuButton = ({
  userId,
  userName,
}: {
  userId?: string | null;
  userName?: string | null;
}) => {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "pt";

  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="nav-menu-btn absolute z-10 top-8  right-4">
      {!showMenu ? (
        <div className="flex gap-2">
          <NotificationBell locale={locale} />
          <button
            onClick={() => setShowMenu(true)}
            className="header-menu-btn flex items-center"
          >
            <span className="line-md--menu"></span>
          </button>
        </div>
      ) : (
        <section className="header-menu flex flex-col justify-between gap-5 p-4 h-full">
          <div className="flex flex-col gap-5 ">
            <div className="header-navigator flex items-center gap-5">
              <p className="header-welcome ">
                Welcome, <Link href={`/${locale}/${userId}`}>{userName}</Link>
              </p>
              <button
                onClick={() => setShowMenu(false)}
                className="flex items-center"
              >
                <span className="line-md--close"></span>
              </button>
            </div>
            {pathname.startsWith(`/${locale}/supply`) && (
              <ul className="flex flex-col gap-2">
                <HomeNavLink
                  href={`/${locale}/supply`}
                  label="Dashboard"
                  icon={<span className="mage--dashboard-fill"></span>}
                />
                <NavLink
                  href={`/${locale}/supply/products`}
                  label="Stock"
                  icon={<span className="ant-design--product-filled"></span>}
                />
                <NavLink
                  href={`/${locale}/supply/orders`}
                  label="Orders"
                  icon={<span className="carbon--sales-ops"></span>}
                />
                <NavLink
                  href={`/${locale}/supply/logs`}
                  label="Active Logs"
                  icon={<span className="icon-park-twotone--log"></span>}
                />
                <NavLink
                  href={`/${locale}/supply/settings`}
                  label="Settings"
                  icon={
                    <span className="icon-park-outline--setting-one"></span>
                  }
                />
              </ul>
            )}
            {pathname.startsWith(`/${locale}/service`) && (
              <ul className="flex flex-col gap-2">
                <HomeNavLink
                  href={`/${locale}/service`}
                  label="Dashboard"
                  icon={<span className="mage--dashboard-fill"></span>}
                />
                <NavLink
                  href={`/${locale}/service/products`}
                  label="Items"
                  icon={<span className="ant-design--product-filled"></span>}
                />
                <NavLink
                  href={`/${locale}/service/purchases`}
                  label="Purchases"
                  icon={<span className="bxs--purchase-tag"></span>}
                />
                <NavLink
                  href={`/${locale}/service/sales`}
                  label="Sales"
                  icon={<span className="carbon--sales-ops"></span>}
                />
                <NavLink
                  href={`/${locale}/service/expenses`}
                  label="Expenses"
                  icon={<span className="mdi--cart-sale"></span>}
                />
                <NavLink
                  href={`/${locale}/service/logs`}
                  label="Active Logs"
                  icon={<span className="icon-park-twotone--log"></span>}
                />
                <NavLink
                  href={`/${locale}/service/settings`}
                  label="Settings"
                  icon={
                    <span className="icon-park-outline--setting-one"></span>
                  }
                />
              </ul>
            )}
            {pathname.startsWith(`/${locale}/admin`) && (
              <ul className="flex flex-col gap-2">
                <HomeNavLink
                  href={`/${locale}/admin`}
                  label="Dashboard"
                  icon={<span className="mage--dashboard-fill"></span>}
                />
                <NavLink
                  href={`/${locale}/admin/users`}
                  label="Users"
                  icon={<span className="ant-design--product-filled"></span>}
                />
                <NavLink
                  href={`/${locale}/admin/products`}
                  label="Items"
                  icon={<span className="carbon--sales-ops"></span>}
                />
                <NavLink
                  href={`/${locale}/admin/orders`}
                  label="Orders"
                  icon={<span className="carbon--sales-ops"></span>}
                />
                <NavLink
                  href={`/${locale}/admin/activity`}
                  label="Logs"
                  icon={<span className="icon-park-twotone--log"></span>}
                />
                <NavLink
                  href={`/${locale}/admin/settings`}
                  label="Settings"
                  icon={
                    <span className="icon-park-outline--setting-one"></span>
                  }
                />
              </ul>
            )}
          </div>
          <LogOutButton />
        </section>
      )}
    </div>
  );
};
