"use client";

import { redirect } from "next/navigation";
import React from "react";

export default function DashMenu({ isAdmin }: { isAdmin: boolean }) {
  return (
    <section className="dash-menu flex gap-5 py-5">
      {/* <button className="p-4" onClick={() => redirect("/stock")}>
        <span className="carbon--dashboard"></span>
        <p>Stock Management</p>
      </button> */}
      <button className="p-4" onClick={() => redirect("/service")}>
        <span className="fa7-solid--store"></span>
        <p>Service Management</p>
      </button>
      <button className="p-4" onClick={() => redirect("/supply")}>
        <span className="solar--delivery-bold"></span>
        <p>Supplier Management</p>
      </button>
      {isAdmin === true && (
        <button className="p-4" onClick={() => redirect("/admin")}>
          <span className="eos-icons--admin-outlined"></span>
          <p>Admin</p>
        </button>
      )}
    </section>
  );
}
