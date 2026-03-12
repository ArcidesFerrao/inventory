import { SupplierRegisterForm } from "@/components/RegisterForm";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function SupplierRegisterPage() {
  const session = await auth();

  if (!session) redirect("/login");

  const t = await getTranslations("Common");

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-medium">{t("supplierRegister")}</h2>
      <SupplierRegisterForm />
    </div>
  );
}
