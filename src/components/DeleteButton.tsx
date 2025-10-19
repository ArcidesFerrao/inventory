"use client";

import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";
import { deleteSupplierProduct } from "@/app/actions/product";
import { useRouter } from "next/navigation";

export const SupplierProductDeleteButton = ({
  supplierProductId,
}: {
  supplierProductId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteSupplierProduct(supplierProductId);

      if (res.status === "success") {
        toast.success("Supplier Product deleted successfully");
        router.push("/supply/products");
      } else {
        const error = await res.error;
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
        className="delete-button px-2 py-2 flex items-center"
      >
        <span className="mdi--delete"></span>
      </button>
    </>
  );
};
export const DeleteButton = ({ productId }: { productId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

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
        router.push("/service/products");
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
        toast.success("Product deleted successfully");
        router.push("/service/orders");
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
        className="delete-button px-3 py-2 flex items-center"
      >
        <span className="mdi--delete"></span>
      </button>
    </>
  );
};
