import Link from "next/link";
import { StockItemDeleteButton } from "./DeleteButton";
import {
  OrderWithStockItems,
  PurchaseWithItems,
  SaleWithItems,
  SupplierSaleWithItems,
} from "@/types/types";
import { Expense, Order, OrderItem, Sale } from "@/generated/prisma/client";

type ProductsStockProps = {
  id: string;
  name: string;
  price: number;
  stock: number;
  stockQty: number;
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
  stockQty,
  stock,
}: ProductsStockProps) => {
  return (
    <li key={id} className="listing-stock-item flex p-4 justify-between">
      <div className="flex  gap-4 justify-between ">
        <Link href={`/service/stock/${id}`}>
          <h3 className="text-lg font-medium">{name}</h3>
        </Link>
      </div>
      <div className="flex flex-col items-end gap-1">
        <h2 className="text-lg font-bold  text-nowrap">MZN {price},00</h2>
        <div className="flex gap-2">
          <p className="text-sm font-light">Stock: {stock}</p>
          <p className="text-sm font-light">Quantity: {stockQty}</p>
        </div>
      </div>
    </li>
  );
};
export const ListItem = ({ id, name, price }: ProductsProps) => {
  return (
    <li key={id} className="listing-item flex items-center p-4 justify-between">
      {/* <div className="flex flex-col gap-4 justify-between "> */}
      <Link href={`/service/products/${id}`}>
        <h3 className="text-md font-medium">{name}</h3>
      </Link>
      {/* </div> */}
      {/* <div className="flex flex-col items-end gap-2"> */}
      <h2 className="text-lg font-bold text-nowrap ">MZN {price},00</h2>
      {/* </div> */}
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
      <div className="supplier-item-title flex gap-4 justify-between items-center ">
        <Link href={`/supply/products/${id}`}>
          <h3 className="text-lg font-medium">{name}</h3>
        </Link>
        <span className="text-sm font-light">Qty: {qty}</span>
      </div>
      <div className="supplier-item-details flex items-center gap-5">
        <h2 className="text-xl font-bold  text-nowrap">MZN {price},00</h2>
        <div className="flex gap-2">
          <StockItemDeleteButton stockItemId={id} />
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
          <h3 className="flex flex-col gap-2 text-xl font-medium">
            Purchase
            <p className="text-sm font-light ">
              #{purchases.id.slice(0, 6)}...
            </p>
          </h3>
          <div className="purchase-title-details flex gap-4">
            <div className="flex gap-2">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {purchases.timestamp.toLocaleDateString()} ,{" "}
                {purchases.timestamp.toLocaleTimeString()}
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
          <h2 className="text-lg font-bold text-nowrap">
            MZN {purchases.total.toFixed(2)}
          </h2>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Quantity</th>
            <th>Item</th>
            <th className="unit-cost">Unit Cost</th>
            <th>Total</th>
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
  const totalItemsOrdered = order.orderItems.reduce(
    (itemAcc, item) => itemAcc + item.orderedQty,
    0
  );

  return (
    <li key={order.id} className="list-orders flex justify-between">
      <div className="flex flex-col gap-5">
        <div className="order-header flex flex-col gap-2">
          <Link href={`/service/purchases/orders/${order.id}`}>
            <h3 className="order-title flex gap-2 items-center text-xl font-medium">
              Order
              <p className="text-sm font-light ">#{order.id.slice(0, 6)}...</p>
            </h3>
          </Link>
          <div className="order-info flex items-center gap-4">
            <div className="flex gap-2 items-center">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {order.timestamp.toLocaleDateString()},{" "}
                {order.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
        {order.status === "DRAFT" ||
          (order.status === "SUBMITTED" && (
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
        {/* {order.status === "DELIVERED" ||
          (order.status === "IN_DELIVERY" && (
            <div className="confirm-delivery flex flex-col gap-2">
              <div className="text-xs font-extralight flex flex-col gap-2">
                <p className="text-xs font-extralight">
                  {order.confirmedDeliveries.length}{" "}
                  {order.confirmedDeliveries.length === 1
                    ? "delivery"
                    : "deliveries"}
                </p>
                {order.confirmedDeliveries.length > 0 &&
                  order.confirmedDeliveries.map((delivery) => (
                    <p key={delivery.id}>
                      {delivery.status} at{" "}
                      {delivery.deliveredAt?.toLocaleTimeString()},{" "}
                      {delivery.deliveredAt?.toLocaleDateString()}
                    </p>
                  ))}
              </div>
              <ConfirmDeliveryButton
                deliveryId={order.confirmedDeliveries[0]?.id || ""}
                orderId={order.id}
                supplierOrderId={order.supplierOrders[0]?.id || ""}
                serviceId={order.serviceId || ""}
                status={order.confirmedDeliveries[0]?.status || ""}
                role="SERVICE"
              />
            </div>
          ))} */}
      </div>
      <div className="order-status flex flex-col justify-between">
        <div className="flex flex-col gap-2 items-end">
          <button
            disabled
            className={`text-xs ${
              order.status === "DELIVERED" ? "text-green-400" : ""
            }`}
          >
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
          <h3 className="flex flex-col gap-2  text-xl font-medium">
            Sale
            <p className="text-sm font-light ">#{sale.id.slice(0, 6)}...</p>
          </h3>
          <div className="sale-title-details flex gap-4">
            <div className="flex gap-2">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {sale.timestamp.toLocaleDateString()} ,{" "}
                {sale.timestamp.toLocaleTimeString()}
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
          <h2 className="text-lg font-bold  text-nowrap">
            MZN {sale.total.toFixed(2)}
          </h2>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Qty</th>
            <th>Item</th>
            <th className="unit-cost">Unit Cost</th>
            <th>Total</th>
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
    </li>
  );
};

export const DashSaleListItem = ({ sale }: { sale: Sale }) => {
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
          <div className="sale-title-details flex gap-4">
            <div className="flex gap-2">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {sale.timestamp.toLocaleDateString()} ,{" "}
                {sale.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Total Amount</p>
          <h2 className="text-lg font-bold  text-nowrap">
            MZN {sale.total.toFixed(2)}
          </h2>
        </div>
      </div>
    </li>
  );
};

export const ExpenseListItem = ({ expense }: { expense: Expense }) => {
  return (
    <li
      key={expense.id}
      className="list-orders flex flex-col gap-2 justify-between"
    >
      <div className="sale-header flex justify-between">
        <div className="sale-title flex  flex-col gap-2">
          <h3 className="flex gap-2 items-center text-xl font-medium">
            Expense:
            <p className="text-md font-light ">{expense.description}</p>
          </h3>
          <div className="sale-title-details flex gap-4">
            <div className="flex gap-2">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {expense.timestamp.toLocaleDateString()} ,{" "}
                {expense.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-sm font-light">{expense.paymentMethod}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Total Amount</p>
          <h2 className="text-lg font-bold  text-nowrap">
            MZN {expense.amount.toFixed(2)}
          </h2>
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
  const totalSoldItems = sale.SaleItem.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
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
          <div className="sale-title-details flex gap-4">
            <div className="flex gap-2">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {sale.timestamp.toLocaleDateString()} ,{" "}
                {sale.timestamp.toLocaleTimeString()}
              </p>
            </div>
            {sale.SaleItem.length > 1 && (
              <div className="sale-items-details flex  items-center gap-2">
                <span className="flex items-center">
                  <span className="fluent--box-16-regular"></span>
                </span>
                <p className="text-sm font-light">
                  {sale.SaleItem.length} items
                </p>
              </div>
            )}
            <p className="text-sm font-light">{totalSoldItems} items</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Total Amount</p>
          <h2 className="text-lg font-bold  text-nowrap">
            MZN {sale.total.toFixed(2)}
          </h2>
          <p className="text-sm font-light">Payment: {sale.paymentType}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th className="unit-cost">Unit Cost</th>
            <th>Total</th>
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
  order,
}: {
  // order: SupplierOrderWithOrderAndDeliveries;
  order: OrderWithStockItems;
  // supplierOrder: SupplierOrderWithOrderAndItems;
}) => {
  const totalItemsOrdered = order.orderItems.reduce(
    (itemAcc, item) => itemAcc + item.orderedQty,
    0
  );
  const delivery = order?.delivery;
  // console.log(delivery);
  return (
    <li key={order.id} className="list-orders header-p-o flex justify-between">
      <div className="flex flex-col gap-5">
        <div className="order-header flex flex-col gap-2">
          <Link
            href={`/supply/orders/${order.id}`}
            className="flex items-center gap-2"
          >
            <h3 className="order-title  text-xl font-medium">Order</h3>
            <p className="text-xs font-light">#{order.id.slice(0, 6)}...</p>
          </Link>
          <div className="order-info flex items-center gap-4">
            <div className="flex gap-2 items-center">
              <span className="flex items-center">
                <span className="formkit--date"></span>
              </span>
              <p className="text-sm font-light">
                {order?.timestamp.toLocaleDateString()},{" "}
                {order?.timestamp.toLocaleTimeString()}
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
            <p className="text-sm font-light">Delivered at: </p>
            <div className="flex gap-1 text-md font-medium">
              <p>{order?.delivery.deliveredAt?.toLocaleDateString()},</p>
              <p>{order?.delivery.deliveredAt?.toLocaleTimeString()}</p>
            </div>
          </div>
        ) : order.status === "CANCELLED" ? (
          ""
        ) : (
          <div className="delivery-window flex flex-col gap-2">
            <p className="text-sm font-light">
              {order?.Service?.businessName} - Requested Delivery Window
            </p>
            <div className=" flex gap-2">
              <p className="text-md font-medium">
                {order?.requestedStartDate.toLocaleDateString()}
              </p>
              -
              <p className="text-md font-medium">
                {order?.requestedEndDate.toLocaleDateString()}
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
            <p className="">items</p>
          </div>
        </div>
        <div className="order-amount text-end">
          <p className="text-sm ">Order Total</p>
          <h2 className="text-lg font-bold  text-nowrap">
            MZN {order?.total.toFixed(2)}
          </h2>
        </div>
      </div>
    </li>
  );
};
