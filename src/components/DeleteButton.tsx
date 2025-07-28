"use client";

import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";

export default function DeleteButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDelete = () => {
    startTransition(async () => {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
        },
      });

      if (res.ok) {
        toast.success("Product deleted successfully");
        window.location.reload();
      } else {
        const { error } = await res.json();
        toast.error("something went wrong!");
        console.log("Error deleting product: ", error);
      }
    });
  };

  return (
    <>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDialogOpen(false)}
        title="Delete this product?"
        description="This cannot be undone."
      />
      <button
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
        className="delete-button p-2 flex"
      >
        <span className="mdi--delete"></span>
      </button>
    </>
  );
}
