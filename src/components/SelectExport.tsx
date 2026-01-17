"use client";

import { useState } from "react";
import {
  ActivityLog,
  Item,
  Purchase,
  Sale,
  ServiceStockItem,
  StockItem,
  Unit,
} from "@/generated/prisma/client";
import {
  ExportLogs,
  ExportPurchases,
  ExportSales,
  ExportStock,
  ExportSupplierLogs,
} from "@/app/actions/exportData";

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

type LogWithItems = ActivityLog;

type Props = {
  serviceStockItems: (ServiceStockItem & { stockItem: StockItem })[];
  purchases: PurchaseWithItems[];
  sales: SaleWithItems[];
  logs: LogWithItems[];
};
type SupplierProps = {
  stockItems: (StockItem & { unit: Unit | null })[];
  // purchases: PurchaseWithItems[];
  sales: SaleWithItems[];
  logs: LogWithItems[];
};

export function SelectExport({
  serviceStockItems,
  purchases,
  sales,
  logs,
}: Props) {
  const [range, setRange] = useState<"today" | "weekly" | "all">("weekly");
  const [isExporting, setIsExporting] = useState(false);

  const [selectedReport, setSelectedReport] = useState<
    "stock" | "sales" | "purchases" | "logs"
  >("stock");

  const exportOptions = [
    {
      value: "sales",
      label: "Sales Report",
      description:
        "Export sales transactions, revenue data, and customer purchase history.",
    },
    {
      value: "purchases",
      label: "Purchases Report",
      description:
        "Export all purchase orders, supplier transactions, and inventory restocking data.",
    },
    {
      value: "stock",
      label: "Stock Report",
      description:
        "Export current inventory levels, stock status, and product details.",
    },
    {
      value: "logs",
      label: "Activity Logs Report",
      description:
        "Export system activity logs, user actions, and transaction history.",
    },
  ];

  function filterByRange<T extends { timestamp: Date }>(data: T[]) {
    const now = new Date();

    if (range === "today") {
      return data.filter(
        (d) => new Date(d.timestamp).toDateString() === now.toDateString(),
      );
    } else if (range === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return data.filter((d) => new Date(d.timestamp) >= weekAgo);
    }

    return data;
  }

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const exportMap = {
        stock: () => ExportStock({ serviceStockItems }),
        purchases: () =>
          ExportPurchases({ purchases: filterByRange(purchases) }),
        sales: () => ExportSales({ sales: filterByRange(sales) }),
        logs: () => ExportLogs({ logs: filterByRange(logs) }),
      };

      exportMap[selectedReport]();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const selectedExportOption = exportOptions.find(
    (option) => option.value === selectedReport,
  );

  return (
    <div className="settings-section flex flex-col gap-4 p-4">
      <h3 className="text-lg font-normal ">Data Export</h3>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h4>Report Type</h4>
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
        <select
          name="reportType"
          id="reportType"
          value={selectedReport}
          onChange={(e) =>
            setSelectedReport(
              e.target.value as "stock" | "sales" | "purchases" | "logs",
            )
          }
        >
          <option value="stock">Stock Report</option>
          <option value="sales">Sales Report</option>
          <option value="purchases">Purchases Report</option>
          <option value="logs">Activity Logs Report</option>
        </select>

        <button onClick={handleExport}>
          {isExporting ? "Exporting..." : "Export Data"}
        </button>

        <div className="flex flex-col gap-2">
          <h3>{selectedExportOption?.label}</h3>
          <p className="font-thin text-sm">
            {selectedExportOption?.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SupplierSelectExport({
  stockItems,
  // purchases,
  sales,
  logs,
}: SupplierProps) {
  const [range, setRange] = useState<"today" | "weekly" | "all">("weekly");
  const [isExporting, setIsExporting] = useState(false);

  const [selectedReport, setSelectedReport] = useState<
    "stock" | "sales" | "logs"
  >("stock");

  const exportOptions = [
    {
      value: "sales",
      label: "Sales Report",
      description:
        "Export sales transactions, revenue data, and customer purchase history.",
    },
    // {
    //   value: "purchases",
    //   label: "Purchases Report",
    //   description:
    //     "Export all purchase orders, supplier transactions, and inventory restocking data.",
    // },
    {
      value: "stock",
      label: "Stock Report",
      description:
        "Export current inventory levels, stock status, and product details.",
    },
    {
      value: "logs",
      label: "Activity Logs Report",
      description:
        "Export system activity logs, user actions, and transaction history.",
    },
  ];

  function filterByRange<T extends { timestamp: Date }>(data: T[]) {
    const now = new Date();

    if (range === "today") {
      return data.filter(
        (d) => new Date(d.timestamp).toDateString() === now.toDateString(),
      );
    } else if (range === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return data.filter((d) => new Date(d.timestamp) >= weekAgo);
    }

    return data;
  }

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const exportMap = {
        stock: () => ExportStock({ stockItems }),
        // purchases: () =>
        // ExportPurchases({ purchases: filterByRange(purchases) }),
        sales: () => ExportSales({ sales: filterByRange(sales) }),
        logs: () => ExportSupplierLogs({ logs: filterByRange(logs) }),
      };

      exportMap[selectedReport]();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const selectedExportOption = exportOptions.find(
    (option) => option.value === selectedReport,
  );

  return (
    <div className="settings-section flex flex-col gap-4 p-4">
      <h3 className="text-lg font-normal ">Data Export</h3>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h4>Report Type</h4>
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
        <select
          name="reportType"
          id="reportType"
          value={selectedReport}
          onChange={(e) =>
            setSelectedReport(e.target.value as "stock" | "sales" | "logs")
          }
        >
          <option value="stock">Stock Report</option>
          <option value="sales">Sales Report</option>
          {/* <option value="purchases">Purchases Report</option> */}
          <option value="logs">Activity Logs Report</option>
        </select>

        <button onClick={handleExport}>
          {isExporting ? "Exporting..." : "Export Data"}
        </button>

        <div className="flex flex-col gap-2">
          <h3>{selectedExportOption?.label}</h3>
          <p className="font-thin text-sm">
            {selectedExportOption?.description}
          </p>
        </div>
      </div>
    </div>
  );
}
