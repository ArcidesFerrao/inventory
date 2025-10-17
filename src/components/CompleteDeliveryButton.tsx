"use client";

import { arrivedDelivery, completeDelivery } from "@/app/actions/deliveries";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import toast from "react-hot-toast";

export const CompleteDeliveryButton = ({
  deliveryStatus,
  serviceId,
  deliveryId,
  orderId,
  supplierOrderId,
}: {
  deliveryStatus: string;
  serviceId: string;
  deliveryId: string;
  orderId: string;
  supplierOrderId: string;
}) => {
  return (
    <button
      onClick={async () => {
        await completeDelivery({
          serviceId,
          deliveryId,
          orderId,
          supplierOrderId,
        });
      }}
      className={
        deliveryStatus === "COMPLETED" ? "hidden" : "delivery-btn fullfill-btn"
      }
    >
      Complete Delivery
    </button>
  );
};

export const ConfirmDeliveryButton = ({
  deliveryId,
  orderId,
  supplierOrderId,
  serviceId,
  status,
  role,
}: {
  deliveryId: string;
  orderId: string;
  supplierOrderId: string;
  serviceId: string;
  status: string;
  role: string;
}) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

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
            supplierOrderId
          );
          if (arrivingConfirmation.success) {
            toast.success("Delivery marked as arrived.");
          } else if (!arrivingConfirmation.success) {
            toast.error(
              arrivingConfirmation.error ||
                "Failed to mark delivery as arrived."
            );
            setTimeout(() => {
              router.refresh();
            }, 100);
          }
        } else if (role === "SERVICE" && status === "ARRIVED") {
          const confirmation = await completeDelivery({
            deliveryId,
            orderId,
            serviceId,
            supplierOrderId,
          });

          if (confirmation.success) {
            toast.success("Delivery confirmed successfully.");
          }
        }
      } catch (error) {
        console.error("Error confirming delivery:", error);
        toast.error("Failed to confirm delivery. Please try again.");
      }
    });
  }

  const label =
    role === "SUPPLIER" && status !== "ARRIVED" && status !== "COMPLETED"
      ? "Mark as arrived"
      : role === "SERVICE" && status === "ARRIVED"
      ? "Confirm Delivery"
      : "Delivery Completed";

  const isDisabled = status === "COMPLETED" || isPending;

  return (
    <button
      disabled={isDisabled}
      onClick={handleConfirmDelivery}
      className={`delivery-btn text-sm  confirm-delivery-btn ${
        isPending || status === "COMPLETED" ? "opacity-50" : ""
      } `}
    >
      {isPending ? "Processing..." : label}
    </button>
  );
};
