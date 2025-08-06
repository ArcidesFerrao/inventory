import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-col items-center gap-4 py-10">
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold">Welcome to Innovante</h1>
        <p className="py-5">Please login to continue!</p>
      </div>
      <Link className="login-button" href="/api/auth/signin">
        Login
      </Link>
    </main>
  );
}
