"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Product, Purchase, Sale } from "@prisma/client";
import React, { useState } from "react";

type Props = {
  stock: Product[];
  purchases: PurchaseWithItems[];
  sales: SaleWithItems[];
};

type PurchaseWithItems = Purchase & {
  PurchaseItem: {
    id: string;
    price: number;
    quantity: number;
    purchaseId: string;
    product: Product | null;
  }[];
};

type SaleWithItems = Sale & {
  SaleItem: {
    id: string;
    price: number;
    quantity: number;
    saleId: string;
    productId: string;
    product: Product | null;
  }[];
};

export const ExportSalesPdf = ({ sales }: { sales: SaleWithItems[] }) => {
  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Sales Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Total Amount (MZN)", "Cost of Goods Sold (MZN)"]],
      body: sales.map((sale) => [
        new Date(sale.date).toLocaleDateString(),
        sale.total.toFixed(2),
        sale.cogs.toFixed(2),
      ]),
    });

    sales.forEach((sale) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const startY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(14);
      doc.text(
        `Products for sale on ${new Date(sale.date).toLocaleDateString()}`,
        14,
        startY
      );

      autoTable(doc, {
        startY: startY + 5,
        head: [["Product", "Quantity", "Price (MZN)"]],
        body: sale.SaleItem.map((item) => [
          item.product?.name || "Unknown",
          item.quantity,
          item.price.toFixed(2),
        ]),
      });
    });
    doc.save("sales_report.pdf");
  };
  return <button onClick={handleExport}>Sales Report</button>;
};

export const ExportPurchasesPdf = ({
  purchases,
}: {
  purchases: PurchaseWithItems[];
}) => {
  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Purchases Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Total Amount (MZN)"]],
      body: purchases.map((purchase) => [
        new Date(purchase.date).toLocaleDateString(),
        purchase.total.toFixed(2),
      ]),
    });

    purchases.forEach((purchase) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const startY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(14);
      doc.text(
        `Products for sale on ${new Date(purchase.date).toLocaleDateString()}`,
        14,
        startY
      );

      autoTable(doc, {
        startY: startY + 5,
        head: [["Product", "Quantity", "Cost (MZN)"]],
        body: purchase.PurchaseItem.map((item) => [
          item.product?.name || "Unknown",
          item.quantity,
          item.product?.cost?.toFixed(2) || "0.00",
        ]),
      });
    });
    doc.save("purchases_report.pdf");
  };
  return <button onClick={handleExport}>Purchases Report</button>;
};

export const ExportStockPdf = ({ stock }: { stock: Product[] }) => {
  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Stock Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Product", "Quantity", "Cost (MZN)"]],
      body: stock.map((s) => [s.name, s.stock, s.cost?.toFixed(2) || "0.00"]),
    });
    doc.save("stock_report.pdf");
  };
  return <button onClick={handleExport}>Stock Report</button>;
};

export default function ExportSelection({ stock, purchases, sales }: Props) {
  const [range, setRange] = useState<"today" | "weekly" | "all">("weekly");

  function filterByRange<T extends { date: Date }>(data: T[]) {
    const now = new Date();

    if (range === "today") {
      return data.filter(
        (d) => new Date(d.date).toDateString() === now.toDateString()
      );
    } else if (range === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return data.filter((d) => new Date(d.date) >= weekAgo);
    }

    return data;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="export-header flex gap-4 items-center  justify-between">
        <h4 className="font-medium">Export Data</h4>
        <div className="range-select flex gap-2 items-center">
          <label htmlFor="range">Range:</label>
          <select
            name="range"
            className="rounded"
            id="range"
            value={range}
            onChange={(e) =>
              setRange(e.target.value as "today" | "weekly" | "all")
            }
          >
            <option value="today">Today</option>
            <option value="weekly">Last 7 days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <ExportStockPdf stock={stock} />
        <ExportSalesPdf sales={filterByRange(sales)} />
        <ExportPurchasesPdf purchases={filterByRange(purchases)} />
      </div>
    </div>
  );
}
