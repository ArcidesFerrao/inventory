import { StockChange } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="modal-category modal fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full p-4 flex flex-col gap-2 relative">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {children}

        <div className="absolute top-0 right-0 text-right mt-4 ">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export function StockMovementModal({
  isOpen,
  onClose,
  supplierProductId,
  currentStock,
}: {
  isOpen: boolean;
  onClose: () => void;
  supplierProductId: string;
  currentStock: number;
}) {
  const [changeType, setChangeType] = useState<StockChange>("ADJUSTMENT");
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const stockChangeConfig = {
    PURCHASE: { label: "Purchase", color: "text-green-600", symbol: "+" },
    SALE: { label: "Sale", color: "text-blue-600", symbol: "-" },
    WASTE: { label: "Waste", color: "text-red-600", symbol: "-" },
    ADJUSTMENT: { label: "Adjustment", color: "text-yellow-600", symbol: "±" },
    RECONCILIATION: {
      label: "Reconciliation",
      color: "text-purple-600",
      symbol: "=",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stock-movements", {
        method: "POST",
        headers: {
          "Content-Type": "apprication/json",
        },
        body: JSON.stringify({
          supplierProductId,
          changeType,
          quantity,
          notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to record stock movement");
      }

      setQuantity(0);
      setNotes("");
      onClose();
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to record movement"
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateNewStock = () => {
    if (changeType === "RECONCILIATION") return quantity;
    if (changeType === "PURCHASE" || changeType === "ADJUSTMENT") {
      return currentStock + Math.abs(quantity);
    }
    return currentStock + Math.abs(quantity);
  };

  if (!isOpen) return null;

  return (
    <div>
      <div>
        <div>
          <h2>Record Stock Movement</h2>
          <button onClick={onClose}>x</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="currentStock">Current Stock</label>
            <span>{currentStock}</span>
          </div>

          <div>
            <label htmlFor="changeType">ChangeType</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(stockChangeConfig) as StockChange[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setChangeType(type)}
                  className=""
                >
                  <span className={stockChangeConfig[type].color}>
                    {stockChangeConfig[type].symbol}
                  </span>
                  {stockChangeConfig[type].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="typeChange">
              {changeType === "RECONCILIATION" ? "New Stock Level" : "Quantity"}
            </label>
            <input
              type="number"
              name="typeChange"
              id="typeChange"
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuantity(Number(e.target.value))
              }
              required
              min={0}
            />
          </div>

          {changeType !== "RECONCILIATION" && (
            <div>
              <h3>New Stock will be: </h3>
              <span>{calculateNewStock()}</span>
            </div>
          )}

          <div>
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              name="notes"
              id="notes"
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              rows={3}
              placeholder="Add any notes about this stock movement"
            />
          </div>

          {error && <p>{error}</p>}

          <div>
            <button onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button>{loading ? "Recording..." : "Record Movement"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
