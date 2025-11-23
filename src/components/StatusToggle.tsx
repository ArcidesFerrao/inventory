"use client";

import { ProductStatus } from "@/generated/prisma/enums";
// import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function StatusToggle({
  productId,
  initialStatus,
}: {
  productId: string;
  initialStatus: ProductStatus;
}) {
  const [status, setStatus] = useState<ProductStatus>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  //   const router = useRouter();

  const statusConfig = {
    ACTIVE: { label: "Active", color: "bg-green-100 text-green-800" },
    DRAFT: { label: "Draft", color: "bg-yellow-100 text-yellow-800" },
    OUT_OF_STOCK: { label: "Out of Stock", color: "bg-red-100 text-red-800" },
  };

  const updateStatus = async (newStatus: ProductStatus) => {
    setLoading(true);
    setShowMenu(false);

    try {
      const response = await fetch(`/api/products/${productId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setStatus(newStatus);
      //   router.refresh();
    } catch (error) {
      console.error("Error updating status: ", error);
      toast.error("Failed to update product status");
      setStatus(status);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative">
      <button onClick={() => setShowMenu(!showMenu)} disabled={loading}>
        {loading ? "..." : statusConfig[status].label}
      </button>

      {showMenu && !loading && (
        <>
          <div onClick={() => setShowMenu(false)}>
            <div className="flex flex-col gap-2">
              {(Object.keys(statusConfig) as ProductStatus[]).map(
                (statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => updateStatus(statusOption)}
                  >
                    <span>{statusConfig[statusOption].label}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
