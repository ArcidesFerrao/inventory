"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ActivityLog,
  Item,
  Purchase,
  Sale,
  ServiceStockItem,
  StockItem,
} from "@/generated/prisma/client";
import { useState } from "react";
import { SupplierSaleWithItems } from "@/types/types";
import { JsonValue } from "@prisma/client/runtime/client";

type ExportProps = {
  stockItem: StockItem[];
  sales: SupplierSaleWithItems[];
  logs: LogWithItems[];
};
type Props = {
  stockItems: (ServiceStockItem & { stockItem: StockItem })[];
  purchases: PurchaseWithItems[];
  sales: SaleWithItems[];
  logs: LogWithItems[];
};

type PurchaseWithItems = Purchase & {
  PurchaseItem: {
    id: string;
    price: number;
    quantity: number;
    purchaseId: string;
    stockItem: StockItem | null;
    item: Item | null;
  }[];
};

type SaleWithItems = Sale & {
  SaleItem: {
    id: string;
    price: number;
    quantity: number;
    saleId: string;
    itemId: string | null;
    item: Item | null;
  }[];
};

type LogWithItems = ActivityLog & {
  id: string;
  actionType: string;
  description: string;
  timestamp: Date;
  details: JsonValue;
};

type ParsedDetails = {
  total: number;
  items: LogItem[];
};
type LogItem = {
  id: string;
  name: string;
  quantity: number;
  cost: number;
  price?: number;
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
        new Date(sale.timestamp).toLocaleDateString(),
        sale.total.toFixed(2),
        sale.cogs.toFixed(2),
      ]),
    });

    sales.forEach((sale) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const startY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(14);
      doc.text(
        `Items for sale on ${new Date(sale.timestamp).toLocaleDateString()}`,
        14,
        startY
      );

      autoTable(doc, {
        startY: startY + 5,
        head: [["Item", "Quantity", "Price (MZN)"]],
        body: sale.SaleItem.map((i) => [
          i.item?.name || "Unknown",
          i.quantity,
          i.price.toFixed(2),
        ]),
      });
    });
    doc.save("sales_report.pdf");
  };
  return <button onClick={handleExport}>Sales Report</button>;
};
export const ExportSupplierSalesPdf = ({
  sales,
}: {
  sales: SupplierSaleWithItems[];
}) => {
  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Sales Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Total Amount (MZN)", "Cost of Goods Sold (MZN)"]],
      body: sales.map((sale) => [
        new Date(sale.timestamp).toLocaleDateString(),
        sale.total.toFixed(2),
        sale.cogs.toFixed(2),
      ]),
    });

    sales.forEach((sale) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const startY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(14);
      doc.text(
        `Items for sale on ${new Date(sale.timestamp).toLocaleDateString()}`,
        14,
        startY
      );

      autoTable(doc, {
        startY: startY + 5,
        head: [["Item", "Quantity", "Price (MZN)"]],
        body: sale.SaleItem.map((i) => [
          i.stockItem?.name || "Unknown",
          i.quantity,
          i.price.toFixed(2),
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
        new Date(purchase.timestamp).toLocaleDateString(),
        purchase.total.toFixed(2),
      ]),
    });

    purchases.forEach((purchase) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const startY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(14);
      doc.text(
        `Items for sale on ${new Date(
          purchase.timestamp
        ).toLocaleDateString()}`,
        14,
        startY
      );

      autoTable(doc, {
        startY: startY + 5,
        head: [["Item", "Quantity", "Cost (MZN)"]],
        body: purchase.PurchaseItem.map((i) => [
          i.stockItem?.name || i.item?.name || "Unknown",
          i.quantity,
          i.stockItem?.price?.toFixed(2) || i.item?.price || "0.00",
        ]),
      });
    });
    doc.save("purchases_report.pdf");
  };
  return <button onClick={handleExport}>Purchases Report</button>;
};

export const ExportStockPdf = ({
  stockItem,
}: {
  stockItem: (ServiceStockItem & {
    stockItem: StockItem;
  })[];
}) => {
  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Stock Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Item", "Quantity", "Cost (MZN)"]],
      body: stockItem.map((s) => [
        s.stockItem.name,
        s.stock,
        s.stockItem.price?.toFixed(2) || "0.00",
      ]),
    });
    doc.save("stock_report.pdf");
  };
  return <button onClick={handleExport}>Stock Report</button>;
};
export const ExportSupplierStockPdf = ({ stock }: { stock: StockItem[] }) => {
  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Stock Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Item", "Quantity", "Cost (MZN)"]],
      body: stock.map((s) => [s.name, s.stock, s.price?.toFixed(2) || "0.00"]),
    });
    doc.save("stock_report.pdf");
  };
  return <button onClick={handleExport}>Stock Report</button>;
};

export const ExportLogsPdf = ({ logs }: { logs: LogWithItems[] }) => {
  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Activity Logs Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Action", "Description", "Details", "Timestamp"]],
      body: (logs ?? []).map((log) => {
        const parsedDetails = log.details as ParsedDetails;
        return [
          log.actionType,
          log.description,
          parsedDetails?.items
            ? parsedDetails.items
                .map(
                  (item) =>
                    `${item.name} - MZN ${item.cost || item.price} x ${
                      item.quantity
                    }`
                )
                .join("\n")
            : "",
          // log.details ? JSON.stringify(log.details) : "",
          new Date(log.timestamp).toLocaleDateString(),
        ];
      }),
    });

    doc.save("logs_report.pdf");
  };
  return <button onClick={handleExport}>Activity Logs Report</button>;
};

export function ExportSelection({ stockItems, purchases, sales, logs }: Props) {
  const [range, setRange] = useState<"today" | "weekly" | "all">("weekly");

  function filterByRange<T extends { timestamp: Date }>(data: T[]) {
    const now = new Date();

    if (range === "today") {
      return data.filter(
        (d) => new Date(d.timestamp).toDateString() === now.toDateString()
      );
    } else if (range === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return data.filter((d) => new Date(d.timestamp) >= weekAgo);
    }

    return data;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="export-header flex gap-4 items-center  justify-between">
        <h4 className="font-medium">Export Data</h4>
        <div>
          <ExportStockPdf stockItem={stockItems} />
          <ExportLogsPdf logs={logs} />
        </div>
      </div>
      <div className="flex flex-col gap-2 py-4">
        <div className="range-select flex gap-2 items-center justify-between">
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
        <div className="flex flex-col">
          <ExportSalesPdf sales={filterByRange(sales)} />
          <ExportPurchasesPdf purchases={filterByRange(purchases)} />
        </div>
      </div>
    </div>
  );
}
export function SupplierExportSelection({
  stockItem,
  sales,
  logs,
}: ExportProps) {
  const [range, setRange] = useState<"today" | "weekly" | "all">("weekly");

  function filterByRange<T extends { timestamp: Date }>(data: T[]) {
    const now = new Date();

    if (range === "today") {
      return data.filter(
        (d) => new Date(d.timestamp).toDateString() === now.toDateString()
      );
    } else if (range === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return data.filter((d) => new Date(d.timestamp) >= weekAgo);
    }

    return data;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="export-header flex gap-4 items-center  justify-between">
        <h4 className="font-medium">Export Data</h4>
        <div>
          <ExportSupplierStockPdf stock={stockItem} />
          <ExportLogsPdf logs={logs} />
        </div>
      </div>
      <div className="flex flex-col gap-2 py-4">
        <div className="range-select flex gap-2 items-center justify-between">
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
        <div className="flex flex-col">
          <ExportSupplierSalesPdf sales={filterByRange(sales)} />
        </div>
      </div>
    </div>
  );
}
