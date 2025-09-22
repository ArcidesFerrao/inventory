import { SupplierProductForm } from "@/components/ProductForm";
import React from "react";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <h1 className="text-xl font-semibold">Add New Product</h1>
      <SupplierProductForm />
    </div>
  );
}
