import { AdminUserProfile } from "@/components/UserProfile";
import authCheck from "@/lib/authCheck";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function AdminUserPage(props: { params: Params }) {
  const session = await authCheck();

  if (!session) {
    redirect("/login");
  }

  const t = await getTranslations("Common");

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
      <section className="user-page flex flex-col items-center w-full">
        <p>{t("userNotFound")}User not found</p>
      </section>
    );
  }

  return (
    <div className="admin-user-page flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">{user?.name}</h2>
          <p className="text-xs font-extralight">
            {t("userId")}User Id: {id.slice(0, 5)}...{" "}
          </p>
        </div>
      </div>
      <AdminUserProfile user={user} />
    </div>
  );
}
