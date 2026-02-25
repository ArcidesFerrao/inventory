import { NotificationListItem } from "@/components/NotificationItem";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserNotification } from "@/lib/actions/notifications";
import MarkAsRead from "@/components/MarkAsRead";
import { getTranslations } from "next-intl/server";

export default async function NotificationsPage() {
  const session = await auth();
  const t = await getTranslations("Common");

  if (!session?.user.id) redirect("/login");

  const notifications = await getUserNotification(session.user.id);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-page flex flex-col items-center p-4">
      <div className="relative flex">
        <h1 className="text-xl font-semibold mb-4">{t("notifications")}</h1>
        {unreadCount > 0 && <MarkAsRead userId={session.user.id} />}
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-400">{t("noNotifications")}</p>
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
