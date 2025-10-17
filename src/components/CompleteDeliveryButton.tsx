"use client";

import { completeDelivery } from "@/app/actions/deliveries";
import React from "react";

export const CompleteDeliveryButton = ({
  serviceId,
  deliveryId,
  orderId,
  supplierOrderId,
}: {
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
      className="delivery-btn fullfill-btn"
    >
      Complete Delivery
    </button>
  );
};
