"use client";

import { Period } from "@/types/types";
import { usePathname, useRouter } from "next/navigation";

interface DateFilterProps {
  currentPeriod: Period;
}

export default function DateFilter({ currentPeriod }: DateFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

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
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>
  );
}
