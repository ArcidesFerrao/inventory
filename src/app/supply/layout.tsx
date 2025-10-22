import { SupplyNav } from "@/components/Navigator";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="dashboard-main flex gap-5">
      <SupplyNav />
      <section className="dash-section flex flex-col w-full p-8 ">
        {children}
        <span className="h-4 w-full dash-footer"></span>
      </section>
    </main>
  );
}
