// import { StockChange } from "@/generated/prisma/enums";
import { createCategoryExpense } from "@/lib/actions/expenses";
import { StockChange } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

interface CreateCategoryProps {
  isOpen: boolean;
  onClose: () => void;
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
  stockItemId,
  currentStock,
}: {
  isOpen: boolean;
  onClose: () => void;
  stockItemId: string;
  currentStock: number;
}) {
  const [changeType, setChangeType] = useState<StockChange>("ADJUSTMENT");
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTranslations("Common");
  const mt = useTranslations("Modal");
  const nt = useTranslations("Notifications");

  const stockChangeConfig = {
    PURCHASE: { label: mt("purchase"), color: "text-green-600", symbol: "+" },
    SALE: { label: mt("sale"), color: "text-blue-600", symbol: "-" },
    WASTE: { label: mt("waste"), color: "text-red-600", symbol: "-" },
    ADJUSTMENT: {
      label: mt("adjustment"),
      color: "text-yellow-600",
      symbol: "±",
    },
    RECONCILIATION: {
      label: mt("reconciliation"),
      color: "text-purple-600",
      symbol: "=",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stock-movement", {
        method: "POST",
        headers: {
          "Content-Type": "apprication/json",
        },
        body: JSON.stringify({
          stockItemId,
          changeType,
          quantity,
          notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("stockMovementError"));
      }

      setQuantity(0);
      setNotes("");
      onClose();
      toast.success(t("stockRecordSuccess"));
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : t("stockMovementError"),
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
    return currentStock - Math.abs(quantity);
  };

  if (!isOpen) return null;

  return (
    <div className=" stock-modal fixed left-4 inset-0 z-50 max-w-100 ">
      <div className="rounded-sm w-full p-5">
        <div className="flex justify-between items-center">
          <h2>{mt("recordStock")}</h2>
          <button className="close-modal" onClick={onClose}>
            x
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="py-2 flex justify-between">
            <label htmlFor="currentStock">{mt("currentStock")}</label>
            <span>{currentStock}</span>
          </div>

          <div className="flex flex-col gap-2 py-2">
            <label htmlFor="changeType">{mt("changeType")}</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(stockChangeConfig) as StockChange[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setChangeType(type)}
                  className={` flex items-center justify-center gap-2 px-2 py-1 border rounded-sm text-sm ${
                    changeType === type
                      ? "border-blue-500 bg-blue-100 text-gray-800"
                      : "border-gray-300  hover:bg-gray-50 hover:text-gray-800 "
                  }`}
                >
                  <span className={stockChangeConfig[type].color}>
                    {stockChangeConfig[type].symbol}
                  </span>
                  <p>{stockChangeConfig[type].label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className=" flex items-center text-sm justify-between py-2">
            <label htmlFor="typeChange">
              {changeType === "RECONCILIATION" ? mt("newStockLevel") : "Qty"}
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
            <div className="flex  justify-between py-2">
              <h3>{mt("newStock")}: </h3>
              <span>{calculateNewStock()}</span>
            </div>
          )}

          <div className=" flex flex-col gap-2">
            <label htmlFor="notes">
              {mt("notes")} ({mt("optional")})
            </label>
            <textarea
              name="notes"
              id="notes"
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              rows={3}
              placeholder={mt("addAnyNotes")}
            />
          </div>

          {error && <p>{error}</p>}

          <div className="grid grid-cols-2 py-2 gap-2 ">
            <button
              className="cancel-btn-modal"
              onClick={onClose}
              disabled={loading}
            >
              {t("cancel")}
            </button>
            <button className="px-4 py-1 border rounded-sm  hover:text-gray-800 hover:bg-gray-100">
              {loading ? mt("recording") : mt("recordMovement")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const CreateCategoryModal = ({
  isOpen,
  onClose,
}: CreateCategoryProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const t = useTranslations("Common");
  const mt = useTranslations("Modal");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createCategoryExpense({
          name: name.trim(),
          description: description.trim() || undefined,
        });

        if (result.status !== "success") {
          setName("");
          setDescription("");
          onClose();
          router.refresh();
        } else {
          setError(result.error || "Failed to create category");
        }
      } catch (err) {
        setError("An unexpected error occured:" + err);
      }
    });
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      ></div>

      <div className="category-modal relative">
        <div>
          <h2>{mt("createExpenseCategory")}</h2>
          <button onClick={handleClose} disabled={isPending}>
            x
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="category-name">{t("categoryName")}</label>
            <input
              type="text"
              name="category-name"
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Utilities, Marketing, Transportation"
              disabled={isPending}
              required
            />
          </div>
          <div>
            <label htmlFor="category-description">{t("description")}</label>
            <textarea
              name="category-description"
              id="category-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </div>
          {error && (
            <div>
              <p>{error}</p>
            </div>
          )}
          <div>
            <button type="button" onClick={handleClose} disabled={isPending}>
              {t("cancel")}
            </button>
            <button type="submit" disabled={isPending}>
              {isPending ? t("creating") : t("create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
