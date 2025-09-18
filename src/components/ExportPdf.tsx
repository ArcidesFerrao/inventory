"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Product, Purchase, Sale } from "@prisma/client";
import React from "react";

type SaleWithItems = Sale & {
  SaleItem: {
    id: string;
    price: number;
    quantity: number;
    saleId: string;
    productId: string;
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
        head: [["ProductId", "Quantity", "Price (MZN)"]],
        body: sale.SaleItem.map((item) => [
          item.id,
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
  purchases: Purchase[];
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
