"use client";

import { useLocale } from "@/lib/useLocale";
import type { UserProfile } from "@/types/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export default function UserProfile({ user }: { user: UserProfile }) {
  const locale = useLocale();
  const t = useTranslations("Common");
  const [view, setView] = useState<"personal" | "detail" | "security">(
    "personal",
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="user-header flex justify-between items-center">
        <div className="profile-sections">
          <button
            onClick={() => setView("personal")}
            className={view === "personal" ? "active-view" : ""}
          >
            {t("personalInformation")}
          </button>
          {user.role === "SERVICE" && user.Service && (
            <button
              onClick={() => setView("detail")}
              className={view === "detail" ? "active-view" : ""}
            >
              {t("serviceDetails")}
            </button>
          )}
          {user.role === "SUPPLIER" && user.Supplier && (
            <button
              onClick={() => setView("detail")}
              className={view === "detail" ? "active-view" : ""}
            >
              {t("supplierDetails")}
            </button>
          )}
          <button
            onClick={() => setView("security")}
            className={view === "security" ? "active-view" : ""}
          >
            {t("security")}
          </button>
        </div>
        {user.role === "SERVICE" && (
          <Link href={`/${locale}/service`}>
            <span>{t("servicesDashboard")}</span>
          </Link>
        )}
        {user.role === "SUPPLIER" && (
          <Link href={`/${locale}/supply`}>
            <span>{t("suppliersDashboard")}</span>
          </Link>
        )}
        {user.role === "ADMIN" && (
          <Link href={`/${locale}/admin`}>
            <span>{t("adminDashboard")}</span>
          </Link>
        )}
      </div>
      {view === "personal" && (
        <div className="personal-section flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p>{t("fullName")}</p>
            <div className="flex items-center gap-2">
              <span className="tdesign--user-filled"></span>
              <h4>{user.name}</h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>{t("emailAddress")}</p>
            <div className="flex items-center gap-2">
              <span className="ic--round-mail"></span>
              <h4>{user.email}</h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>{t("phoneNumber")}</p>
            <div className="flex items-center gap-2">
              <span className="solar--phone-bold"></span>
              <h4>{user.phoneNumber}</h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>{t("memberSince")}</p>
            <div className="flex items-center gap-2">
              <span className="formkit--date"></span>
              <h4>{user.createdAt.toLocaleDateString()}</h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>{t("lastUpdated")}</p>
            <div className="flex items-center gap-2">
              <span className="formkit--date"></span>
              <h4>{user.updatedAt.toLocaleDateString()}</h4>
            </div>
          </div>
        </div>
      )}
      {view === "security" && (
        <div className="security-section flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <p>{t("underConstruction")}...</p>
          </div>
        </div>
      )}
      {view === "detail" && (
        <>
          {user.role === "SUPPLIER" && user.Supplier && (
            <div className="details-section flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <p>{t("companyName")}</p>
                <div className="flex items-center gap-2">
                  <span className="mdi--company"></span>
                  <h4>{user.Supplier.businessName}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>
                  {t("company")} {t("emailAddress")}
                </p>
                <div className="flex items-center gap-2">
                  <span className="ic--round-mail"></span>
                  <h4>{user.Supplier.email}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("address")}</p>
                <div className="flex items-center gap-2">
                  <span className="tdesign--location-filled"></span>
                  <h4>{user.Supplier.address}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>
                  {t("company")} {t("phoneNumber")}
                </p>
                <div className="flex items-center gap-2">
                  <span className="solar--phone-bold"></span>
                  <h4>{user.Supplier.phoneNumber}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("website")}</p>
                <div className="flex items-center gap-2">
                  <span className="streamline-plump--web"></span>
                  <h4>{user.Supplier.website}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("establishedYear")}</p>
                <div className="flex items-center gap-2">
                  <span className="proicons--document"></span>
                  <h4>{user.Supplier.establishedYear}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("description")}</p>
                <div className="flex items-center gap-2">
                  <h4>{user.Supplier.description}</h4>
                </div>
              </div>
            </div>
          )}
          {user.role === "SERVICE" && user.Service && (
            <div className="details-section flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <p>{t("companyName")}</p>
                <h4>{user.Service.businessName}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("address")}</p>
                <h4>{user.Service.location}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("website")}</p>
                <h4>{user.Service.website}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("businessType")}</p>
                <h4>{user.Service.businessType}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("description")}</p>
                <h4>{user.Service.description}</h4>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function AdminUserProfile({ user }: { user: UserProfile }) {
  const t = useTranslations("Common");

  const [view, setView] = useState<"personal" | "detail" | "security">(
    "personal",
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="profile-sections profile-details flex  gap-4">
        <button
          onClick={() => setView("personal")}
          className={view === "personal" ? "active-view" : ""}
        >
          {t("personalInformation")}
        </button>
        <button
          onClick={() => setView("detail")}
          className={view === "detail" ? "active-view" : ""}
        >
          {t("detail")}
        </button>

        <button
          onClick={() => setView("security")}
          className={view === "security" ? "active-view" : ""}
        >
          {t("security")}
        </button>
      </div>
      {view === "personal" && (
        <div className="personal-section flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p>{t("fullName")}</p>
            <div className="flex items-center gap-2">
              <span className="tdesign--user-filled"></span>
              <h4>{user.name}</h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-5">
              <p>{t("emailAddress")}</p>
              <button className="text-xs font-extralight border px-2 py-1">
                {t("verify")}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="ic--round-mail"></span>
              <h4>{user.email}</h4>
            </div>
          </div>
          {user.phoneNumber && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-5">
                <p>{t("phoneNumber")}</p>
                <button className="text-xs font-extralight border px-2 py-1">
                  {t("verify")}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="solar--phone-bold"></span>
                <h4>{user.phoneNumber}</h4>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <p>{t("memberSince")}</p>
            <div className="flex items-center gap-2">
              <span className="formkit--date"></span>
              <h4>{user.createdAt.toLocaleDateString()}</h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>{t("lastUpdated")}</p>
            <div className="flex items-center gap-2">
              <span className="formkit--date"></span>
              <h4>{user.updatedAt.toLocaleDateString()}</h4>
            </div>
          </div>
        </div>
      )}
      {view === "security" && (
        <div className="security-section flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <p>{t("underConstruction")}...</p>
          </div>
        </div>
      )}
      {view === "detail" && (
        <>
          {user.Supplier && (
            <div className="details-section flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex gap-5">
                  <p>{t("companyName")}</p>
                  <button className="text-xs font-extralight border px-2 py-1">
                    {t("approve")}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mdi--company"></span>
                  <h4>{user.Supplier.businessName}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>
                  {t("company")}Company {t("emailAddress")}
                </p>
                <div className="flex items-center gap-2">
                  <span className="ic--round-mail"></span>
                  <h4>{user.Supplier.email}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("address")}</p>
                <div className="flex items-center gap-2">
                  <span className="tdesign--location-filled"></span>
                  <h4>{user.Supplier.address}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>
                  {t("company")}Company {t("phoneNumber")}
                </p>
                <div className="flex items-center gap-2">
                  <span className="solar--phone-bold"></span>
                  <h4>{user.Supplier.phoneNumber}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("website")}Website</p>
                <div className="flex items-center gap-2">
                  <span className="streamline-plump--web"></span>
                  <h4>{user.Supplier.website}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("establishedYear")}</p>
                <div className="flex items-center gap-2">
                  <span className="proicons--document"></span>
                  <h4>{user.Supplier.establishedYear}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("description")}</p>
                <div className="flex items-center gap-2">
                  <h4>{user.Supplier.description}</h4>
                </div>
              </div>
            </div>
          )}
          {user.Service && (
            <div className="details-section flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <p>{t("companyName")}</p>
                <h4>{user.Service.businessName}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("address")}</p>
                <h4>{user.Service.location}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("website")}</p>
                <h4>{user.Service.website}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("establishedYear")}</p>
                <h4>{user.Service.businessType}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("description")}</p>
                <h4>{user.Service.description}</h4>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
