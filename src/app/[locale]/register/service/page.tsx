import { ServiceRegisterForm } from "@/components/RegisterForm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

export default async function ServiceRegisterPage() {
  const session = await auth();

  if (!session) redirect("/login");

  const t = await getTranslations("Common");
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-medium">{t("serviceRegister")}</h2>
      <ServiceRegisterForm />
    </div>
  );
}
