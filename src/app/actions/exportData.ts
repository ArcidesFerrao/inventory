import {
  ActivityLog,
  Item,
  Purchase,
  Sale,
  ServiceStockItem,
  StockItem,
} from "@/generated/prisma/client";
import { JsonValue } from "@prisma/client/runtime/client";
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


export function ExportLogs({ logs }: { logs: LogWithItems[] }) {
  
    try {
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
    } catch (error) {
        console.error("Error exporting logs to PDF:", error);
    }
}


export function ExportSales({ sales }: { sales: SaleWithItems[] }) {
    try{
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
    } catch (error) {
        console.error("Error exporting sales to PDF:", error);
    }
};

export function ExportPurchases({
  purchases,
}: {
  purchases: PurchaseWithItems[];
}) {
  try {
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
  }catch (error) {
    console.error("Error exporting purchases to PDF:", error);
  }
};

export function ExportStock({
  stockItems,
}: {
  stockItems: (ServiceStockItem & { stockItem: StockItem })[];
}) {
  try {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Stock Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Item", "Quantity", "Cost (MZN)"]],
      body: stockItems.map((s) => [
        s.stockItem.name,
        s.stock,
        s.stockItem.price?.toFixed(2) || "0.00",
      ]),
    });
    doc.save("stock_report.pdf");
  } catch (error) {
    console.error("Error exporting stock to PDF:", error);
  }
};