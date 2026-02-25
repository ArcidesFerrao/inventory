import { getAdminUsersStats } from "@/lib/actions/dashboardStats";
import { Card } from "@/components/Card";
import { auth } from "@/lib/auth";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function UsersAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const ct = await getTranslations("Common");

  if (!session?.user.isAdmin) {
    redirect("/");
  }

  const stats = await getAdminUsersStats();

  if (!stats) {
    redirect("/login");
  }

  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium underline">{ct("users")}</h1>
      </div>
      <div className="py-4 flex flex-wrap gap-2 justify-between">
        <Card title={ct("totalUsers")} value={stats.users.totalUsers} />
        <Card title={ct("activeUsers")} value={stats.users.activeUsers} />
        <Card title={ct("suspendedUsers")} value={stats.users.suspendedUsers} />
        <Card title={ct("pendingUsers")} value={stats.users.pendingUsers} />
      </div>
      <div className="admin-users flex flex-col gap-5">
        <h2 className="text-lg font-bold">{ct("usersList")}</h2>
        <table>
          <thead>
            <tr>
              <th>{ct("user")}</th>
              <th>{ct("role")}</th>
              <th>{ct("status")}</th>
              <th>{ct("createdAt")}</th>
            </tr>
          </thead>
          <tbody>
            {stats.users.usersData.map((s) => (
              <tr key={s.id}>
                <td>
                  <Link href={`/${locale}/admin/users/${s.id}`}>{s.name}</Link>
                </td>
                <td>{s.role}</td>
                <td>{s.profileStatus}</td>
                <td>{s.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
