"use client";

import { rateDelivery } from "@/app/actions/deliveries";
import { acceptOrder, denyOrder } from "@/app/actions/orders";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const AcceptButton = ({
  // supplierOrderId,
  orderId,
}: {
  // supplierOrderId: string;
  orderId: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleOnClick = async () => {
    setLoading(true);
    const acceptedOrder = await acceptOrder({ orderId });
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
export const DenyButton = ({ orderId }: { orderId: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleOnClick = async () => {
    setLoading(true);
    const deniedOrder = await denyOrder({ orderId });
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

export const RateButtons = ({ deliveryId }: { deliveryId: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleRateDelivery = async (star: number) => {
    setLoading(true);
    try {
      const ratedDelivery = await rateDelivery(deliveryId, star);

      if (ratedDelivery.success) {
        toast.success("Delivery rated successfully!");
        setLoading(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error rating delivery: ", error);
      toast.error("Error rating delivery!");
      setLoading(false);
    }
  };
  return (
    <div className="rate-buttons flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={loading}
          // className="text-yellow-400"
          onClick={() => handleRateDelivery(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};
