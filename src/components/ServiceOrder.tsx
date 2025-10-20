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
              className={`flex items-center gap-1 ${
                toggleSupplier === supplier.id
                  ? ""
                  : "opacity-50 p-4 w-full text-start hover:opacity-70"
              }`}
              onClick={() => openSupplier(supplier.id)}
            >
              {supplier.name}
              <p className="text-sm font-light">- {supplier.description}</p>
            </button>
            {toggleSupplier !== supplier.id && (
              <p className=" text-nowrap text-sm opacity-50 font-light  flex items-center gap-1 pr-4 hover:opacity-70">
                {`${supplier.products.length} products`}
              </p>
            )}
            {toggleSupplier === supplier.id && (
              <button
                onClick={() => closeSupplier()}
                className="opacity-50 border-full border-blue-100 hover:opacity-75"
              >
                <span className="carbon--close-outline"></span>
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
