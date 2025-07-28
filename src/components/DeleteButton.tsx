import React, { useTransition } from "react";

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
        alert("Product deleted");
        window.location.reload();
      } else {
        const { error } = await res.json();
        alert(error || "Delete failed");
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
