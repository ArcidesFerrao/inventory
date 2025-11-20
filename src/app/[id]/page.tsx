import { LogOutButton } from "@/components/LogOutButton";
import { db } from "@/lib/db";
import authCheck from "@/lib/authCheck";
import { redirect } from "next/navigation";
import UserProfile from "@/components/UserProfile";
type Params = Promise<{ id: string }>;

export default async function UserPage(props: { params: Params }) {
  const session = await authCheck();

  if (!session) {
    redirect("/login");
  }

  const { id } = await props.params;

  const user = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      Service: true,
      Supplier: true,
    },
  });

  if (!user) {
    return (
      <section className="user-page flex flex-col items-center">
        <p>User not found</p>
      </section>
    );
  }

  return (
    <section className="user-page flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">{user.name}</h2>
          <p className="text-xs font-extralight">
            User Id: {id.slice(0, 5)}...{" "}
          </p>
        </div>
        <LogOutButton />
      </div>
      <UserProfile user={user} />
    </section>
  );
}
