"use client";

import { useLocale } from "@/lib/useLocale";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const LogOutButton = () => {
  const t = useTranslations("Common");

  return <button onClick={() => signOut()}>{t("signOut")}</button>;
};

export const DashboardMenuLink = () => {
  const locale = useLocale();
  const t = useTranslations("Common");

  return (
    <p className="text-xs font-extralight">
      {t("backTo")} <Link href={`/${locale}`}>{t("dashboardMenu")}</Link>
    </p>
  );
};

export const ServiceLink = () => {
  const locale = useLocale();
  // const t = useTranslations("Common");

  return (
    <Link
      className="menu-active-hover pill-active px-3 py-2 rounded-lg "
      href={`/${locale}/service`}
    >
      {/* <span className=" pill-active  rounded-lg h-fit w-fit"> */}
      <svg
        width="24"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#05df72"
        stroke-width="1.5"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
      {/* </span> */}
      {/* <span>{t("servicesDashboard")}</span> */}
    </Link>
  );
};
export const SupplierLink = () => {
  const locale = useLocale();
  // const t = useTranslations("Common");

  return (
    <Link
      className="menu-active-hover pill-active px-3 py-2 rounded-lg"
      href={`/${locale}/supply`}
    >
      {/* <span className="p-2 pill-active h-fit rounded-lg"> */}
      <svg
        width="32"
        // height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#378ADD"
        stroke-width="1.5"
      >
        <rect x="1" y="3" width="15" height="13" rx="1"></rect>
        <path d="M16 8h4l3 3v5h-7V8z"></path>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
      {/* </span> */}
      {/* <span>{t("suppliersDashboard")}</span> */}
    </Link>
  );
};
export const AdminLink = () => {
  const locale = useLocale();
  const t = useTranslations("Common");

  return (
    <Link
      className="menu-active-hover pill-active px-3 py-2 rounded-lg"
      href={`/${locale}/admin`}
    >
      <span>{t("adminDashboard")}</span>
    </Link>
  );
};
