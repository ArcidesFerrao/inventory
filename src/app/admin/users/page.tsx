import { getAdminStats } from "@/app/actions/dashboardStats";
import { Card } from "@/components/Card";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function UsersAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.isAdmin) {
    redirect("/");
  }

  const stats = await getAdminStats();

  if (!stats) {
    redirect("/login");
  }

  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium">Admin Dashboard</h1>
      </div>
      <div className="flex justify-between">
        <Card title="Total Users" value={stats.users.totalUsers} />
        <Card title="Active Users" value={stats.users.activeUsers} />
        <Card title="Suspended Users" value={stats.users.suspendedUsers} />
        <Card title="Pending Users" value={stats.users.pendingUsers} />
      </div>
      <div className="top-services flex flex-col gap-5">
        <h2>Users List</h2>
        <ul className="top-list-admin flex flex-col gap-2 p-4">
          <li className="flex justify-between">
            <h3>User</h3>
            <p>Role</p>
            <p>Status</p>
            <p>Created At</p>
          </li>
          <div>
            {stats.users.usersData.map((s) => (
              <li key={s.id} className="flex justify-between py-1">
                <h3>{s.name}</h3>
                <p>{s.role}</p>
                <p>{s.profileStatus}</p>
                <p>{s.createdAt.toLocaleDateString()}</p>
              </li>
            ))}
          </div>
        </ul>
      </div>
    </>
  );
}
