"use client";

import { useLocale } from "@/lib/useLocale";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const LogOutButton = () => {
  const locale = useLocale();
  const t = useTranslations("Common");

  return (
    <div className="logout-button flex flex-col gap-2">
      <button onClick={() => signOut()}>{t("signOut")}</button>
      <p className="text-xs font-extralight">
        {t("backTo")} <Link href={`/${locale}`}>{t("dashboardMenu")}</Link>
      </p>
    </div>
  );
};
