import DashMenu from "@/components/DashMenu";
import authCheck from "@/lib/authCheck";
import Link from "next/link";

export default async function Home() {
  const session = await authCheck();

  if (session?.user) {
  }

  return (
    <main className="flex flex-col items-center gap-4 py-10">
      <h1 className="text-2xl font-semibold">Welcome to Innovante</h1>
      {session?.user ? (
        <DashMenu />
      ) : (
        <div className=" flex flex-col text-center gap-4  py-2">
          <p>Please login to continue!</p>
          <Link className="login-button" href="/api/auth/signin">
            Login
          </Link>
        </div>
      )}
    </main>
  );
}
