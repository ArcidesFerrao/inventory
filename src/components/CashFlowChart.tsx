"use client";

import { useTranslations } from "next-intl";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CashFlowChartProps {
  revenue: number;
  purchases: number;
  expenses: number;
  balance: number;
}

export const CashFlowChart = ({
  revenue,
  purchases,
  expenses,
}: CashFlowChartProps) => {
  const t = useTranslations("Common");
  const data = [
    { name: t("revenue"), value: revenue, color: "#90b981" },
    { name: t("purchases"), value: purchases, color: "#f59e0b" },
    { name: t("expenses"), value: expenses, color: "#ef4444" },
  ];

  if (revenue === 0 && purchases === 0 && expenses === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-normal">{t("cashFlowDistribution")}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
            // label={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `MZN ${value.toFixed(2)}`} />
          <Legend layout="vertical" align="right" verticalAlign="top" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
