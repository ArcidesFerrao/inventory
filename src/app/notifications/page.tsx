import { NotificationListItem } from "@/components/NotificationItem";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserNotification } from "../actions/notifications";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user.id) redirect("/login");

  const notifications = await getUserNotification(session.user.id);

  return (
    <div className="notifications-page flex flex-col items-center p-4">
      <h1 className="text-xl font-semibold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications available.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {notifications.map((n) => (
            <NotificationListItem key={n.id} n={n} />
          ))}
        </ul>
      )}
    </div>
  );
}
