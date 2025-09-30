import { SupplierRegisterForm } from "@/components/RegisterForm";
import React from "react";

export default function SupplierRegisterPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-medium">Register Supplier</h2>
      <SupplierRegisterForm />
    </div>
  );
}
