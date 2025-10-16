import Link from "next/link";
import React from "react";
import { SupplierProductDeleteButton } from "./DeleteButton";
import {
  OrderWithSupplierOrders,
  PurchaseWithItems,
  SaleWithItems,
  SupplierOrderWithOrderAndItems,
} from "@/types/types";

type ProductsStockProps = {
  id: string;
  name: string;
  price: number;
  stock: number;
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
}: ProductsStockProps) => {
  return (
    <li key={id} className="listing-item flex p-4 justify-between">
      <div className="flex flex-col gap-4 justify-between ">
        <Link href={`/service/products/${id}`}>
          <h3 className="text-lg font-medium">{name}</h3>
        </Link>
        <p className="text-sm font-light">Quantity: {stock}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <h2 className="text-lg font-bold  text-nowrap">MZN {price},00</h2>
        {/* <div className="flex gap-2">
          <DeleteButton productId={id} />
          <Link
            className="edit-button p-2 flex "
            href={`/supply/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div> */}
      </div>
    </li>
  );
};
export const ListItem = ({ id, name, price }: ProductsProps) => {
  return (
    <li key={id} className="listing-item flex p-4 justify-between">
      <div className="flex flex-col gap-4 justify-between ">
        <Link href={`/service/products/${id}`}>
          <h3 className="text-md font-medium">{name}</h3>
        </Link>
      </div>
      <div className="flex flex-col items-end gap-2">
        <h2 className="text-lg font-bold text-nowrap ">MZN {price},00</h2>
        {/* <div className="flex gap-2">
          <DeleteButton productId={id} />
          <Link
            className="edit-button p-2 flex "
            href={`/supply/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div> */}
      </div>
    </li>
  );
};
export const ListDrinkItem = ({ id, name, price }: ProductsProps) => {
  return (
    <li key={id} className="flex gap-4 justify-between py-1">
      <Link href={`/service/products/${id}`}>
        <h4 className="text-md font-light hover:underline">{name}</h4>
      </Link>
      <h2 className="text-md font-semibold  text-nowrap">MZN {price},00</h2>
    </li>
  );
};
export const ListSupplierItem = ({
  id,
  name,
  price,
  qty,
}: SupplierProductsProps) => {
  return (
    <li key={id} className="supplier-item flex p-4 justify-between">
      <div className="flex gap-4 justify-between items-center ">
        <Link href={`/supply/products/${id}`}>
          <h3 className="text-lg font-medium">{name}</h3>
        </Link>
        <span className="text-sm font-light">Qty: {qty}</span>
      </div>
      <div className="flex items-center gap-5">
        <h2 className="text-xl font-bold  text-nowrap">MZN {price},00</h2>
        <div className="flex gap-2">
          <SupplierProductDeleteButton supplierProductId={id} />
          <Link
            className="edit-button p-2 flex "
            href={`/supply/products/${id}/edit`}
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
  return (
    <li
      key={purchases.id}
      className="list-purchases flex flex-col gap-5 w-full"
    >
      <div className="purchase-header flex justify-between">
        <div className="purchase-title flex flex-col gap-2">
          <h3 className="flex gap-2 items-center text-xl font-medium">
            Purchase
            <p className="text-sm font-light ">
              #{purchases.id.slice(0, 6)}...
            </p>
          </h3>
          <div className="title-details flex gap-4">
            <div className="flex gap-2">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {purchases.date.toLocaleDateString()} ,{" "}
                {purchases.date.toLocaleTimeString()}
              </p>
            </div>
            {purchases.PurchaseItem.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="flex items-center">
                  <span className="fluent--box-16-regular"></span>
                </span>
                <p className="text-sm font-light">
                  {purchases.PurchaseItem.length} items
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-light">{purchases.paymentType}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Total Amount</p>
          <h2 className="text-lg font-medium  text-nowrap">
            MZN {purchases.total.toFixed(2)}
          </h2>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Quantity</th>
            <th>Product</th>
            <th>Unit Cost</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {purchases.PurchaseItem.map((i) => (
            <tr key={i.id}>
              <td>{i.stock}</td>
              <td>{i.product?.name}</td>
              <td>MZN {i.unitCost}.00</td>
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
  order: OrderWithSupplierOrders;
}) => {
  const totalItemsOrdered = order.supplierOrders.reduce(
    (supplierAcc, supplierOrder) => {
      return (
        supplierAcc +
        supplierOrder.items.reduce(
          (itemAcc, item) => itemAcc + item.orderedQty,
          0
        )
      );
    },
    0
  );
  return (
    <li key={order.id} className="list-orders flex justify-between">
      <div className="flex flex-col gap-5">
        <div className="order-header flex flex-col gap-2">
          <h3 className="order-title flex gap-2 items-center text-xl font-medium">
            Order
            <p className="text-sm font-light ">#{order.id.slice(0, 6)}...</p>
          </h3>
          <div className="order-info flex items-center gap-4">
            <div className="flex gap-2 items-center">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {order.createdAt.toLocaleDateString()},{" "}
                {order.createdAt.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
        {order.status === "DRAFT" ||
          (order.status === "PLACED" && (
            <div className="delivery-window flex flex-col gap-2">
              <p className="text-sm font-light">Requested Delivery Window</p>
              <div className=" flex gap-2">
                <p className="text-md font-medium">
                  {order.requestedStartDate.toLocaleDateString()}
                </p>
                -
                <p className="text-md font-medium">
                  {order.requestedEndDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
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
            <p className="">items</p>
          </div>
        </div>
        <div className="order-amount text-end py-2">
          <p className="text-sm ">Order Total</p>
          <h2 className="text-lg font-semibold  text-nowrap">
            MZN {order.total.toFixed(2)}
          </h2>
        </div>
      </div>
    </li>
  );
};

export const SaleListItem = ({ sale }: { sale: SaleWithItems }) => {
  return (
    <li
      key={sale.id}
      className="list-orders flex flex-col gap-2 justify-between"
    >
      <div className="sale-header flex justify-between">
        <div className="sale-title flex flex-col gap-2">
          <h3 className="flex gap-2 items-center text-xl font-medium">
            Sale
            <p className="text-sm font-light ">#{sale.id.slice(0, 6)}...</p>
          </h3>
          <div className="title-details flex gap-4">
            <div className="flex gap-2">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {sale.date.toLocaleDateString()} ,{" "}
                {sale.date.toLocaleTimeString()}
              </p>
            </div>
            {sale.SaleItem.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="flex items-center">
                  <span className="fluent--box-16-regular"></span>
                </span>
                <p className="text-sm font-light">
                  {sale.SaleItem.length} items
                </p>
              </div>
            )}
            <div className="flex items-center">
              <p className="text-sm font-light">{sale.paymentType}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Total Amount</p>
          <h2 className="text-lg font-medium  text-nowrap">
            MZN {sale.total.toFixed(2)}
          </h2>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Quantity</th>
            <th>Product</th>
            <th>Unit Cost</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.SaleItem.map((i) => (
            <tr key={i.id}>
              <td>{i.quantity}</td>
              <td>{i.product?.name}</td>
              <td>MZN {i.price}.00</td>
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
  return (
    <li className="list-logs flex justify-between ">
      <div className="flex flex-col gap-2">
        <div className="log-info flex gap-2 items-center">
          <span className="text-xs text-gray-400">{actionType}</span>
          <span className="text-xs text-blue-400">
            {entityType.toUpperCase()}
          </span>
        </div>
        <p className="log-desc ">{description}</p>
        <div className="log-date flex gap-2 items-center">
          <p className="font-extralight text-gray-400 text-xs">
            {timestamp.toLocaleDateString()}
          </p>
          <p className="font-extralight text-gray-400 text-xs">
            {timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div>
        <div className="severity-logs  flex gap-2 p-1 text-xs font-extralight">
          <span>{severity}</span>
          <Link href={`/service/logs/${id}`}>View</Link>
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
  return (
    <li className="list-logs flex justify-between ">
      <div className="flex flex-col gap-2">
        <div className="log-info flex gap-2 items-center">
          <span className="text-xs text-gray-400">{actionType}</span>
          <span className="text-xs text-blue-400">
            {entityType.toUpperCase()}
          </span>
        </div>
        <p className="log-desc ">{description}</p>
        <div className="log-date flex gap-2 items-center">
          <p className="font-extralight text-gray-400 text-xs">
            {timestamp.toLocaleDateString()}
          </p>
          <p className="font-extralight text-gray-400 text-xs">
            {timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div>
        <div className="severity-logs  flex gap-2 p-1 text-xs font-extralight">
          <span>{severity}</span>
          <Link href={`/supply/logs/${id}`}>View</Link>
        </div>
      </div>
    </li>
  );
}

export const SupplierOrderListItem = ({
  supplierOrder,
}: {
  supplierOrder: SupplierOrderWithOrderAndItems;
}) => {
  const totalItemsOrdered = supplierOrder.items.reduce(
    (itemAcc, item) => itemAcc + item.orderedQty,
    0
  );
  return (
    <li key={supplierOrder.id} className="list-orders flex justify-between">
      <div className="flex flex-col gap-5">
        <div className="order-header flex flex-col gap-2">
          <Link
            href={`/supply/orders/${supplierOrder.id}`}
            className="flex items-center gap-2"
          >
            <h3 className="order-title  text-xl font-medium">Order</h3>
            <p className="text-xs font-light">
              #{supplierOrder.id.slice(0, 6)}...
            </p>
          </Link>
          <div className="order-info flex items-center gap-4">
            <div className="flex gap-2 items-center">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {supplierOrder.order?.createdAt.toLocaleDateString()},{" "}
                {supplierOrder.order?.createdAt.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
        <div className="delivery-window flex flex-col gap-2">
          <p className="text-sm font-light">
            {supplierOrder.order?.Service?.businessName} - Requested Delivery
            Window
          </p>
          <div className=" flex gap-2">
            <p className="text-md font-medium">
              {supplierOrder.order?.requestedStartDate.toLocaleDateString()}
            </p>
            -
            <p className="text-md font-medium">
              {supplierOrder.order?.requestedEndDate.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className="order-status flex flex-col justify-between">
        <div className="flex flex-col gap-2 items-end">
          <button disabled className="text-xs">
            {supplierOrder.status}
          </button>
          <div className="flex items-center gap-2 text-sm font-light">
            <span className="flex items-center">
              <span className="fluent--box-16-regular"></span>
            </span>
            {totalItemsOrdered}
            <p className="">items</p>
          </div>
        </div>
        <div className="order-amount text-end">
          <p className="text-sm ">Order Total</p>
          <h2 className="text-lg font-semibold  text-nowrap">
            MZN {supplierOrder.order?.total.toFixed(2)}
          </h2>
        </div>
      </div>
    </li>
  );
};
