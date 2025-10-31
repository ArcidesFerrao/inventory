import { db } from "@/lib/db";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const NotificationBell = (userId: string) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      const unread = await db.notification.count({
        where: { userId, read: false },
      });
      setCount(unread);
    }
    fetchCount();
  }, [userId]);

  return (
    <Link href="/notifications" className="relative">
      <svg
        className="w-6 h-6 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V10a6 6 0 10-12 0v4a2.032 2.032 0 01-.595 1.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
};
