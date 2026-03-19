import DashMenu from "@/components/DashMenu";
import { SignInButton } from "@/components/SignInButton";
import authCheck from "@/lib/authCheck";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Home() {
  const session = await authCheck();
  const t = await getTranslations("Common");
  const a = await getTranslations("Auth");

  return (
    <main className="home-dash flex flex-col items-center gap-4 py-5">
      {session?.user ? (
        <div className="flex flex-col items-center gap-4 py-16 px-4">
          <h1 className="text-2xl font-semibold text-center">
            {t("greetings")}
          </h1>
          <p className="font-extralight text-sm">{t("pickDashboard")}</p>
          <DashMenu
            isAdmin={session.user.isAdmin ?? false}
            role={session.user.role}
          />
        </div>
      ) : (
        /* ── Unauthenticated: landing page ── */
        <div className="flex flex-col w-full gap-5">
          {/* Hero */}
          <div className="flex flex-col items-center text-center w-full gap-4">
            <span className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-full border border-base-content/15 text-base-content/50 ">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              {t("platformTagline")}
            </span>
            <h1 className="text-3xl font-semibold leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-sm font-extralight text-base-content/60 leading-relaxed">
              {t("heroSubtitle")}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="login-button bg-base-content  rounded-lg border w-32"
              >
                {a("signUp")}
              </Link>
              <SignInButton label={a("login")} />
            </div>
          </div>

          {/* Role cards */}
          <div className="px-6  max-w-xl mx-auto w-full">
            <p className="text-xs my-4 text-base-content/40 text-center uppercase tracking-widest">
              {t("chooseProfile")}
            </p>
            <div className="grid grid-cols-2 gap-4 opacity-85">
              {/* Service card */}
              <div className="stats flex flex-col gap-3 p-4 border">
                <div className="w-9 h-9 rounded-lg bg-green-400/10 text-green-400 flex items-center justify-center">
                  <span className="fa7-solid--store" style={{ fontSize: 16 }} />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("serviceRole")}</p>
                  <p className="text-xs text-base-content/50 mt-0.5 leading-relaxed">
                    {t("serviceRoleDesc")}
                  </p>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {[
                    "featureServiceSales",
                    "featureServiceStock",
                    "featureServiceOrders",
                    "featureServiceLogs",
                  ].map((key) => (
                    <li
                      key={key}
                      className="flex items-center gap-2 text-xs text-base-content/60"
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-green-400/15 text-green-400 flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Supplier card */}
              <div className="stats flex flex-col gap-3 p-4 border">
                <div className="w-9 h-9 rounded-lg bg-blue-400/10 text-blue-400 flex items-center justify-center">
                  <span
                    className="solar--delivery-bold"
                    style={{ fontSize: 16 }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("supplierRole")}</p>
                  <p className="text-xs text-base-content/50 mt-0.5 leading-relaxed">
                    {t("supplierRoleDesc")}
                  </p>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {[
                    "featureSupplierDash",
                    "featureSupplierCatalog",
                    "featureSupplierDelivery",
                    "featureSupplierOrders",
                  ].map((key) => (
                    <li
                      key={key}
                      className="flex items-center gap-2 text-xs text-base-content/60"
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-400/15 text-blue-400 flex items-center justify-center text-[9px] font-bold ">
                        ✓
                      </span>
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Features strip */}
          <div className="border-y border-base-content/10 px-6 py-8 max-w-xl mx-auto w-full">
            <p className="text-xs text-base-content/40 text-center uppercase tracking-widest mb-5">
              {t("allIncluded")}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "featDashboard", color: "text-green-400", icon: "↑" },
                { key: "featStock", color: "text-blue-400", icon: "▦" },
                { key: "featRecipes", color: "text-amber-400", icon: "◎" },
                { key: "featLogs", color: "text-purple-400", icon: "≡" },
                { key: "featPeriods", color: "text-orange-400", icon: "⊕" },
                { key: "featReports", color: "text-green-400", icon: "✦" },
              ].map(({ key, color, icon }) => (
                <div key={key} className="stats p-3 flex flex-col gap-1">
                  <span className={`text-sm ${color}`}>{icon}</span>
                  <span className={`text-xs font-medium ${color}`}>
                    {t(`${key}Title`)}
                  </span>
                  <p className="text-xs text-base-content/50 leading-relaxed">
                    {t(`${key}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// <div className=" flex flex-col text-center gap-4  py-2">
//   <p>{a("loginToContinue")}</p>
//   <div className="flex gap-5 justify-around p-5">
//     <SignInButton label={a("login")} />
//     <Link className="login-button w-32 border" href="/signup">
//       {a("signUp")}
//     </Link>
//   </div>
// </div>
