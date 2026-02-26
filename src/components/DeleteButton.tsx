"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";
import { deleteStockItem } from "@/lib/actions/product";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const StockItemDeleteButton = ({
  stockItemId,
}: {
  stockItemId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("Notifications");

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteStockItem(stockItemId);

      if (res.status === "success") {
        toast.success(t("stockDeletedSuccess"));
        router.push("/supply/products");
      } else {
        const error = await res.error;
        toast.error(t("stockDeletedError"));
        console.log("Error deleting item: ", error);
      }
    });
  };

  return (
    <>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDialogOpen(false)}
        title={t("deleteItem")}
        description={t("thisCannotBeUndone")}
      />
      <button
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
        className="delete-button px-2 py-2 flex items-center"
      >
        <span className="mdi--delete"></span>
      </button>
    </>
  );
};

export const DeleteButton = ({ itemId }: { itemId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("Notifications");
  const ct = useTranslations("Common");

  const handleDelete = () => {
    startTransition(async () => {
      const res = await fetch(`/api/products/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
        },
      });

      if (res.ok) {
        toast.success(t("stockDeletedSuccess"));
        router.push("/service/products");
      } else {
        const { error } = await res.json();
        toast.error(t("stockDeletedError"));
        console.log("Error deleting item: ", error);
      }
    });
  };

  return (
    <>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDialogOpen(false)}
        title={ct("deleteItem")}
        description={ct("thisCannotBeUndone")}
      />
      <button
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
        className="delete-button px-2 py-2 flex items-center"
      >
        <span className="mdi--delete"></span>
      </button>
    </>
  );
};
export const DeleteOrderButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("Notifications");

  const handleDelete = () => {
    startTransition(async () => {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
        },
      });

      if (res.ok) {
        toast.success(t("orderDeletedSuccess"));
        router.push("/service/orders");
      } else {
        const { error } = await res.json();
        toast.error(t("orderDeletedError"));
        console.log("Error deleting order: ", error);
      }
    });
  };

  return (
    <>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDialogOpen(false)}
        title={t("deleteItem")}
        description={t("thisCannotBeUndone")}
      />
      <button
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
        className="delete-button px-3 py-2 flex items-center"
      >
        <span className="mdi--delete"></span>
      </button>
    </>
  );
};
