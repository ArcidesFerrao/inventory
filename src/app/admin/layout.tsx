import { AdminNav } from "@/components/Navigator";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="admin-main flex gap-5">
      <AdminNav />
      <section className="admin-dash-section flex flex-col gap-5 w-full px-8 ">
        {children}
        <span className="h-4 w-full dash-footer"></span>
      </section>
    </main>
  );
}
