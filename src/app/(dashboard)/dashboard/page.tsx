import authCheck from "@/lib/authCheck";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardPage() {
  const session = await authCheck();

  if (!session) {
    redirect("/login");
  }
  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
    </div>
  );
}
