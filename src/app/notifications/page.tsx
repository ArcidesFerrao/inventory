import { NotificationListItem } from "@/components/NotificationItem";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) redirect("/login");

  const notifications = await db.notification.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <div className="notifications-page flex flex-col items-center p-4">
      <h1 className="text-xl font-semibold mb-4">Notifications</h1>
      <ul className="flex flex-col gap-2">
        {notifications.map((n) => (
          <NotificationListItem key={n.id} n={n} />
        ))}
      </ul>
    </div>
  );
}
