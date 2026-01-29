"use client";

import { useLocale } from "@/lib/useLocale";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  icon: ReactNode;
  label: string;
};

export const NavLink = ({ href, icon, label }: NavLinkProps) => {
  const pathname = usePathname();
  const locale = useLocale();

  const isActivated = pathname.startsWith(href) && href !== `/${locale}`;
  return (
    <Link
      href={href}
      className={`py-2 px-6 flex items-center gap-2 ${
        isActivated ? "is-active" : ""
      } `}
    >
      {icon}
      <li className="whitespace-nowrap">{label}</li>
    </Link>
  );
};
export const HomeNavLink = ({ href, icon, label }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`py-2 px-6 flex items-center gap-2 ${
        isActive ? "is-active" : ""
      } `}
    >
      {icon}
      <li className="whitespace-nowrap">{label}</li>
    </Link>
  );
};
