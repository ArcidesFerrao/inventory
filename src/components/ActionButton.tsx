"use client";

import { acceptOrder } from "@/app/actions/orders";

export const AcceptButton = ({
  supplierOrderId,
  orderId,
}: {
  supplierOrderId: string;
  orderId: string;
}) => {
  return (
    <button
      onClick={() => acceptOrder({ supplierOrderId, orderId })}
      className="accept-btn"
    >
      Accept
    </button>
  );
};
