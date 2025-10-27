import React from "react";

export default function ActivityPage() {
  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium underline">Logs</h1>
      </div>

      <div className="admin-users flex flex-col gap-5">
        <h2 className="text-lg font-bold">Recent Activity</h2>
      </div>
    </>
  );
}
