import { getSupplierActivityLogs } from "@/app/actions/logs";
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SupplierLogs } from "@/components/ActivityLogs";

export default async function ActivityLogs() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

  const logs = await getSupplierActivityLogs(session.user.supplierId);

  return (
    <div className="logs-section flex flex-col gap-4 w-full">
      <div className="log-title">
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <p className="text-md font-extralight">
          Monitor all system activities and events
        </p>
      </div>

      {!logs || logs.length === 0 ? (
        <p>No logs found...</p>
      ) : (
        <SupplierLogs logs={logs} />
      )}
    </div>
  );
}
