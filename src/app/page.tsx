import DashMenu from "@/components/DashMenu";
import authCheck from "@/lib/authCheck";
import Link from "next/link";

export default async function Home() {
  const session = await authCheck();

  return (
    <main className="home-dash flex flex-col items-center gap-4 py-10">
      <h1 className="text-2xl font-semibold">
        Welcome to Inventory Management
      </h1>
      {session?.user ? (
        <>
          <p className="font-extralight text-sm">Pick a dashboard</p>
          <DashMenu />
        </>
      ) : (
        <div className=" flex flex-col text-center gap-4  py-2">
          <p>Please login/sign up to continue!</p>
          <Link className="login-button" href="/api/auth/signin">
            Login
          </Link>
        </div>
      )}
    </main>
  );
}
