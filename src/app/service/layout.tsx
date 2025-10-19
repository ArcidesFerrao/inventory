import { ServiceNav } from "@/components/Navigator";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="dashboard-main flex gap-5">
      <ServiceNav />
      <section className="dash-section flex w-full p-8 rounded">
        {children}
      </section>
    </main>
  );
}
