"use client";

import { useLocale } from "@/lib/useLocale";
import Link from "next/link";
import { usePathname } from "next/navigation";

// type NavLinkProps = {
//   href: string;
//   label: string;
// };
type NavLinkBtnProps = {
  href: string;
  label: string;
  onClick?: () => void;
};

export const NavLink = ({ href, label, onClick }: NavLinkBtnProps) => {
  const pathname = usePathname();
  const locale = useLocale();

  const isActivated = pathname.startsWith(href) && href !== `/${locale}`;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`py-2 px-4 flex items-center gap-2 ${
        isActivated ? "is-active" : ""
      } `}
    >
      <NavDot />

      {/* {icon} */}
      <li className="whitespace-nowrap">{label}</li>
    </Link>
  );
};
export const HomeNavLink = ({ href, label, onClick }: NavLinkBtnProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`py-2 px-4 flex items-center gap-2 ${
        isActive ? "is-active" : ""
      } `}
    >
      <NavDot />
      {/* {icon} */}
      <li className="whitespace-nowrap">{label}</li>
    </Link>
  );
};

const NavDot = () => {
  return <div className="nav-dot"></div>;
};
