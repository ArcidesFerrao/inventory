import {
  ArrivedDeliveryLogs,
  ConfirmedDeliveryLogs,
  CreateDeliveryLogs,
  CreateOrderLogs,
  CreateSaleLogs,
  ErrorDeliveryLogs,
  UpdateOrderLogs,
} from "@/types/types";
import React from "react";

export const ConfirmedDeliveryLogDetails = ({
  details,
}: {
  details: ConfirmedDeliveryLogs;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <h4> {details.totalItems} Delivered Items:</h4>
      {typeof details === "object" && details ? (
        <ul className="text-sm font-extralight">
          {details.deliveryItems.map((item) => (
            <li key={item.id}>
              {item.orderItem.stockItem.name} - {item.quantity} x MZN{" "}
              {item.orderItem.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No extra details</p>
      )}
    </div>
  );
};
export const ArrivedDeliveryLogDetails = ({
  details,
}: {
  details: ArrivedDeliveryLogs;
}) => {
  return (
    <div className="flex flex-col gap-1">
      {/* <h4>Delivered At:</h4>
      <p>
        {details.deliveredAt !== null &&
          details.deliveredAt.toLocaleDateString()}
      </p> */}
    </div>
  );
};
export const CreateDeliveryLogDetails = ({
  details,
}: {
  details: CreateDeliveryLogs;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <p>Order Id: {details.orderId}</p>
      <h4>
        {details.totalItems} Delivery{" "}
        {details.totalItems === 1 ? "Item" : "Items"}:
      </h4>
      {typeof details === "object" && details ? (
        <ul className="text-sm font-extralight">
          {details.items.map((item) => (
            <li key={item.id}>
              {item.stockItem.name} - {item.stockItem.stock} x MZN{" "}
              {item.stockItem.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No extra details</p>
      )}
    </div>
  );
};

export const CreateOrderLogDetails = ({
  details,
}: {
  details: CreateOrderLogs;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <h4>Order Items:</h4>
      {typeof details === "object" && details ? (
        <div className="flex flex-col gap-1">
          {details.items.map((item) => (
            <ul key={item.itemId} className="text-sm font-extralight">
              <li key={item.itemId}>
                {item.name} - {item.orderedQty} x MZN {item.price}
              </li>
            </ul>
          ))}
        </div>
      ) : (
        <p>No extra details</p>
      )}
    </div>
  );
};
export const CreateSaleLogDetails = ({
  details,
}: {
  details: CreateSaleLogs;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <h4>Sale Items:</h4>
      {typeof details === "object" && details ? (
        <div className="flex flex-col gap-1">
          <ul className="text-sm font-extralight">
            {details.items.map((i) => (
              <li key={i.id}>
                {i.name} - {i.quantity} x MZN {i.price}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No extra details</p>
      )}
    </div>
  );
};
export const CreatePurchaseLogDetails = ({
  details,
}: {
  details: CreateSaleLogs;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <h4>Purchase Items:</h4>
      {typeof details === "object" && details ? (
        <div className="flex flex-col gap-1">
          <ul className="text-sm font-extralight">
            {details.items.map((i) => (
              <li key={i.id}>
                {i.name} - {i.quantity} x MZN {i.price}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No extra details</p>
      )}
    </div>
  );
};

export const UpdateOrderLogDetails = ({
  details,
}: {
  details: UpdateOrderLogs;
}) => {
  return (
    <div className="flex flex-col gap-2 text-sm font-extralight">
      <p>Supplier Order Id: {details.supplierOrderId}</p>
      <p>Update: {details.update}</p>
    </div>
  );
};
export const ErroDeliveryLogDetails = ({
  details,
}: {
  details: ErrorDeliveryLogs;
}) => {
  return (
    <div className="flex flex-col gap-2 text-sm font-extralight">
      {details.serviceId && <p>Service Id: {details.serviceId}</p>}
      <p>Supplier Order Id: {details.supplierOrderId}</p>
      <p>Update: {details.error}</p>
    </div>
  );
};
