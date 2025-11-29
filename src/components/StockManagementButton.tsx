"use client";

import { useState } from "react";
import { StockMovementModal } from "./Modal";

export default function StockManagementButton({
  stockItemId,
  currentStock,
}: {
  stockItemId: string;
  currentStock: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="px-2 py-1 rounded text-xs stock-btn "
      >
        Update
      </button>
      <StockMovementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        stockItemId={stockItemId}
        currentStock={currentStock}
      />
    </>
  );
}
