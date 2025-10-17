"use client";

import { completeDelivery } from "@/app/actions/deliveries";
import React from "react";

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
