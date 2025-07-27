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
    <main className="">
      <div>
        <h1>Welcome to Innovante</h1>
        <p>Please login to continue!</p>
      </div>
      <Link href="/api/auth/signin">Login</Link>
    </main>
  );
}
