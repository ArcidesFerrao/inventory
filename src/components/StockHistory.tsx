import { StockMovement } from "@/generated/prisma/client";
import React, { useEffect, useState } from "react";

export default function StockHistory({
  supplierProductId,
}: {
  supplierProductId: string;
}) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/stock-movements?supplierProductId=${supplierProductId}`)
      .then((res) => res.json())
      .then((data) => {
        setMovements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [supplierProductId]);

  if (loading) return <p>Loading History...</p>;

  if (movements.length === 0) {
    return <p>No stock movements recorded</p>;
  }

  return (
    <div>
      <div>
        <h2>Stock Movement History</h2>
      </div>
      <div className="divide-y">
        {movements.map((movement) => (
          <div className="" key={movement.id}>
            <div>
              <div>
                <span>{movement.changeType}</span>
                <span>Quantity: {movement.quantity}</span>
                {movement.notes && <span>{movement.notes}</span>}
              </div>
            </div>
            <div>{new Date(movement.timestamp).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
