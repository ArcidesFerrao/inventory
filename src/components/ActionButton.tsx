"use client";

import { acceptOrder } from "@/app/actions/orders";
import { useState } from "react";
import toast from "react-hot-toast";

export const AcceptButton = ({
  supplierOrderId,
  orderId,
}: {
  supplierOrderId: string;
  orderId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const handleOnClick = async () => {
    setLoading(true);
    const acceptedOrder = await acceptOrder({ supplierOrderId, orderId });
    if (acceptedOrder?.success) {
      toast.success("Order accepted successfully");
    }
    setLoading(false);
  };
  return (
    <button
      disabled={loading}
      onClick={() => handleOnClick()}
      className="accept-btn"
    >
      {loading ? "..." : "Accept"}
    </button>
  );
};
