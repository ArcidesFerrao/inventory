import getActivityLogs from "@/app/actions/logs";
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function ActivityLogs() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  const logs = await getActivityLogs(session.user.id);

  return (
    <div>
      <h1>Activity Logs</h1>
      <div>
        {!logs || logs.length === 0 ? (
          <p>No logs found...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Actions</th>
                <th>Descriptions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.timestamp.toLocaleDateString()}</td>
                  <td>{log.user.name}</td>
                  <td>{log.actionType}</td>
                  <td>{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
