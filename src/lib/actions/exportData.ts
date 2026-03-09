import {
  ActivityLog,
  DeliveryItem,
  Item,
  Purchase,
  Sale,
  ServiceStockItem,
  StockItem,
  Unit,
} from "@/generated/prisma/client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
type SupplierSaleWithItems = Sale & {
  SaleItem: {
    id: string;
    price: number;
    quantity: number;
    saleId: string;
    stockItemId: string | null;
    stockItem: StockItem | null;
  }[];
};

type LogWithItems = ActivityLog;

type ParsedDetails = {
  items: LogItem[];
  totalItems: number;
};
type ParsedSupplierDetails = {
  items: SupplierLogItem[];
  totalItems: number;
};
type LogItem = {
  id: string;
  price?: number;
  
  name: string;
  orderedQty: number;
  cost: number;
  quantity: number;
} & { stockItem: StockItem | null };

type SupplierLogItem = DeliveryItem & { stockItem: StockItem | null };


export function ExportLogs({ logs, et }: { logs: LogWithItems[]; et: (key: string) => string }) {
  
    try {
        const doc = new jsPDF();
        
            doc.setFontSize(16);
            doc.text(`${et("logsReport")}`, 14, 20);
        
            autoTable(doc, {
              startY: 30,
              head: [[`${et("action")}`, `${et("description")}`, `${et("details")}`, `${et("timestamp")}`]],
              body: (logs ?? []).map((log) => {
                const parsedDetails = log.details as ParsedDetails;
                return [
                  log.actionType,
                  log.description,
                  parsedDetails?.items
                    ? parsedDetails.items
                        .map(
                          (item) =>
                            `${item.stockItem?.name || item.name} - MZN ${item.cost || item.price} x ${
                              item.orderedQty || item.quantity
                            }`
                        )
                        .join("\n")
                    : "",
                  new Date(log.timestamp).toLocaleDateString(),
                ];
              }),
            });
        
            doc.save(`${et("logsReportPDF")}`);
    } catch (error) {
        console.error("Error exporting logs to PDF:", error);
    }
}


export function ExportSales({ sales, et }: { sales: SaleWithItems[]; et: (key: string) => string }) {
  // const et = useTranslations("Export")

    try{
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`${et("salesReport")}`, 14, 20);

        autoTable(doc, {
        startY: 30,
        head: [[`${et("date")}`, `${et("totalAmount")}`, `${et("cogs")}`]],
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
            `${et("itemsForSaleOn")} ${new Date(sale.timestamp).toLocaleDateString()}`,
            14,
            startY
        );

        autoTable(doc, {
            startY: startY + 5,
            head: [["Item", `${et("quantity")}`, `${et("price")}`]],
            body: sale.SaleItem.map((i) => [
            i.item?.name ||  `${et("unknown")}`,
            i.quantity,
            i.price.toFixed(2),
            ]),
        });
        });
        doc.save(`${et("salesReportPDF")}`);
    } catch (error) {
        console.error("Error exporting sales to PDF:", error);
    }
};

export function ExportPurchases({
  purchases,
  et
}: {
  purchases: PurchaseWithItems[];
  et: (key: string) => string 
}) {
  try {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`${et("purchasesReport")}`, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [[`${et("date")}`, `${et("totalAmount")}`]],
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
        `${et("itemsPurchasedOn")} ${new Date(
          purchase.timestamp
        ).toLocaleDateString()}`,
        14,
        startY
      );

      autoTable(doc, {
        startY: startY + 5,
        head: [["Item", `${et("quantity")}`, `${et("cost")}`]],
        body: purchase.PurchaseItem.map((i) => [
          i.stockItem?.name || i.item?.name || `${et("unknown")}`,
          i.quantity,
          i.stockItem?.price?.toFixed(2) || i.item?.price || "0.00",
        ]),
      });
    });
    doc.save(`${et("purchasesReportPDF")}`);
  }catch (error) {
    console.error("Error exporting purchases to PDF:", error);
  }
};

export function ExportStock({
  serviceStockItems,
  stockItems,
  et
}: {
  stockItems?: (StockItem & { unit: Unit | null })[] 
  serviceStockItems?: (ServiceStockItem & { stockItem: (StockItem & { unit: Unit | null })})[];
  et: (key: string) => string 
}) {
  try {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`${et("stockReport")}`, 14, 20);

    if (serviceStockItems) {
      
      autoTable(doc, {
        startY: 30,
        head: [["Item", `${et("quantity")}`, `${et("stockQuantity")}`, `${et("cost")}`]],
        body: [...serviceStockItems].sort((a, b) =>
      (a.stockItem?.name ?? "").localeCompare(b.stockItem?.name ?? "")).map((s) => [
          s.stockItem?.name ,
          s.stock,
          `${s.stockQty} ${s.stockItem.unit?.name !== "unit" ? s.stockItem.unit?.name : ""}`,
          s.stockItem.price?.toFixed(2) || "0.00",
        ]),
      });
      doc.save("stock_report.pdf");
    }

    if (stockItems) {
      autoTable(doc, {
        startY: 30,
        head: [["Item", `${et("quantity")}`, `${et("cost")}`]],
        body: [...stockItems].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")).map((s) => [
          s.name,
          s.stock,
          s.cost?.toFixed(2) || "0.00",
        ]),
      });
      doc.save(`${et("stockReportPDF")}`);
    }
  } catch (error) {
    console.error("Error exporting stock to PDF:", error);
  }
};




export function ExportSupplierLogs({ logs, et }: { logs: LogWithItems[]; et: (key: string) => string }) {
  
    try {
        const doc = new jsPDF();
        
            doc.setFontSize(16);
            doc.text(`${et("logsReport")}`, 14, 20);
        
            autoTable(doc, {
              startY: 30,
              head: [[`${et("action")}`, `${et("description")}`, `${et("details")}`, `${et("timestamp")}`]],
              body: (logs ?? []).map((log) => {
                const parsedDetails = log.details as ParsedSupplierDetails;
                return [
                  log.actionType,
                  log.description,
                  parsedDetails?.items
                    ? parsedDetails.items
                        .map(
                          (item) =>
                            `${item.stockItem?.name} - MZN ${item.stockItem?.price || 0} x ${item.quantity}`
                        )
                        .join("\n")
                    : "",
                  // log.details ? JSON.stringify(log.details) : "",
                  new Date(log.timestamp).toLocaleDateString(),
                ];
              }),
            });
        
            doc.save(`${et("logsReport")}`);
    } catch (error) {
        console.error("Error exporting logs to PDF:", error);
    }
}


export function ExportSupplierSales({ sales, et }: { sales: SupplierSaleWithItems[]; et: (key: string) => string }) {
    try{
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`${et("salesReport")}`, 14, 20);

        autoTable(doc, {
        startY: 30,
        head: [[`${et("date")}`, `${et("totalAmount")}`, `${et("cogs")}`]],
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
            `${et("itemsForSaleOn")} ${new Date(sale.timestamp).toLocaleDateString()}`,
            14,
            startY
        );

        autoTable(doc, {
            startY: startY + 5,
            head: [["Item", `${et("quantity")}`, `${et("price")}`]],
            body: sale.SaleItem.map((i) => [
            i.stockItem?.name || `${et("unknown")}`,
            i.quantity,
            i.price.toFixed(2),
            ]),
        });
        });
        doc.save(`${et("salesReportPDF")}`);
    } catch (error) {
        console.error("Error exporting sales to PDF:", error);
    }
};
