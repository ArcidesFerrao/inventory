"use client";
import { Notification } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";

export const NotificationListItem = ({ n }: { n: Notification }) => {
  const router = useRouter();
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: n.id }),
    });

    router.refresh();
    router.push(n.link ?? "#");
  };
  return (
    <li key={n.id} className="p-2">
      <a
        href={n.link ?? "#"}
        onClick={handleClick}
        className="notify-list-a flex justify-between items-center gap-4"
      >
        <p className={n.read ? "font-thin" : "font-medium"}>{n.title}</p>
        <p className="text-sm text-gray-400">{n.message}</p>
        <p className="text-sm text-gray-400">
          {n.createdAt.toLocaleDateString()}
        </p>
      </a>
    </li>
  );
};
