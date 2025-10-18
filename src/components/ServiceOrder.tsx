"use client";

import { SupplierWithProducts } from "@/types/types";
// import { Supplier } from "@prisma/client";
import React, { useState } from "react";
// import { OrderListItem } from "./List";
import { OrdersList } from "./OrdersList";

export const ServiceOrder = ({
  suppliers,
}: {
  suppliers: SupplierWithProducts[];
}) => {
  const [toggleSupplier, setToggleSupplier] = useState<string>("");

  const openSupplier = (supplierId: string) => {
    setToggleSupplier(supplierId);
  };

  if (!suppliers) return null;

  return (
    <>
      {suppliers.map((supplier) => (
        <div key={supplier.id}>
          <button onClick={() => openSupplier(supplier.id)}>
            {supplier.name}
          </button>

          {toggleSupplier === supplier.id && (
            <OrdersList key={supplier.id} initialProducts={supplier.products} />
          )}
        </div>
      ))}
    </>
  );
};
