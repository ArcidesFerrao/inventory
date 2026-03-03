import { ServiceRegisterForm } from "@/components/RegisterForm";
import { useTranslations } from "next-intl";

export default function ServiceRegisterPage() {
  const t = useTranslations("Common");
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-medium">{t("serviceRegister")}</h2>
      <ServiceRegisterForm />
    </div>
  );
}
