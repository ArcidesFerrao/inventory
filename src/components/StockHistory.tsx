"use client";

import { StockMovement } from "@/generated/prisma/client";
import { useEffect, useState } from "react";

export default function StockHistory({ stockItemId }: { stockItemId: string }) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/stock-movement?supplierProductId=${stockItemId}`)
      .then((res) => res.json())
      .then((data) => {
        setMovements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [stockItemId]);

  if (loading) return <p>Loading History...</p>;

  if (movements.length === 0) {
    return <p>No stock movements recorded</p>;
  }

  return (
    <div className="border rounded-sm overflow-hidden">
      <div className="px-2 py-1 ">
        <h2>Stock Movement History</h2>
      </div>
      <div className="divide-y">
        {movements.map((movement) => (
          <div className="p-4" key={movement.id}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span>{movement.changeType}</span>
                <span>Quantity: {movement.quantity}</span>
                {movement.notes && (
                  <span className="text-sm ">{movement.notes}</span>
                )}
              </div>
            </div>
            <span className="text-xs">
              {new Date(movement.timestamp).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
