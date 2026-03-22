"use client";

import { SaleWithItems } from "@/types/types";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const SaleListItem = ({ sale }: { sale: SaleWithItems }) => {
  const t = useTranslations("Common");
  const st = useTranslations("Sales");

  const [open, setOpen] = useState(false);

  const profit = sale.total - sale.cogs;
  const margin = sale.total > 0 ? (profit / sale.total) * 100 : 0;
  const barWidth = Math.min(100, Math.max(0, Math.round(margin)));

  return (
    <li
      key={sale.id}
      className="list-orders flex flex-col gap-2 justify-between"
    >
      <button
        className="sale-header flex justify-between"
        type="button"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="sale-title flex flex-col items-start gap-2">
          <h3 className="flex flex-col gap-1  text-xl font-medium">
            {st("sale")}
            <p className="text-xs font-light ">#{sale.id.slice(0, 6)}...</p>
          </h3>
          <div className="sale-title-details flex gap-4">
            <div className="flex gap-2 items-center">
              <span className="formkit--date"></span>
              <p className="text-xs font-light">
                {sale.timestamp.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                })}{" "}
                ,{" "}
                {sale.timestamp.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {sale.SaleItem.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="flex items-center">
                  <span className="fluent--box-16-regular"></span>
                </span>
                <p className="text-xs font-light">
                  {sale.SaleItem.length} {t("items")}
                </p>
              </div>
            )}
            {/* <p className="text-sm font-light">{sale.paymentType}</p> */}
          </div>
        </div>
        <div className="flex  gap-6 shrink-0">
          {/* Profit + margin bar */}
          <div className="flex flex-col justify-end  gap-3 text-right">
            <p className="text-xs font-light label-text">{t("grossProfit")}</p>
            <div className="flex items-center gap-2 justify-end">
              <p className="text-sm font-medium text-green-400 whitespace-nowrap">
                MZN {profit.toFixed(2)}
              </p>
              <span className="w-10 h-1 bg-base-content/20 rounded-full overflow-hidden inline-block">
                <span
                  className="block h-full bg-green-400 rounded-full"
                  style={{ width: `${barWidth}%` }}
                />
              </span>
              <p className="text-xs text-base-content/40 whitespace-nowrap">
                {margin.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Total */}
          <div className="flex flex-col justify-end gap-1 text-right">
            <span
              className={`text-base-content/40 text-xs flex self-end opacity-30 hover:opacity-75 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
            <p className="text-xs font-light label-text">{t("totalAmount")}</p>
            <h4 className="text-lg font-bold whitespace-nowrap">
              MZN {sale.total.toFixed(2)}
            </h4>
          </div>

          {/* Chevron */}
        </div>
      </button>

      {/* <div className="flex flex-col gap-2">
        <p>{t("totalAmount")}</p>
        <h4 className="text-lg font-bold  text-nowrap">
          MZN {sale.total.toFixed(2)}
        </h4>
      </div> */}
      {/* </div> */}
      {open && (
        <table>
          <thead>
            <tr>
              <th>{t("qty")}</th>
              <th>{t("item")}</th>
              <th className="unit-cost">{t("unitCost")}</th>
              <th>{t("total")}</th>
            </tr>
          </thead>
          <tbody>
            {sale.SaleItem.map((i) => (
              <tr key={i.id}>
                <td>{i.quantity}</td>
                <td>{i.item?.name}</td>
                <td className="unit-cost">MZN {i.price}.00</td>
                <td>MZN {i.quantity * i.price}.00</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </li>
  );
};
