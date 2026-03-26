"use client";

import { StockMovement } from "@/generated/prisma/client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const CHANGE_STYLES: Record<string, string> = {
  IN: "bg-green-400/10 text-green-400",
  OUT: "bg-red-400/10 text-red-400",
  PURCHASE: "bg-amber-400/10 text-amber-400",
  SALE: "bg-blue-400/10 text-blue-400",
  ADJUST: "bg-purple-400/10 text-purple-400",
};

export default function StockHistory({ stockItemId }: { stockItemId: string }) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);

  const st = useTranslations("Stock");
  const t = useTranslations("Common");

  useEffect(() => {
    fetch(`/api/stock-movement?stockItemId=${stockItemId}`)
      .then((res) => res.json())
      .then((data) => {
        setMovements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [stockItemId]);

  if (loading)
    return (
      <div className="stats p-4">
        <p className="text-sm text-base-content/50">{st("loadingHistory")}</p>
      </div>
    );

  if (movements.length === 0) {
    return <p>{st("noStockMovement")}</p>;
  }

  return (
    <div className="stats p-4 flex flex-col gap-3">
      <p className="label-text text-xs uppercase tracking-wide">
        {st("stockHistory")}
      </p>

      {movements.length === 0 ? (
        <p className="text-sm text-base-content/50 text-center py-4">
          {st("noStock")}
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-base-content/10">
              <th className="text-left py-2 text-xs font-medium text-base-content/40 uppercase tracking-wide">
                {t("type")}
              </th>
              <th className="text-right py-2 text-xs font-medium text-base-content/40 uppercase tracking-wide">
                {t("quantity")}
              </th>
              <th className="text-left py-2 text-xs font-medium text-base-content/40 uppercase tracking-wide pl-4">
                {t("notes")}
              </th>
              <th className="text-right py-2 text-xs font-medium text-base-content/40 uppercase tracking-wide">
                {t("date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr
                key={movement.id}
                className="border-b border-base-content/10 last:border-0"
              >
                <td className="py-2.5">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${
                      CHANGE_STYLES[movement.changeType] ??
                      "bg-base-content/10 text-base-content/50"
                    }`}
                  >
                    {movement.changeType}
                  </span>
                </td>
                <td
                  className={`py-2.5 text-right font-medium ${
                    movement.quantity > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {movement.quantity > 0 ? "+" : ""}
                  {movement.quantity}
                </td>
                <td className="py-2.5 pl-4 text-base-content/50 text-xs">
                  {movement.notes ?? "—"}
                </td>
                <td className="py-2.5 text-right text-xs text-base-content/40">
                  {new Date(movement.timestamp).toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
