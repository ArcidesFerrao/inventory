"use client";

import { useState } from "react";
import { StockMovementModal } from "./Modal";

export default function StockManagementButton({
  supplierProductId,
  currentStock,
}: {
  supplierProductId: string;
  currentStock: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <button onClick={() => setModalOpen(true)}>Update</button>
      <StockMovementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        supplierProductId={supplierProductId}
        currentStock={currentStock}
      />
    </>
  );
}
