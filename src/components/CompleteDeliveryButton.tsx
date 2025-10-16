"use client";

import { completeDelivery } from "@/app/actions/deliveries";
import React from "react";

export const CompleteDeliveryButton = ({
  deliveryId,
  orderId,
  supplierOrderId,
}: {
  deliveryId: string;
  orderId: string;
  supplierOrderId: string;
}) => {
  return (
    <button
      onClick={async () => {
        await completeDelivery({
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
