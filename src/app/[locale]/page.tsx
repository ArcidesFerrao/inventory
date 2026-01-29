import DashMenu from "@/components/DashMenu";
import authCheck from "@/lib/authCheck";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

// import { useTranslations } from "next-intl";

// export default function LocalePage() {
// const { locale } = await params;
//   const t = useTranslations("Common");

//   return (
//     <div>
//       <h1>Home Page - {t("greetings")}</h1>
//     </div>
//   );
// }

export default async function Home() {
  const session = await authCheck();
  const t = await getTranslations("Common");

  return (
    <main className="home-dash flex flex-col items-center gap-4 py-10">
      {/* <h1 className="text-2xl font-semibold text-center">Welcome to Contela</h1> */}
      <h1 className="text-2xl font-semibold text-center">{t("greetings")}</h1>
      {session?.user ? (
        <>
          <p className="font-extralight text-sm">
            {" "}
            {session.user.role === "USER" ||
            session.user.role === "SERVICE" ||
            session.user.role === "SUPPLIER"
              ? "Go to"
              : "Pick a"}{" "}
            dashboard
          </p>
          <DashMenu
            isAdmin={session.user.isAdmin ?? false}
            role={session.user.role}
          />
        </>
      ) : (
        <div className=" flex flex-col text-center gap-4  py-2">
          <p>Please login/sign up to continue!</p>
          <div className="flex gap-5 p-5">
            <Link className="login-button w-32 border" href="/api/auth/signin">
              Login
            </Link>
            <Link className="login-button w-32 border" href="/signup">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

// export default async function LocalePage({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;

//   return (
//     <div>
//       <h1>Home Page - {locale}</h1>
//     </div>
//   );
// }
