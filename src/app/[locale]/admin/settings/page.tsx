import AdminSettings from "@/components/AdminSettings";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export default async function AdminSettingsPage() {
  const session = await auth();

  const isAdmin = session?.user.isAdmin;
  const t = await getTranslations("Common");

  if (!isAdmin) return <p>{t("accessDenied")}</p>;

  const units = await db.unit.findMany({});
  const categories = await db.category.findMany({});

  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium underline">{t("settings")}</h1>
      </div>
      <AdminSettings units={units} categories={categories} />
    </>
  );
}
