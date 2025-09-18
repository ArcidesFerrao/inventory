"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Product, Purchase, Sale } from "@prisma/client";
import React from "react";

export const ExportSalesPdf = ({ sales }: { sales: Sale[] }) => {
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
