"use client";

import Link from "next/link";
import { StockItemDeleteButton } from "./DeleteButton";
import {
  OrderWithStockItems,
  PurchaseWithItems,
  SaleWithItems,
  SupplierSaleWithItems,
} from "@/types/types";
import { Expense, Order, OrderItem, Sale } from "@/generated/prisma/client";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

type ProductsStockProps = {
  id: string;
  name: string;
  price: number;
  stock: number;
  stockQty: number;
  unit: string;
};
type ProductsProps = {
  id: string;
  name: string;
  price: number;
};

type SupplierProductsProps = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export const ListStockItem = ({
  id,
  name,
  price,
  stock,
}: // stockQty,
// unit,
ProductsStockProps) => {
  const { locale } = useParams();

  const getStockIndicator = (stock: number) => {
    if (stock === 0)
      return { dot: "bg-red-500", text: "text-red-500", label: "Esgotado" };
    if (stock <= 5)
      return {
        dot: "bg-amber-400",
        text: "text-amber-400",
        label: "Stock baixo",
      };
    return { dot: "bg-emerald-500", text: "text-emerald-500", label: null };
  };

  const indicator = getStockIndicator(stock);

  return (
    <li key={id} className="listing-stock-item flex p-4 justify-between">
      <div className="flex  gap-4 justify-between ">
        <Link href={`/${locale}/service/stock/${id}`}>
          <h3 className="text-md font-medium">{name}</h3>
        </Link>
      </div>
      <div className="flex flex-col items-end gap-1">
        <h4 className="text-md font-bold  text-nowrap">MZN {price},00</h4>
        <div className="flex items-center gap-2">
          <span
            className={`span-dot w-2 h-2 rounded-full ${indicator.dot} shrink-0`}
          />
          <p className={`text-xs font-light ${indicator.text}`}>
            Stock: {stock}
            {indicator.label && (
              <span className="ml-1 opacity-75">· {indicator.label}</span>
            )}
          </p>
          {/* <p className="text-sm font-light">
            Quantity: {stockQty} {unit}
          </p> */}
        </div>
      </div>
    </li>
  );
};
export const ListItem = ({ id, name, price }: ProductsProps) => {
  const { locale } = useParams();

  return (
    <li key={id} className="listing-item flex items-center p-4 justify-between">
      {/* <div className="flex flex-col gap-4 justify-between "> */}
      <Link href={`/${locale}/service/products/${id}`}>
        <h3 className="text-md font-medium">{name}</h3>
      </Link>
      {/* </div> */}
      {/* <div className="flex flex-col items-end gap-2"> */}
      <h4 className="text-md font-bold text-nowrap ">MZN {price},00</h4>
      {/* </div> */}
    </li>
  );
};
export const ListDrinkItem = ({ id, name, price }: ProductsProps) => {
  const { locale } = useParams();

  return (
    <li key={id} className="flex gap-4 justify-between py-1">
      <Link href={`/${locale}/service/products/${id}`}>
        <h4 className="text-md font-light hover:underline">{name}</h4>
      </Link>
      <h4 className="text-md font-semibold  text-nowrap">MZN {price},00</h4>
    </li>
  );
};
export const ListSupplierItem = ({
  id,
  name,
  price,
  qty,
}: SupplierProductsProps) => {
  const { locale } = useParams();

  return (
    <li key={id} className="supplier-item flex p-4 justify-between">
      <div className="supplier-item-title flex gap-4 justify-between items-center ">
        <Link href={`/${locale}/supply/products/${id}`}>
          <h3 className="text-lg font-medium">{name}</h3>
        </Link>
        <span className="text-sm font-light">Qty: {qty}</span>
      </div>
      <div className="supplier-item-details flex items-center gap-5">
        <h4 className="text-xl font-bold  text-nowrap">MZN {price},00</h4>
        <div className="flex gap-2">
          <StockItemDeleteButton stockItemId={id} />
          <Link
            className="edit-button p-2 flex "
            href={`/${locale}/supply/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div>
      </div>
    </li>
  );
};

export const PurchaseListItem = ({
  purchases,
}: {
  purchases: PurchaseWithItems;
}) => {
  const t = useTranslations("Common");
  // const pt = useTranslations("Purchases");
  return (
    <li
      key={purchases.id}
      className="list-purchases flex flex-col gap-5 w-full"
    >
      <div className="purchase-header flex justify-between">
        <div className="purchase-title flex flex-col justify-between gap-2">
          {/* <h3 className="flex flex-col gap-2 text-xl font-medium">
            {pt("purchase")}
          </h3> */}
          <p className="text-xs font-light opacity-65">
            #{purchases.id.slice(0, 6)}...
          </p>
          <div className="purchase-title-details flex gap-4">
            {/* <span className="flex items-center">
                <span className="formkit--date"></span>
              </span> */}
            <p className="text-xs font-light">
              {purchases.timestamp.toLocaleDateString(undefined, {
                day: "2-digit",
                month: "2-digit",
              })}{" "}
              ,{" "}
              {purchases.timestamp.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {purchases.PurchaseItem.length > 1 && (
              <p className="text-sm font-light">
                {purchases.PurchaseItem.length} {t("items")}
              </p>
            )}
          </div>
          <p className="text-xs font-light">{purchases.paymentType}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p>{t("totalAmount")}</p>
          <h4 className="text-lg font-bold text-nowrap">
            MZN {purchases.total.toFixed(2)}
          </h4>
        </div>
      </div>
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
          {purchases.PurchaseItem.map((i) => (
            <tr key={i.id}>
              <td>{i.stock}</td>
              <td>{i.stockItem?.name ?? i.item?.name}</td>
              <td className="unit-cost">MZN {i.price}.00</td>
              <td>MZN {i.totalCost}.00</td>
            </tr>
          ))}
        </tbody>
      </table>
    </li>
  );
};

export const OrderListItem = ({
  order,
}: {
  order: Order & {
    orderItems: OrderItem[];
  };
}) => {
  const { locale } = useParams();
  const t = useTranslations("Common");
  const ot = useTranslations("Orders");

  const totalItemsOrdered = order.orderItems.reduce(
    (itemAcc, item) => itemAcc + item.orderedQty,
    0,
  );

  return (
    <li key={order.id} className="list-orders flex justify-between">
      <div className="flex flex-col gap-5">
        <div className="flex gap-4">
          <div className="order-header flex flex-col gap-2">
            <Link href={`/${locale}/service/purchases/orders/${order.id}`}>
              <h3 className="order-title flex flex-col gap-1 text-xl font-medium">
                {ot("order")}
                <p className="text-xs font-light opacity-65">
                  #{order.id.slice(0, 6)}...
                </p>
              </h3>
            </Link>
            <div className="order-info flex items-center">
              {/* <span className="flex items-center">
                <span className="formkit--date"></span>
              </span> */}
              <p className="text-xs font-light">
                {order.timestamp.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                })}
                ,{" "}
                {order.timestamp.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-2 text-xs font-light">
            <div className="order-status">
              <button
                disabled
                className={`${
                  order.status === "DELIVERED" ? "text-green-400" : ""
                }`}
              >
                {t(order.status.toLocaleLowerCase()).toUpperCase()}
              </button>
            </div>
            <p className="">
              {totalItemsOrdered} {t("items")}
            </p>
          </div>
        </div>
        {order.status === "DRAFT" ||
          (order.status === "SUBMITTED" && (
            <div className="delivery-window flex flex-col gap-2">
              <p className="text-sm font-light">
                {t("requestedDeliveryWindow")}
              </p>
              <div className=" flex gap-2">
                <p className="text-md font-medium">
                  {order.requestedStartDate.toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </p>
                -
                <p className="text-md font-medium">
                  {order.requestedEndDate.toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className="order-amount text-end self-end">
        <p className="text-sm ">{ot("orderAmount")}</p>
        <h4 className="text-lg font-semibold  text-nowrap">
          MZN {order.total.toFixed(2)}
        </h4>
      </div>
    </li>
  );
};

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
      {/* <div className="sale-header flex justify-between"> */}
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

export const DashSaleListItem = ({ sale }: { sale: Sale }) => {
  const t = useTranslations("Common");
  const st = useTranslations("Sales");

  return (
    <li
      key={sale.id}
      className="list-orders flex flex-col gap-2 justify-between"
    >
      <div className="sale-header flex justify-between">
        <div className="sale-title flex flex-col gap-2">
          <h3 className="flex gap-2 items-center ">
            {st("sale")}
            <p className="text-sm font-light ">#{sale.id.slice(0, 6)}...</p>
          </h3>
          <div className="sale-title-details flex gap-4">
            <div className="flex gap-2 items-center">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {new Date(sale.timestamp).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                })}{" "}
                ,{" "}
                {new Date(sale.timestamp).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>{t("totalAmount")}</p>
          <h4 className="text-lg font-bold  text-nowrap">
            MZN {sale.total.toFixed(2)}
          </h4>
        </div>
      </div>
    </li>
  );
};

export const ExpenseListItem = ({ expense }: { expense: Expense }) => {
  const t = useTranslations("Common");
  const et = useTranslations("Expenses");

  return (
    <li
      key={expense.id}
      className="list-orders flex flex-col gap-2 justify-between"
    >
      <div className="sale-header flex justify-between">
        <div className="expense-title flex  flex-col gap-1 justify-between">
          <h3 className="flex gap-2 items-center text-lg font-medium">
            {et("expense")}:
            <p className="text-sm font-light ">{expense.description}</p>
          </h3>
          <div className="expense-title-details flex gap-4">
            <p className="text-xs font-light">
              {expense.timestamp.toLocaleDateString(undefined, {
                day: "2-digit",
                month: "2-digit",
              })}{" "}
              ,{" "}
              {expense.timestamp.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-xs font-light">{expense.paymentMethod}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p>{t("totalAmount")}</p>
          <h4 className="text-lg font-bold  text-nowrap">
            MZN {expense.amount.toFixed(2)}
          </h4>
        </div>
      </div>
    </li>
  );
};

export const SupplierSaleListItem = ({
  sale,
}: {
  sale: SupplierSaleWithItems;
}) => {
  const t = useTranslations("Common");
  const st = useTranslations("Sales");

  const totalSoldItems = sale.SaleItem.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  return (
    <li
      key={sale.id}
      className="list-orders flex flex-col gap-2 justify-between"
    >
      <div className="sale-header flex justify-between">
        <div className="supplier-sale-title flex flex-col gap-2">
          <h3 className="flex gap-2 items-center text-xl font-medium">
            {st("sale")}
            <p className="text-sm font-light ">#{sale.id.slice(0, 6)}...</p>
          </h3>
          <div className="sale-title-details flex gap-4">
            <div className="flex gap-2">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
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
              <div className="sale-items-details flex  items-center gap-2">
                <span className="flex items-center">
                  <span className="fluent--box-16-regular"></span>
                </span>
                <p className="text-sm font-light">
                  {sale.SaleItem.length} {t("items")}
                </p>
              </div>
            )}
            <p className="text-sm font-light">
              {totalSoldItems} {t("items")}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>{t("totalAmount")}</p>
          <h4 className="text-lg font-bold  text-nowrap">
            MZN {sale.total.toFixed(2)}
          </h4>
          <p className="text-sm font-light">
            {t("paymentType")}: {sale.paymentType}
          </p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>{t("item")}</th>
            <th>{t("qty")}</th>
            <th className="unit-cost">{t("unitCost")}</th>
            <th>{t("total")}</th>
          </tr>
        </thead>
        <tbody>
          {sale.SaleItem.map((i) => (
            <tr key={i.id}>
              <td>{i.stockItem?.name}</td>
              <td>{i.quantity}</td>
              <td className="unit-cost">MZN {i.price}.00</td>
              <td>MZN {i.quantity * i.price}.00</td>
            </tr>
          ))}
        </tbody>
      </table>
    </li>
  );
};

export default function LogListItem({
  id,
  actionType,
  entityType,
  description,
  timestamp,
  severity,
}: {
  id: string;
  actionType: string;
  entityType: string;
  description: string;
  timestamp: Date;
  severity: string;
}) {
  const { locale } = useParams();
  const t = useTranslations("Common");

  return (
    <li className="list-logs flex justify-between ">
      <div className="flex flex-col gap-2">
        <div className="log-info flex gap-2 items-center">
          <span className="text-xs text-gray-400 text-wrap">{actionType}</span>
          <span className="text-xs text-blue-400">
            {entityType.toUpperCase()}
          </span>
        </div>
        <p className="log-desc text-sm ">{description}</p>
        <div className="log-date flex gap-2 items-center">
          <p className="font-extralight text-gray-400 text-xs">
            {timestamp.toLocaleDateString(undefined, {
              day: "2-digit",
              month: "2-digit",
            })}
          </p>
          <p className="font-extralight text-gray-400 text-xs">
            {timestamp.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <div>
        <div className="severity-logs  flex gap-2 p-1 text-xs font-extralight">
          <span>{severity}</span>
          <Link href={`/${locale}/service/logs/${id}`}>{t("view")}</Link>
        </div>
      </div>
    </li>
  );
}
export function SupplierLogListItem({
  id,
  actionType,
  entityType,
  description,
  timestamp,
  severity,
}: {
  id: string;
  actionType: string;
  entityType: string;
  description: string;
  timestamp: Date;
  severity: string;
}) {
  const { locale } = useParams();
  const t = useTranslations("Common");
  const st = useTranslations("Status");

  return (
    <li className="list-logs flex justify-between ">
      <div className="flex flex-col gap-2">
        <div className="log-info flex gap-2 items-center">
          <span className="text-xs text-gray-400">
            {st(actionType.toLocaleLowerCase())}
          </span>
          <span className="text-xs text-blue-400">
            {st(entityType.toLocaleLowerCase())}
          </span>
        </div>
        <p className="log-desc ">{description}</p>
        <div className="log-date flex gap-2 items-center">
          <p className="font-extralight text-gray-400 text-xs">
            {timestamp.toLocaleDateString(undefined, {
              day: "2-digit",
              month: "2-digit",
            })}
          </p>
          <p className="font-extralight text-gray-400 text-xs">
            {timestamp.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <div>
        <div className="severity-logs  flex gap-2 p-1 text-xs font-extralight">
          <span
            className={
              severity === "INFO" ? "text-blue-400" : "text-yellow-400"
            }
          >
            {severity}
          </span>
          <Link href={`/${locale}/supply/logs/${id}`}>{t("view")}</Link>
        </div>
      </div>
    </li>
  );
}

export const SupplierOrderListItem = ({
  order,
}: {
  // order: SupplierOrderWithOrderAndDeliveries;
  order: OrderWithStockItems;
  // supplierOrder: SupplierOrderWithOrderAndItems;
}) => {
  const { locale } = useParams();
  const ot = useTranslations("Orders");
  const t = useTranslations("Common");

  const totalItemsOrdered = order.orderItems.reduce(
    (itemAcc, item) => itemAcc + item.orderedQty,
    0,
  );
  const delivery = order?.delivery;
  // console.log(delivery);
  return (
    <li key={order.id} className="list-orders header-p-o flex justify-between">
      <div className="flex flex-col gap-5">
        <div className="order-header flex flex-col gap-2">
          <Link
            href={`/${locale}/supply/orders/${order.id}`}
            className="flex items-center gap-2"
          >
            <h3 className="order-title  text-xl font-medium">{ot("order")}</h3>
            <p className="text-xs font-light">#{order.id.slice(0, 6)}...</p>
          </Link>
          <div className="order-info flex items-center gap-4">
            <div className="flex gap-2 items-center">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {order?.timestamp.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                })}
                ,{" "}
                {order?.timestamp.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
        {order?.status === "DELIVERED" ? (
          <div>
            <p>{order.Service?.businessName}</p>
            <div className="flex">
              <p className="text-sm font-light text-green-400">
                {order.status}
              </p>
            </div>
          </div>
        ) : order.status === "CONFIRMED" && delivery ? (
          <div className="text-md font-medium">
            <p className="text-sm font-light">{t("deliveredAt")}: </p>
            <div className="flex gap-1 text-md font-medium">
              <p>
                {order?.delivery.deliveredAt?.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                })}
                ,
              </p>
              <p>
                {order?.delivery.deliveredAt?.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ) : order.status === "CANCELLED" ? (
          ""
        ) : (
          <div className="delivery-window flex flex-col gap-2">
            <p className="text-sm font-light">
              {order?.Service?.businessName} - {ot("requestedDeliveryWindow")}
            </p>
            <div className=" flex gap-2">
              <p className="text-md font-medium">
                {order?.requestedStartDate.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </p>
              -
              <p className="text-md font-medium">
                {order?.requestedEndDate.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="order-status flex flex-col justify-between">
        <div className="flex flex-col gap-2 items-end">
          <button disabled className="text-xs">
            {order.status}
          </button>
          <div className="flex items-center gap-2 text-sm font-light">
            <span className="flex items-center">
              <span className="fluent--box-16-regular"></span>
            </span>
            {totalItemsOrdered}
            <p className="">{t("items")}</p>
          </div>
        </div>
        <div className="order-amount text-end">
          <p className="text-sm ">{ot("orderAmount")}</p>
          <h4 className="text-lg font-bold  text-nowrap">
            MZN {order?.total.toFixed(2)}
          </h4>
        </div>
      </div>
    </li>
  );
};
