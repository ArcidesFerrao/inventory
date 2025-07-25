import { Navigator } from "@/components/Navigator";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="dashboard-main flex gap-5">
      <Navigator />
      <section className="dash-section flex w-full min-h-screen rounded p-4">
        {children}
      </section>
    </main>
  );
}
