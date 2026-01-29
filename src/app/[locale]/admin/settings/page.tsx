import AdminSettings from "@/components/AdminSettings";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminSettingsPage() {
  const session = await auth();

  const isAdmin = session?.user.isAdmin;
  if (!isAdmin) return <p>Access Denied</p>;

  const units = await db.unit.findMany({});
  const categories = await db.category.findMany({});

  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium underline">Settings</h1>
      </div>
      <AdminSettings units={units} categories={categories} />
    </>
  );
}
