"use client";

import { SupplierWithProducts } from "@/types/types";
import React, { useState } from "react";
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

  const closeSupplier = () => {
    setToggleSupplier("");
  };
  if (!suppliers) return null;

  return (
    <>
      {suppliers.map((supplier) => (
        <div
          key={supplier.id}
          className={
            toggleSupplier === supplier.id
              ? "selected-supplier flex flex-col  gap-4"
              : " unselected-supplier flex flex-col  gap-4"
          }
        >
          <div className="flex justify-between gap-5">
            <button
              className={
                toggleSupplier === supplier.id
                  ? ""
                  : "opacity-50 p-4 w-full text-start hover:opacity-70"
              }
              onClick={() => openSupplier(supplier.id)}
            >
              {supplier.name}
            </button>
            {toggleSupplier === supplier.id && (
              <button
                onClick={() => closeSupplier()}
                className="border-full border-blue-100"
              >
                x
              </button>
            )}
          </div>

          {toggleSupplier === supplier.id && (
            <OrdersList key={supplier.id} initialProducts={supplier.products} />
          )}
        </div>
      ))}
    </>
  );
};
