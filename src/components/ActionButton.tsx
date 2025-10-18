"use client";

import { acceptOrder, denyOrder } from "@/app/actions/orders";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const AcceptButton = ({
  supplierOrderId,
  orderId,
}: {
  supplierOrderId: string;
  orderId: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleOnClick = async () => {
    setLoading(true);
    const acceptedOrder = await acceptOrder({ supplierOrderId, orderId });
    if (acceptedOrder?.success) {
      toast.success("Order accepted successfully");
      router.refresh();
    }
    if (!acceptedOrder?.success) {
      toast.error(
        acceptedOrder?.error || "There was an error accepting the order"
      );
    }
    setLoading(false);
  };
  return (
    <button
      disabled={loading}
      onClick={() => handleOnClick()}
      className="accept-btn text-green-300"
    >
      {loading ? "..." : "Accept"}
    </button>
  );
};
export const DenyButton = ({
  supplierOrderId,
  orderId,
}: {
  supplierOrderId: string;
  orderId: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleOnClick = async () => {
    setLoading(true);
    const deniedOrder = await denyOrder({ supplierOrderId, orderId });
    if (deniedOrder?.success) {
      toast.success("Order denied successfully");
      router.refresh();
    }
    if (!deniedOrder?.success) {
      toast.error(deniedOrder?.error || "There was an error denying the order");
    }
    setLoading(false);
  };
  return (
    <button
      disabled={loading}
      onClick={() => handleOnClick()}
      className="accept-btn text-red-300"
    >
      {loading ? "..." : "Deny"}
    </button>
  );
};
