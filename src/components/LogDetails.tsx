import {
  ArrivedDeliveryLogs,
  ConfirmedDeliveryLogs,
  CreateCategoryLogs,
  CreateDeliveryLogs,
  CreateExpenseLogs,
  CreateOrderLogs,
  CreatePurchaseLogs,
  CreateSaleLogs,
  ErrorDeliveryLogs,
  UpdateOrderLogs,
} from "@/types/types";
import { useTranslations } from "next-intl";

// ── Shared primitives ────────────────────────────────────────────────────

function DetailTable({ children }: { children: React.ReactNode }) {
  return (
    <table className="w-full text-sm">
      <tbody>{children}</tbody>
    </table>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <tr className="border-b border-base-content/10 last:border-0">
      <td className="py-2 pr-6 text-base-content/50 font-light whitespace-nowrap w-1/3">
        {label}
      </td>
      <td className="py-2 font-medium">{value}</td>
    </tr>
  );
}

function ItemsTable({
  headers,
  rows,
  footer,
}: {
  headers: string[];
  rows: React.ReactNode[][];
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-base-content/10">
            {headers.map((h, i) => (
              <th
                key={h}
                className={`py-2 text-xs font-medium text-base-content/40 uppercase tracking-wide pr-4 last:pr-0 ${
                  i > 0 ? "text-right" : "text-left"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-base-content/10 last:border-0"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`py-2.5 font-light pr-4 last:pr-0 ${j > 0 ? "text-right" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {footer && (
        <div className="flex justify-end pt-2.5 border-t border-base-content/10 mt-1">
          {footer}
        </div>
      )}
    </div>
  );
}

function MonoId({ value }: { value: string }) {
  return (
    <span className="font-mono text-xs text-base-content/60 bg-base-content/5 px-1.5 py-0.5 rounded">
      {value.slice(0, 12)}...
    </span>
  );
}

// export const ConfirmedDeliveryLogDetails = ({
//   details,
// }: {
//   details: ConfirmedDeliveryLogs;
// }) => {
//   const t = useTranslations("Common");
//   return (
//     <div className="flex flex-col gap-1">
//       <h4>
//         {" "}
//         {details.totalItems} {t("deliveredItems")}:
//       </h4>
//       {typeof details === "object" && details ? (
//         <ul className="text-sm font-extralight">
//           {details.deliveryItems.map((item) => (
//             <li key={item.id}>
//               {item.orderItem.stockItem.name} - {item.quantity} x MZN{" "}
//               {item.orderItem.price}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>{t("noExtraDetails")}</p>
//       )}
//     </div>
//   );
// };
// export const ArrivedDeliveryLogDetails = ({
//   details,
// }: {
//   details: ArrivedDeliveryLogs;
// }) => {
//   const t = useTranslations("Common");

//   return (
//     <div className="flex flex-col gap-1">
//       <h4>{t("deliveredAt")}:</h4>
//       <p>
//         {details.deliveredAt !== null &&
//           details.deliveredAt.toLocaleDateString()}
//       </p>
//     </div>
//   );
// };

// export const CreateDeliveryLogDetails = ({
//   details,
// }: {
//   details: CreateDeliveryLogs;
// }) => {
//   const t = useTranslations("Common");
//   return (
//     <div className="flex flex-col gap-1">
//       <p>Order Id: {details.orderId}</p>
//       <h4>
//         {details.totalItems} {t("delivery")}
//         {details.totalItems === 1 ? "Item" : "Items"}:
//       </h4>
//       {typeof details === "object" && details ? (
//         <ul className="text-sm font-extralight">
//           {details.items.map((item) => (
//             <li key={item.id}>
//               {item.stockItem.name} - {item.stockItem.stock} x MZN{" "}
//               {item.stockItem.price}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>{t("noExtraDetails")}</p>
//       )}
//     </div>
//   );
// };

// export const CreateOrderLogDetails = ({
//   details,
// }: {
//   details: CreateOrderLogs;
// }) => {
//   const t = useTranslations("Common");
//   return (
//     <div className="flex flex-col gap-1">
//       <h4>{t("orderItems")}:</h4>
//       {typeof details === "object" && details ? (
//         <div className="flex flex-col gap-1">
//           {details.items.map((item) => (
//             <ul key={item.itemId} className="text-sm font-extralight">
//               <li key={item.itemId}>
//                 {item.name} - MZN {item.price} x {item.orderedQty}
//               </li>
//             </ul>
//           ))}
//         </div>
//       ) : (
//         <p>{t("noExtraDetails")}</p>
//       )}
//     </div>
//   );
// };
// export const CreateSaleLogDetails = ({
//   details,
// }: {
//   details: CreateSaleLogs;
// }) => {
//   const t = useTranslations("Common");

//   return (
//     <div className="flex flex-col gap-1">
//       <h4>{t("saleItems")}:</h4>
//       {typeof details === "object" && details ? (
//         <div className="flex flex-col gap-1">
//           <ul className="text-sm font-extralight">
//             {details.items.map((i) => (
//               <li key={i.id}>
//                 {i.name} - {i.quantity} x MZN {i.price}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>{t("noExtraDetails")}</p>
//       )}
//     </div>
//   );
// };
// export const CreatePurchaseLogDetails = ({
//   details,
// }: {
//   details: CreateSaleLogs;
// }) => {
//   const t = useTranslations("Common");
//   const pt = useTranslations("Purchases");

//   return (
//     <div className="flex flex-col gap-1">
//       <h4>{pt("purchaseItems")}:</h4>
//       {typeof details === "object" && details ? (
//         <div className="flex flex-col gap-1">
//           <ul className="text-sm font-extralight">
//             {details.items.map((i) => (
//               <li key={i.id}>
//                 {i.name} - {i.quantity} x MZN {i.price}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>{t("noExtraDetails")}</p>
//       )}
//     </div>
//   );
// };

// export const UpdateOrderLogDetails = ({
//   details,
// }: {
//   details: UpdateOrderLogs;
// }) => {
//   const t = useTranslations("Common");

//   return (
//     <div className="flex flex-col gap-2 text-sm font-extralight">
//       <p>
//         {t("supplierOrderId")}: {details.orderId}
//       </p>
//       <p>
//         {t("update")}: {details.update}
//       </p>
//     </div>
//   );
// };
// export const ErroDeliveryLogDetails = ({
//   details,
// }: {
//   details: ErrorDeliveryLogs;
// }) => {
//   const t = useTranslations("Common");
//   return (
//     <div className="flex flex-col gap-2 text-sm font-extralight">
//       {details.serviceId && (
//         <p>
//           {t("serviceId")}: {details.serviceId}
//         </p>
//       )}
//       <p>
//         {t("supplierOrderId")}: {details.supplierOrderId}
//       </p>
//       <p>
//         {t("update")}: {details.error}
//       </p>
//     </div>
//   );
// };

// ── Components ───────────────────────────────────────────────────────────

export const ConfirmedDeliveryLogDetails = ({
  details,
}: {
  details: ConfirmedDeliveryLogs;
}) => {
  const t = useTranslations("Common");
  if (!details)
    return (
      <p className="text-sm text-base-content/50">{t("noExtraDetails")}</p>
    );

  const total = details.deliveryItems.reduce(
    (sum, item) => sum + item.orderItem.price * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <DetailTable>
        <DetailRow
          label={t("deliveryId")}
          value={<MonoId value={details.deliveryId} />}
        />
        <DetailRow
          label={t("orderId")}
          value={<MonoId value={details.orderId} />}
        />
        <DetailRow label={t("totalItems")} value={details.totalItems} />
      </DetailTable>
      {details.deliveryItems && (
        <ItemsTable
          headers={[t("item"), t("qty"), t("unitPrice"), t("total")]}
          rows={details.deliveryItems.map((item) => [
            item.orderItem.stockItem.name,
            item.quantity,
            `MZN ${Number(item.orderItem.price).toFixed(2)}`,
            `MZN ${(Number(item.orderItem.price) * item.quantity).toFixed(2)}`,
          ])}
          footer={
            <span className="text-sm font-semibold">
              Total: MZN {total.toFixed(2)}
            </span>
          }
        />
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
  if (!details)
    return (
      <p className="text-sm text-base-content/50">{t("noExtraDetails")}</p>
    );

  return (
    <DetailTable>
      <DetailRow
        label={t("deliveryId")}
        value={<MonoId value={details.deliveryId} />}
      />
      <DetailRow
        label={t("supplierOrderId")}
        value={<MonoId value={details.supplierOrderId} />}
      />
      <DetailRow
        label={t("deliveredAt")}
        value={
          details.deliveredAt
            ? new Date(details.deliveredAt).toLocaleDateString(undefined, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "—"
        }
      />
    </DetailTable>
  );
};

export const CreateDeliveryLogDetails = ({
  details,
}: {
  details: CreateDeliveryLogs;
}) => {
  const t = useTranslations("Common");
  if (!details)
    return (
      <p className="text-sm text-base-content/50">{t("noExtraDetails")}</p>
    );

  return (
    <div className="flex flex-col gap-4">
      <DetailTable>
        <DetailRow
          label={t("orderId")}
          value={<MonoId value={details.orderId} />}
        />
        <DetailRow
          label={t("scheduledAt")}
          value={new Date(details.scheduledAt).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        />
        <DetailRow label={t("totalItems")} value={details.totalItems} />
      </DetailTable>
      <ItemsTable
        headers={[
          t("item"),
          t("orderedQty"),
          t("deliveredQty"),
          t("unitPrice"),
        ]}
        rows={details.items.map((item) => [
          item.stockItem.name,
          item.orderedQty,
          item.deliveredQty,
          `MZN ${Number(item.price).toFixed(2)}`,
        ])}
      />
    </div>
  );
};

export const CreateOrderLogDetails = ({
  details,
}: {
  details: CreateOrderLogs;
}) => {
  const t = useTranslations("Common");
  if (!details)
    return (
      <p className="text-sm text-base-content/50">{t("noExtraDetails")}</p>
    );

  return (
    <ItemsTable
      headers={[t("item"), t("qty"), t("unitPrice"), t("total")]}
      rows={details.items.map((item) => [
        item.name,
        item.orderedQty,
        `MZN ${Number(item.price).toFixed(2)}`,
        `MZN ${(Number(item.price) * item.orderedQty).toFixed(2)}`,
      ])}
      footer={
        <span className="text-sm font-semibold">
          Total: MZN {Number(details.total).toFixed(2)}
        </span>
      }
    />
  );
};

export const CreateSaleLogDetails = ({
  details,
}: {
  details: CreateSaleLogs;
}) => {
  const t = useTranslations("Common");
  if (!details)
    return (
      <p className="text-sm text-base-content/50">{t("noExtraDetails")}</p>
    );

  return (
    <ItemsTable
      headers={[t("item"), t("qty"), t("unitPrice"), t("total")]}
      rows={details.items.map((i) => [
        i.name,
        i.quantity,
        `MZN ${Number(i.price).toFixed(2)}`,
        `MZN ${(Number(i.price) * i.quantity).toFixed(2)}`,
      ])}
      footer={
        <span className="text-sm font-semibold">
          Total: MZN {Number(details.totalPrice).toFixed(2)}
        </span>
      }
    />
  );
};

export const CreatePurchaseLogDetails = ({
  details,
}: {
  details: CreatePurchaseLogs;
}) => {
  const t = useTranslations("Common");
  const pt = useTranslations("Purchases");
  if (!details)
    return (
      <p className="text-sm text-base-content/50">{t("noExtraDetails")}</p>
    );
  return (
    <ItemsTable
      headers={[t("item"), t("qty"), t("unitCost"), t("total")]}
      rows={details.items.map((i) => [
        i.name,
        i.quantity,
        `MZN ${Number(i.price).toFixed(2)}`,
        `MZN ${(Number(i.price) * i.quantity).toFixed(2)}`,
      ])}
      footer={
        <span className="text-sm font-semibold">
          {pt("totalSpent")}: MZN {Number(details.total).toFixed(2)}
        </span>
      }
    />
  );
};

export const UpdateOrderLogDetails = ({
  details,
}: {
  details: UpdateOrderLogs;
}) => {
  const t = useTranslations("Common");
  if (!details)
    return (
      <p className="text-sm text-base-content/50">{t("noExtraDetails")}</p>
    );

  return (
    <DetailTable>
      <DetailRow
        label={t("orderId")}
        value={<MonoId value={details.orderId} />}
      />
      <DetailRow label={t("update")} value={details.update} />
    </DetailTable>
  );
};

export const ErroDeliveryLogDetails = ({
  details,
}: {
  details: ErrorDeliveryLogs;
}) => {
  const t = useTranslations("Common");
  if (!details)
    return (
      <p className="text-sm text-base-content/50">{t("noExtraDetails")}</p>
    );

  return (
    <DetailTable>
      {details.serviceId && (
        <DetailRow
          label={t("serviceId")}
          value={<MonoId value={details.serviceId} />}
        />
      )}
      <DetailRow
        label={t("supplierOrderId")}
        value={<MonoId value={details.supplierOrderId} />}
      />
      <DetailRow
        label={t("error")}
        value={<span className="text-red-400">{details.error}</span>}
      />
    </DetailTable>
  );
};

export const CreateExpenseLogDetails = ({
  details,
}: {
  details: CreateExpenseLogs;
}) => {
  const t = useTranslations("Common");
  if (!details)
    return (
      <p className="text-sm text-base-content/50">{t("noExtraDetails")}</p>
    );

  return (
    <div className="flex flex-col gap-4">
      <DetailTable>
        <DetailRow
          label={t("timestamp")}
          value={new Date(details.timestamp).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        />
        <DetailRow label={t("total")} value={details.total} />
      </DetailTable>
    </div>
  );
};
export const CreateCategoryLogDetails = ({
  details,
}: {
  details: CreateCategoryLogs;
}) => {
  const t = useTranslations("Common");
  if (!details)
    return (
      <p className="text-sm text-base-content/50">{t("noExtraDetails")}</p>
    );

  return (
    <div className="flex flex-col gap-4">
      <DetailTable>
        <DetailRow
          label={t("timestamp")}
          value={new Date(details.timestamp).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        />
        <DetailRow label={t("category")} value={details.category} />
      </DetailTable>
    </div>
  );
};
