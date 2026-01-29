"use client";

import { markAllAsRead } from "@/lib/actions/notifications";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function MarkAsRead({ userId }: { userId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const markAsRead = () => {
    startTransition(() => {
      markAllAsRead(userId);
      router.refresh();
    });
  };

  return (
    <button
      className="fixed right-20 flex items-center gap-2"
      onClick={markAsRead}
      disabled={isPending}
    >
      <span className="fluent--mail-read-32-regular"></span>
      {isPending ? "Marking..." : "Mark all as read"}
    </button>
  );
}
