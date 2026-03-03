"use client";

import { arrivedDelivery, completeDelivery } from "@/lib/actions/deliveries";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

export const CompleteDeliveryButton = ({
  deliveryStatus,
  serviceId,
  deliveryId,
  orderId,
}: {
  deliveryStatus: string;
  serviceId: string;
  deliveryId: string;
  orderId: string;
}) => {
  const t = useTranslations("Common");

  return (
    <button
      onClick={async () => {
        await completeDelivery({
          serviceId,
          deliveryId,
          orderId,
        });
      }}
      className={
        deliveryStatus === "COMPLETED" ? "hidden" : "delivery-btn fullfill-btn"
      }
    >
      {t("completeDelivery")}
    </button>
  );
};

export const ConfirmDeliveryButton = ({
  deliveryId,
  orderId,
  serviceId,
  status,
  role,
}: {
  deliveryId: string;
  orderId: string;
  serviceId: string;
  status: string;
  role: string;
}) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const lt = useTranslations("Loading");
  const rt = useTranslations("Responses");

  async function handleConfirmDelivery() {
    startTransition(async () => {
      try {
        if (
          role === "SUPPLIER" &&
          status !== "ARRIVED" &&
          status !== "COMPLETED"
        ) {
          const arrivingConfirmation = await arrivedDelivery(
            orderId,
            deliveryId,
          );
          if (arrivingConfirmation.success) {
            toast.success(rt("markArrivedSuccess"));
            router.refresh();
          } else if (!arrivingConfirmation.success) {
            toast.error(arrivingConfirmation.error || rt("markArrivedFail"));
            setTimeout(() => {
              router.refresh();
            }, 100);
          }
        } else if (role === "SERVICE" && status === "ARRIVED") {
          const confirmation = await completeDelivery({
            deliveryId,
            orderId,
            serviceId,
          });

          if (confirmation.success) {
            toast.success(rt("confirmSuccess"));
            router.refresh();
          }
          if (!confirmation.success && confirmation.error) {
            toast.error(confirmation.error);
          }
        }
      } catch (error) {
        console.error(rt("confirmDeliveryError"), error);
        toast.error(rt("confirmDeliveryFail"));
      }
    });
  }

  const label =
    role === "SUPPLIER" && status !== "ARRIVED" && status !== "COMPLETED"
      ? rt("markArrived")
      : role === "SERVICE" && status === "ARRIVED"
        ? rt("confirmDelivery")
        : rt("deliveryCompleted");

  const isDisabled = status === "COMPLETED" || isPending;

  return (
    <button
      disabled={isDisabled}
      onClick={handleConfirmDelivery}
      className={`delivery-btn text-sm  confirm-delivery-btn ${
        isPending || status === "COMPLETED" ? "opacity-50" : ""
      } `}
    >
      {isPending ? lt("processing") : label}
    </button>
  );
};
