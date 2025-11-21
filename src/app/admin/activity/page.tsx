import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ActivityPage() {
  const session = await auth()

  if (!session?.user.isAdmin) {
    redirect("/");
  }
  const logs = await db.auditLog.findMany();

  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium underline">Logs</h1>
      </div>

      <div className="admin-users flex flex-col gap-5">
        <h2 className="text-lg font-bold">Recent Activity</h2>
        <ul>
          {logs.map((log) => (
            <li key={log.id} className="flex flex-col gap-2">
              <div className="flex">
                <div>{log.action}</div>
                <div>{log.entityName}</div>
              </div>
              <div>{log.details?.toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
