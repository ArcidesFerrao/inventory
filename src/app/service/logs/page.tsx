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
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => {
                let parsedDetails:
                  | { name: string; cost: number | null; quantity: number }[]
                  | string = "";
                try {
                  parsedDetails = JSON.parse(log.details?.toString() || "");
                } catch (e) {
                  parsedDetails = log.details?.toString() || "";
                }
                return (
                  <tr key={index}>
                    <td>{log.timestamp.toLocaleDateString()}</td>
                    <td>{log.user.name}</td>
                    <td>{log.actionType}</td>
                    <td>{log.description}</td>
                    <td>
                      {Array.isArray(parsedDetails) &&
                      parsedDetails.length > 0 ? (
                        parsedDetails.map((item, i) => (
                          <li key={i}>
                            {item.name} - MZN {item.cost} x {item.quantity}
                          </li>
                        ))
                      ) : (
                        <pre>{log.details?.toString()}</pre>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
