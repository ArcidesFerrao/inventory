"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
);

type DataPoint = {
  label: string;
  revenue: number;
  purchases: number;
};

interface RevenueTrendChartProps {
  data: DataPoint[];
}
export default function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data?.length) return;

    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
    const tickColor = isDark ? "#9c9a92" : "#73726c";

    if (chartRef.current) chartRef.current.destroy();

    const netProfit = data.map((d) => d.revenue - d.purchases);

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: "Receita",
            data: data.map((d) => d.revenue),
            borderColor: "#1D9E75",
            backgroundColor: "rgba(29,158,117,0.08)",
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 2,
          },
          {
            label: "Compras",
            data: data.map((d) => d.purchases),
            borderColor: "#EF9F27",
            backgroundColor: "rgba(239,159,39,0.06)",
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 2,
          },
          {
            label: "Lucro Líquido",
            data: netProfit,
            borderColor: "#378ADD",
            backgroundColor: "transparent",
            tension: 0.35,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 1.5,
            borderDash: [4, 3],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "start",
            labels: {
              color: tickColor,
              font: { size: 11 },
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: "circle",
              padding: 16,
            },
          },
          tooltip: {
            backgroundColor: isDark ? "#2c2c2a" : "#ffffff",
            titleColor: isDark ? "#e0ddd4" : "#1a1a18",
            bodyColor: tickColor,
            borderColor: gridColor,
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (ctx) =>
                ` ${ctx.dataset.label}: MZN ${(ctx.parsed.y ?? 0).toFixed(2)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: tickColor,
              font: { size: 11 },
              maxTicksLimit: 10,
            },
            border: { display: false },
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: tickColor,
              font: { size: 11 },
              callback: (v) =>
                "MZN " +
                (Number(v) >= 1000 ? (Number(v) / 1000).toFixed(1) + "k" : v),
            },
            border: { display: false },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  if (!data?.length) return null;
  return (
    <div className="w-full mt-2">
      <canvas ref={canvasRef} />
    </div>
  );
}
