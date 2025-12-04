import { getAdminUsersStats } from "@/app/actions/dashboardStats";
import { Card } from "@/components/Card";
import { auth } from "@/lib/auth";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UsersAdminPage() {
  const session = await auth();

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
        <h1 className="text-4xl font-medium underline">Users</h1>
      </div>
      <div className="py-4 flex flex-wrap gap-2 justify-between">
        <Card title="Total Users" value={stats.users.totalUsers} />
        <Card title="Active Users" value={stats.users.activeUsers} />
        <Card title="Suspended Users" value={stats.users.suspendedUsers} />
        <Card title="Pending Users" value={stats.users.pendingUsers} />
      </div>
      <div className="admin-users flex flex-col gap-5">
        <h2 className="text-lg font-bold">Users List</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {stats.users.usersData.map((s) => (
              <tr key={s.id}>
                <td>
                  <Link href={`users/${s.id}`}>{s.name}</Link>
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
