"use client";

import { rateDelivery } from "@/lib/actions/deliveries";
import { acceptOrder, denyOrder } from "@/lib/actions/orders";
import { useTranslations } from "next-intl";
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

  const t = useTranslations("Common");
  const rt = useTranslations("Responses");

  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setLoading(true);
    const acceptedOrder = await acceptOrder({ orderId });
    if (acceptedOrder?.success) {
      toast.success(rt("acceptOrderSuccess"));
      router.refresh();
    }
    if (!acceptedOrder?.success) {
      toast.error(acceptedOrder?.error || rt("acceptingOrderError"));
    }
    setLoading(false);
  };
  return (
    <button
      disabled={loading}
      onClick={() => handleOnClick()}
      className="accept-btn text-green-300"
    >
      {loading ? "..." : t("accept")}
    </button>
  );
};
export const DenyButton = ({ orderId }: { orderId: string }) => {
  const router = useRouter();

  const t = useTranslations("Common");
  const rt = useTranslations("Responses");

  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setLoading(true);
    const deniedOrder = await denyOrder({ orderId });
    if (deniedOrder?.success) {
      toast.success(rt("denyOrder"));
      router.refresh();
    }
    if (!deniedOrder?.success) {
      toast.error(deniedOrder?.error || rt("denyOrder"));
    }
    setLoading(false);
  };
  return (
    <button
      disabled={loading}
      onClick={() => handleOnClick()}
      className="accept-btn text-red-300"
    >
      {loading ? "..." : t("accept")}
    </button>
  );
};

export const RateButtons = ({ deliveryId }: { deliveryId: string }) => {
  const router = useRouter();

  const rt = useTranslations("Responses");

  const [loading, setLoading] = useState(false);
  const handleRateDelivery = async (star: number) => {
    setLoading(true);
    try {
      const ratedDelivery = await rateDelivery(deliveryId, star);

      if (ratedDelivery.success) {
        toast.success(rt("rateDeliverySuccess"));
        setLoading(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error rating delivery: ", error);
      toast.error(rt("rateDeliveryError"));
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
