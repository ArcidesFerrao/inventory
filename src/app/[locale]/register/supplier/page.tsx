import { SupplierRegisterForm } from "@/components/RegisterForm";
import { useTranslations } from "next-intl";

export default function SupplierRegisterPage() {
  const t = useTranslations("Common");

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-medium">{t("supplierRegister")}</h2>
      <SupplierRegisterForm />
    </div>
  );
}
