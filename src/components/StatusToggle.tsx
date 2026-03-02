"use client";

import { ItemStatus } from "@/generated/prisma/client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StatusToggle({
  itemId,
  initialStatus,
}: {
  itemId: string;
  initialStatus: ItemStatus;
}) {
  const [status, setStatus] = useState<ItemStatus>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const t = useTranslations("Common");
  const nt = useTranslations("Notifications");
  //   const router = useRouter();

  const statusConfig = {
    ACTIVE: { label: t("active"), color: "bg-green-100 text-green-800" },
    INACTIVE: { label: t("inactive"), color: "bg-yellow-100 text-yellow-800" },
    // OUT_OF_STOCK: { label: "Out of Stock", color: "bg-red-100 text-red-800" },
  };

  const updateStatus = async (newStatus: ItemStatus) => {
    setLoading(true);
    setShowMenu(false);

    try {
      const response = await fetch(`/api/products/${itemId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(nt("updateStatusError"));
      }

      setStatus(newStatus);
    } catch (error) {
      console.error(nt("updateStatusConsole"), error);
      toast.error(nt("updateStatusError"));
      setStatus(status);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative status-toggle">
      <button
        className="status-btn-active px-3 py-1 rounded-xl text-sm font-medium transition-colors"
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading}
      >
        {loading ? "..." : statusConfig[status].label}
      </button>

      {showMenu && !loading && (
        <>
          <div className="inset-0 z-10" onClick={() => setShowMenu(false)}>
            <div className="status-menu absolute top-full left-0  rounded-md shadow-xl z-20">
              {(Object.keys(statusConfig) as ItemStatus[]).map(
                (statusOption) => (
                  <button
                    className="status-btn w-full text-nowrap text-left px-3 py-2 text-sm "
                    key={statusOption}
                    onClick={() => updateStatus(statusOption)}
                  >
                    <span>{statusConfig[statusOption].label}</span>
                  </button>
                ),
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
