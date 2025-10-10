import React from "react";

export default function ActivityLogs() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p>Total Logs</p>
          <h2>5</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Info</p>
          <h2>4</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Warnings</p>
          <h2>1</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Errors</p>
          <h2>0</h2>
        </div>
      </div>
      <ul>
        <li>
          <div className="flex flex-col gap-2">
            <div className="log-info flex gap-2 items-center">
              <span>ORDER</span>
              <span>UPDATE</span>
            </div>
            <p className="log-desc ">Order status changed do COMFIRMED</p>
            <div className="log-date flex gap-2 items-center">
              <p>Oct 10, 2025</p>
              <p>03:45 PM</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
