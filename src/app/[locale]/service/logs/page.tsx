import { getActivityLogs } from "@/lib/actions/logs";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Logs } from "@/components/ActivityLogs";
import { getTranslations } from "next-intl/server";

export default async function ActivityLogs() {
  const session = await auth();
  const at = await getTranslations("Activity");

  if (!session?.user) redirect("/login");
  if (!session?.user.serviceId) redirect("/register/service");

  const logs = await getActivityLogs(session.user.serviceId);

  return (
    <div className="logs-section flex flex-col gap-4 w-full">
      <div className="log-title">
        <h1 className="text-2xl font-bold">{at("title")}</h1>
        <p className="text-md font-extralight">{at("subtitle")}</p>
      </div>

      {!logs || logs.length === 0 ? (
        <p>{at("noLogs")}...</p>
      ) : (
        <Logs logs={logs} />
      )}
    </div>
  );
}
