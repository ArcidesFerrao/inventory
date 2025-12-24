"use client";

import { StockMovement } from "@/generated/prisma/client";
import { useEffect, useState } from "react";

export default function StockHistory({ stockItemId }: { stockItemId: string }) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/stock-movement?stockItemId=${stockItemId}`)
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
    <div className="stock-movement rounded-sm overflow-hidden p-2">
      <div className="p-2 ">
        <h2 className="text-md font-semibold">Stock Movement History</h2>
      </div>
      {/* <div className="divide-y"> */}
      {movements.map((movement) => (
        <div className="stock-history-info px-2 py-1" key={movement.id}>
          <div className=" flex items-center gap-2 text-sm">
            <span>{movement.changeType}</span>
            <span>Quantity: {movement.quantity}</span>
            {movement.notes && <span>{movement.notes}</span>}
          </div>
          <span className="text-xs">
            {new Date(movement.timestamp).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}
