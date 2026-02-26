"use client";

import { SupplierWithItems } from "@/types/types";
import { useState } from "react";
import { OrdersList } from "./OrdersList";
import { useTranslations } from "next-intl";

export const ServiceOrder = ({
  serviceId,
  suppliers,
}: {
  serviceId: string;
  suppliers: SupplierWithItems[];
}) => {
  const t = useTranslations("Common");
  const [toggleSupplier, setToggleSupplier] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const openSupplier = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (supplier && supplier.StockItems.length > 0) {
      setToggleSupplier(supplierId);
    }
  };

  const closeSupplier = () => {
    setToggleSupplier("");
  };
  if (!suppliers) return null;

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="search-term flex items-center text-sm gap-2">
        <input
          type="text"
          placeholder={t("searchSuppliers")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="text-gray-500" onClick={() => setSearchTerm("")}>
            {t("clear")}
          </button>
        )}
      </div>

      {filteredSuppliers.map((supplier) => (
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
              {supplier.businessName}
              <p className="text-sm font-light">- {supplier.description}</p>
            </button>
            {toggleSupplier !== supplier.id && (
              <p className=" text-nowrap text-sm opacity-50 font-light  flex items-center gap-1 pr-4 hover:opacity-70">
                {`${supplier.StockItems.length} ${t("items")}`}{" "}
                <span className="carbon--chevron-right"></span>
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
            <OrdersList
              key={supplier.id}
              initialItems={supplier.StockItems}
              supplierId={supplier.id}
              serviceId={serviceId}
            />
          )}
        </div>
      ))}
    </>
  );
};
