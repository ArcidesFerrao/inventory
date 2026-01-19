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

  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="nav-menu-btn absolute z-10 top-8  right-4">
      {!showMenu ? (
        <div className="flex gap-2">
          <NotificationBell />
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
                Welcome, <Link href={`/${userId}`}>{userName}</Link>
              </p>
              <button
                onClick={() => setShowMenu(false)}
                className="flex items-center"
              >
                <span className="line-md--close"></span>
              </button>
            </div>
            {pathname.startsWith("/supply") && (
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
                  icon={<span className="icon-park-twotone--log"></span>}
                />
                <NavLink
                  href="/supply/settings"
                  label="Settings"
                  icon={
                    <span className="icon-park-outline--setting-one"></span>
                  }
                />
              </ul>
            )}
            {pathname.startsWith("/service") && (
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
                  icon={<span className="bxs--purchase-tag"></span>}
                />
                <NavLink
                  href="/service/sales"
                  label="Sales"
                  icon={<span className="carbon--sales-ops"></span>}
                />
                <NavLink
                  href="/service/expenses"
                  label="Expenses"
                  icon={<span className="mdi--cart-sale"></span>}
                />
                <NavLink
                  href="/service/logs"
                  label="Active Logs"
                  icon={<span className="icon-park-twotone--log"></span>}
                />
                <NavLink
                  href="/service/settings"
                  label="Settings"
                  icon={
                    <span className="icon-park-outline--setting-one"></span>
                  }
                />
              </ul>
            )}
            {pathname.startsWith("/admin") && (
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
                  icon={<span className="icon-park-twotone--log"></span>}
                />
                <NavLink
                  href="/admin/settings"
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
