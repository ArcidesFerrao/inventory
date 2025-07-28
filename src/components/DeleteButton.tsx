import React, { useTransition } from "react";
import toast from "react-hot-toast";

export default function DeleteButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = confirm("Are you sure you want to delete this product?");

    if (!confirmed) return;

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
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="delete-button p-2 flex"
    >
      <span className="mdi--delete"></span>
    </button>
  );
}
