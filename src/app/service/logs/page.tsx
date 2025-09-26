import getActivityLogs from "@/app/actions/logs";
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

type LogItem = {
  id: string;
  name: string;
  quantity: number;
  cost: number;
  price?: number;
};

type ParsedDetails = {
  total: number;
  items: LogItem[];
};

export default async function ActivityLogs() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (!session?.user.serviceId) redirect("/register/service");

  const logs = await getActivityLogs(session.user.serviceId);

  return (
    <div className="logs-section flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold">Activity Logs</h1>

      {!logs || logs.length === 0 ? (
        <p>No logs found...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {/* <th>User</th> */}
              <th>Actions</th>
              <th>Descriptions</th>
              <th>Details</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => {
              const parsedDetails = log.details as ParsedDetails;

              return (
                <tr key={index}>
                  {/* <td>{log.user.name}</td> */}
                  <td>{log.actionType}</td>
                  <td>{log.description}</td>
                  <td>
                    {parsedDetails?.items ? (
                      <ul>
                        {parsedDetails.items.map((item, i) => (
                          <li key={i}>
                            {item.name} - MZN {item.cost} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <pre className="text-gray-700"></pre>
                    )}
                  </td>
                  <td>{log.timestamp.toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
