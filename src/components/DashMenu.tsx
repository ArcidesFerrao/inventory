"use client";

import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

export default function DashMenu({
  isAdmin,
  role,
}: {
  isAdmin: boolean;
  role: string | null | undefined;
}) {
  const t = useTranslations("Common");

  return (
    <section className="dash-menu flex gap-5 py-5">
      {/* <button className="p-4" onClick={() => redirect("/stock")}>
        <span className="carbon--dashboard"></span>
        <p>{t("dashboardMenu0")}</p>
      </button> */}
      {(role === "USER" || role === "SERVICE" || role === "ADMIN") && (
        <button className="p-4" onClick={() => redirect("/service")}>
          <span className="fa7-solid--store"></span>
          <p>{t("dashboardMenu1")}</p>
        </button>
      )}
      {(role === "USER" || role === "SUPPLIER" || role === "ADMIN") && (
        <button className="p-4" onClick={() => redirect("/supply")}>
          <span className="solar--delivery-bold"></span>
          <p>{t("dashboardMenu2")}</p>
        </button>
      )}
      {isAdmin === true && (
        <button className="p-4" onClick={() => redirect("/admin")}>
          <span className="eos-icons--admin-outlined"></span>
          <p>{t("dashboardMenu3")}</p>
        </button>
      )}
    </section>
  );
}
