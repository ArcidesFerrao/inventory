"use client";

import { markAllAsRead } from "@/app/actions/notifications";
import { useRouter } from "next/navigation";

export default function MarkAsRead({ userId }: { userId: string }) {
  const router = useRouter();

  const markAsRead = () => {
    markAllAsRead(userId);
    router.refresh();
  };

  return (
    <button
      className="fixed right-20 flex items-center gap-2"
      onClick={markAsRead}
    >
      <span className="fluent--mail-read-32-regular"></span> Mark All as Read
    </button>
  );
}
