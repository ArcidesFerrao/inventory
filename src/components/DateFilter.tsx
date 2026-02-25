"use client";

import { Period } from "@/types/types";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

interface DateFilterProps {
  currentPeriod: Period;
}

export default function DateFilter({ currentPeriod }: DateFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Common");

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const period = e.target.value as Period;
    router.push(`${pathname}?period=${period}`);
  };
  return (
    <div>
      <select
        id="period-select"
        value={currentPeriod}
        onChange={handlePeriodChange}
      >
        <option value="daily">{t("daily")}</option>
        <option value="weekly">{t("weekly")}</option>
        <option value="monthly">{t("monthly")}</option>
      </select>
    </div>
  );
}
