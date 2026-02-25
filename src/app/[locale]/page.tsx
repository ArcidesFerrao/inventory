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
    <main className="home-dash flex flex-col items-center gap-4 py-10">
      <h1 className="text-2xl font-semibold text-center">{t("greetings")}</h1>
      {session?.user ? (
        <>
          <p className="font-extralight text-sm">{t("pickDashboard")}</p>
          <DashMenu
            isAdmin={session.user.isAdmin ?? false}
            role={session.user.role}
          />
        </>
      ) : (
        <div className=" flex flex-col text-center gap-4  py-2">
          <p>{a("loginToContinue")}</p>
          <div className="flex gap-5 justify-around p-5">
            <SignInButton label={a("login")} />
            <Link className="login-button w-32 border" href="/signup">
              {a("signUp")}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
