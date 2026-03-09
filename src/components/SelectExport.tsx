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
} from "@/lib/actions/exportData";
import { useTranslations } from "next-intl";

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
  const et = useTranslations("Export");
  const lt = useTranslations("Loading");
  const t = useTranslations("Common");

  const [range, setRange] = useState<"today" | "weekly" | "all">("weekly");
  const [isExporting, setIsExporting] = useState(false);

  const [selectedReport, setSelectedReport] = useState<
    "stock" | "sales" | "purchases" | "logs"
  >("stock");

  const exportOptions = [
    {
      value: "sales",
      label: et("salesReport"),
      description: et("salesDescription"),
    },
    {
      value: "purchases",
      label: et("purchasesReport"),
      description: et("purchasesDescription"),
    },
    {
      value: "stock",
      label: et("stockReport"),
      description: et("stockDescription"),
    },
    {
      value: "logs",
      label: et("logsReport"),
      description: et("logsDescription"),
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
        stock: () => ExportStock({ serviceStockItems, et }),
        purchases: () =>
          ExportPurchases({ purchases: filterByRange(purchases), et }),
        sales: () => ExportSales({ sales: filterByRange(sales), et }),
        logs: () => ExportLogs({ logs: filterByRange(logs), et }),
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
      <h3 className="text-lg font-normal ">{et("dataExport")}</h3>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h4>{et("recordType")}</h4>
          <select
            name="range"
            className="rounded"
            id="range"
            value={range}
            onChange={(e) =>
              setRange(e.target.value as "today" | "weekly" | "all")
            }
          >
            <option value="today">{t("today")}</option>
            <option value="weekly">{t("weekly")}</option>
            <option value="all">{t("all")}</option>
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
          <option value="stock">{et("stockReport")}</option>
          <option value="sales">{et("salesReport")}</option>
          <option value="purchases">{et("purchasesReport")}</option>
          <option value="logs">{et("logsReport")}</option>
        </select>

        <button onClick={handleExport}>
          {isExporting ? lt("exporting") : et("dataExport")}
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
  const et = useTranslations("Export");
  const lt = useTranslations("Loading");
  const t = useTranslations("Common");
  const [range, setRange] = useState<"today" | "weekly" | "all">("weekly");
  const [isExporting, setIsExporting] = useState(false);

  const [selectedReport, setSelectedReport] = useState<
    "stock" | "sales" | "logs"
  >("stock");

  const exportOptions = [
    {
      value: "sales",
      label: et("salesReport"),
      description: et("salesDescription"),
    },
    // {
    //   value: "purchases",
    //   label: et("purchasesReport"),
    //   description: et("purchasesDescription"),
    // },
    {
      value: "stock",
      label: et("stockReport"),
      description: et("stockDescription"),
    },
    {
      value: "logs",
      label: et("logsReport"),
      description: et("logsDescription"),
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
        stock: () => ExportStock({ stockItems, et }),
        // purchases: () =>
        // ExportPurchases({ purchases: filterByRange(purchases) }),
        sales: () => ExportSales({ sales: filterByRange(sales), et }),
        logs: () => ExportSupplierLogs({ logs: filterByRange(logs), et }),
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
      <h3 className="text-lg font-normal ">{et("dataExport")}</h3>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h4>{et("recordType")}</h4>
          <select
            name="range"
            className="rounded"
            id="range"
            value={range}
            onChange={(e) =>
              setRange(e.target.value as "today" | "weekly" | "all")
            }
          >
            <option value="today">{t("today")}</option>
            <option value="weekly">{t("weekly")}</option>
            <option value="all">{t("all")}</option>
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
          <option value="stock">{et("stockReport")}</option>
          <option value="sales">{et("salesReport")}</option>
          {/* <option value="purchases">{et("purchasesReport")}</option> */}
          <option value="logs">{et("logsReport")}</option>
        </select>

        <button onClick={handleExport}>
          {isExporting ? lt("exporting") : et("exportData")}
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
