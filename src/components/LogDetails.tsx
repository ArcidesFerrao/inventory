import {
  ArrivedDeliveryLogs,
  ConfirmedDeliveryLogs,
  CreateDeliveryLogs,
  CreateOrderLogs,
  CreateSaleLogs,
  ErrorDeliveryLogs,
  UpdateOrderLogs,
} from "@/types/types";
import { useTranslations } from "next-intl";

export const ConfirmedDeliveryLogDetails = ({
  details,
}: {
  details: ConfirmedDeliveryLogs;
}) => {
  const t = useTranslations("Common");
  return (
    <div className="flex flex-col gap-1">
      <h4>
        {" "}
        {details.totalItems} {t("deliveredItems")}:
      </h4>
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
        <p>{t("noExtraDetails")}</p>
      )}
    </div>
  );
};
export const ArrivedDeliveryLogDetails = ({
  details,
}: {
  details: ArrivedDeliveryLogs;
}) => {
  const t = useTranslations("Common");

  return (
    <div className="flex flex-col gap-1">
      <h4>{t("deliveredAt")}:</h4>
      <p>
        {details.deliveredAt !== null &&
          details.deliveredAt.toLocaleDateString()}
      </p>
    </div>
  );
};

export const CreateDeliveryLogDetails = ({
  details,
}: {
  details: CreateDeliveryLogs;
}) => {
  const t = useTranslations("Common");
  return (
    <div className="flex flex-col gap-1">
      <p>Order Id: {details.orderId}</p>
      <h4>
        {details.totalItems} {t("delivery")}
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
        <p>{t("noExtraDetails")}</p>
      )}
    </div>
  );
};

export const CreateOrderLogDetails = ({
  details,
}: {
  details: CreateOrderLogs;
}) => {
  const t = useTranslations("Common");
  return (
    <div className="flex flex-col gap-1">
      <h4>{t("orderItems")}:</h4>
      {typeof details === "object" && details ? (
        <div className="flex flex-col gap-1">
          {details.items.map((item) => (
            <ul key={item.itemId} className="text-sm font-extralight">
              <li key={item.itemId}>
                {item.name} - MZN {item.price} x {item.orderedQty}
              </li>
            </ul>
          ))}
        </div>
      ) : (
        <p>{t("noExtraDetails")}</p>
      )}
    </div>
  );
};
export const CreateSaleLogDetails = ({
  details,
}: {
  details: CreateSaleLogs;
}) => {
  const t = useTranslations("Common");

  return (
    <div className="flex flex-col gap-1">
      <h4>{t("saleItems")}:</h4>
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
        <p>{t("noExtraDetails")}</p>
      )}
    </div>
  );
};
export const CreatePurchaseLogDetails = ({
  details,
}: {
  details: CreateSaleLogs;
}) => {
  const t = useTranslations("Common");

  return (
    <div className="flex flex-col gap-1">
      <h4>{t("purchaseItems")}:</h4>
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
        <p>{t("noExtraDetails")}</p>
      )}
    </div>
  );
};

export const UpdateOrderLogDetails = ({
  details,
}: {
  details: UpdateOrderLogs;
}) => {
  const t = useTranslations("Common");

  return (
    <div className="flex flex-col gap-2 text-sm font-extralight">
      <p>
        {t("supplierOrderId")}: {details.supplierOrderId}
      </p>
      <p>
        {t("update")}: {details.update}
      </p>
    </div>
  );
};
export const ErroDeliveryLogDetails = ({
  details,
}: {
  details: ErrorDeliveryLogs;
}) => {
  const t = useTranslations("Common");
  return (
    <div className="flex flex-col gap-2 text-sm font-extralight">
      {details.serviceId && (
        <p>
          {t("serviceId")}: {details.serviceId}
        </p>
      )}
      <p>
        {t("supplierOrderId")}: {details.supplierOrderId}
      </p>
      <p>
        {t("update")}: {details.error}
      </p>
    </div>
  );
};
