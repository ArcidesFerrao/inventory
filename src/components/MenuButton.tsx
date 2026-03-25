"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HomeNavLink, NavLink } from "./NavLink";
import { NotificationBell } from "./Bell";
import { LogOutButton } from "./LogOutButton";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitches";

export const MenuButton = ({
  userId,
  userName,
  count,
}: {
  userId?: string | null;
  userName?: string | null;
  count: number;
}) => {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "pt";
  const t = useTranslations("Common");

  const [showMenu, setShowMenu] = useState(false);

  const closeMenu = () => setShowMenu(false);
  return (
    <div className="nav-menu-btn absolute z-10 top-8  right-4">
      {!showMenu ? (
        <div className="flex gap-4 items-center">
          <div className="flex text-md items-center">
            <LocaleSwitcher />
          </div>
          <NotificationBell locale={locale} count={count} />
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
              <p className="header-welcome text-wrap">
                {t("greeting")},{" "}
                <Link href={`/${locale}/${userId}`}>{userName}</Link>
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
                  onClick={() => setShowMenu(false)}
                  label={t("dashboard")}
                />
                <NavLink
                  href={`/${locale}/supply/products`}
                  label="Stock"
                  onClick={closeMenu}
                />
                <NavLink
                  href={`/${locale}/supply/orders`}
                  label={t("orders")}
                  onClick={closeMenu}
                />
                <NavLink
                  href={`/${locale}/supply/logs`}
                  label={t("logs")}
                  onClick={closeMenu}
                />
                <NavLink
                  href={`/${locale}/supply/settings`}
                  label={t("settings")}
                  onClick={closeMenu}
                />
              </ul>
            )}
            {pathname.startsWith(`/${locale}/service`) && (
              <ul className="flex flex-col gap-2">
                <HomeNavLink
                  href={`/${locale}/service`}
                  label={t("dashboard")}
                  onClick={closeMenu}
                />
                <NavLink
                  href={`/${locale}/service/products`}
                  label={t("items")}
                  onClick={closeMenu}
                />
                <NavLink
                  href={`/${locale}/service/purchases`}
                  label={t("purchases")}
                  onClick={closeMenu}
                />
                <NavLink
                  href={`/${locale}/service/sales`}
                  onClick={closeMenu}
                  label={t("sales")}
                />
                <NavLink
                  href={`/${locale}/service/expenses`}
                  label={t("expenses")}
                  onClick={closeMenu}
                />
                <NavLink
                  href={`/${locale}/service/logs`}
                  label={t("logs")}
                  onClick={closeMenu}
                />
                <NavLink
                  href={`/${locale}/service/settings`}
                  label={t("settings")}
                  onClick={closeMenu}
                />
              </ul>
            )}
            {pathname.startsWith(`/${locale}/admin`) && (
              <ul className="flex flex-col gap-2">
                <HomeNavLink
                  href={`/${locale}/admin`}
                  label={t("dashboard")}
                  onClick={() => setShowMenu(false)}
                />
                <NavLink
                  href={`/${locale}/admin/users`}
                  onClick={closeMenu}
                  label={t("users")}
                />
                <NavLink
                  href={`/${locale}/admin/products`}
                  label={t("items")}
                  onClick={closeMenu}
                />
                <NavLink
                  href={`/${locale}/admin/orders`}
                  onClick={closeMenu}
                  label={t("orders")}
                />
                <NavLink
                  href={`/${locale}/admin/activity`}
                  onClick={closeMenu}
                  label={t("logs")}
                />
                <NavLink
                  href={`/${locale}/admin/settings`}
                  label={t("settings")}
                  onClick={closeMenu}
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
