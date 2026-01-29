import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("Common");

  return (
    <footer className=" items-center text-center">
      <p className="font-thin text-xs">© 2025 {t("footer")}</p>
    </footer>
  );
};
