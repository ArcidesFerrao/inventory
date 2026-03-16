"use client";

import { getServiceCategories } from "@/lib/actions/categories";
import {
  // getServiceStockItems,
  getServiceStockItemsWithUnit,
} from "@/lib/actions/items";
import {
  createItem,
  editItem,
  getStockItemsNames,
} from "@/lib/actions/product";
import { getUnits } from "@/lib/actions/units";
import { ServiceStockItem, StockItem, Unit } from "@/generated/prisma/client";
import { itemSchema } from "@/schemas/schema";
import { ItemWithUnit } from "@/types/types";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ProductsCategorySelect } from "./CategorySelect";
import { useTranslations } from "next-intl";

export const ItemForm = ({
  item,
  serviceId,
}: {
  item?: ItemWithUnit;
  serviceId: string;
}) => {
  const actionFn = item ? editItem : createItem;
  // console.log(actionFn);
  const [state, action, isPending] = useActionState(actionFn, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: itemSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onSubmit",
    defaultValue: item,
  });
  const router = useRouter();
  const t = useTranslations("Common");
  const nt = useTranslations("Notifications");

  const [type, setType] = useState(item ? item.type : "SERVICE");

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);

  const [recipeItems, setRecipeItems] = useState<
    (ServiceStockItem & {
      stockItem: StockItem & { unit: Unit | null };
      quantity: number;
      usageType: "UNIT" | "QUANTITY";
    })[]
  >([]);
  // const [recipeItems, setRecipeItems] = useState<
  //   (ServiceStockItem & { stockItem: StockItem; unitQty: number })[]
  // >([]);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [name, setName] = useState(item?.name || "");
  const [unitId, setUnitId] = useState(item?.Unit?.id);

  useEffect(() => {
    if (!name || name.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const results = await getStockItemsNames(name);
      setSuggestions(results);
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [name]);

  useEffect(() => {
    const fetchItems = async () => {
      const serviceStockItems = await getServiceStockItemsWithUnit(serviceId);

      setRecipeItems(
        serviceStockItems.map((p) => ({
          ...p,
          quantity: 0,
          usageType: "UNIT" as const,
        })),
      );
    };

    fetchItems();
  }, [serviceId]);

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(
        item ? `${nt("itemEditSuccess")}` : `${nt("itemCreateSuccess")}`,
      );
      router.push("/service/products");
    }
    if (state?.status === "error") {
      toast.error(item ? `${nt("itemEditFail")}` : `${nt("itemAddFail")}`);
    }

    const fetchCategories = async () => {
      setCategories(await getServiceCategories(serviceId));
    };

    const fetchUnits = async () => {
      setUnits(await getUnits());
    };

    fetchCategories();
    fetchUnits();
  }, [state, item, router, serviceId]);

  return (
    <form
      id={form.id}
      action={action}
      onSubmit={form.onSubmit}
      className="new-item-form flex flex-col gap-4 min-w-md"
    >
      <h2 className="font-extralight">
        {t("fillFormTo")} {item ? t("editThe") : t("createNew")} {t("item")}
      </h2>
      <section className="flex flex-col gap-4">
        <input
          type="hidden"
          name="serviceId"
          id="serviceId"
          value={serviceId}
        />
        {fields.serviceId.errors && (
          <p className="text-xs font-light">{fields.serviceId.errors}</p>
        )}
        {item && <input type="hidden" name="id" id="id" value={item.id} />}
        {fields.id.errors && (
          <p className="text-xs font-light">{fields.id.errors}</p>
        )}
        <div className="flex w-full flex-col gap-1 relative">
          <label htmlFor="name">{t("itemName")}</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder={t("itemName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {fields.name.errors && (
            <p className="text-xs font-light">{fields.name.errors}</p>
          )}
          {suggestions.length > 0 && (
            <ul className="absolute top-full suggestions-list w-full ">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setName(s);
                    setSuggestions([]);
                  }}
                  className="px-3 py-2 cursor-pointer"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="item-form-details flex gap-2 justify-between">
          <div className="flex flex-col gap-2">
            <label htmlFor="type">{t("type")}</label>
            <select
              name="type"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as "STOCK" | "SERVICE")}
              aria-readonly
            >
              <option value="" disabled>
                {t("selectType")}
              </option>
              <option value="STOCK">Stock</option>
              <option value="SERVICE">{t("service")}</option>
            </select>
            {fields.type.errors && (
              <p className="text-xs font-light">{fields.type.errors}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 w-1/3">
            {type === "SERVICE" ? (
              <div hidden className="flex flex-col gap-2">
                <label htmlFor="unitQty">{t("unitQuantity")}</label>
                <input
                  type="number"
                  name="unitQty"
                  id="quantity"
                  min={1}
                  defaultValue={1}
                  readOnly
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label htmlFor="unitQty">{t("unitQuantity")}</label>
                <input
                  type="number"
                  name="unitQty"
                  id="unitQty"
                  defaultValue={item?.unitQty ?? 1}
                />
              </div>
            )}
            {fields.unitQty.errors && (
              <p className="text-xs font-light">{fields.unitQty.errors}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-col">
              <label htmlFor="unit">{t("unit")}</label>
              <select
                name="unitId"
                id="unitId"
                // disabled
                value={
                  type === "SERVICE" ? "01KB8ABVGS65QBKBAN0D3YVCN4" : unitId
                }
                // defaultValue={
                //   type === "SERVICE" ? "01KB8ABVGS65QBKBAN0D3YVCN4" : ""
                // }
                onChange={(e) => setUnitId(e.target.value)}
              >
                <option value="" disabled>
                  {t("selectUnit")}
                </option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
              {fields.unitId.errors && (
                <p className="text-xs font-light">{fields.unitId.errors}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-between">
          <div hidden className="flex flex-col gap-1">
            <label htmlFor="stock">Stock</label>
            <input
              type="hidden"
              name="stock"
              id="stock"
              min={0}
              defaultValue={item?.stock || 0}
              readOnly={type === "SERVICE"}
            />
            {fields.stock.errors && (
              <p className="text-xs font-light">{fields.stock.errors}</p>
            )}
          </div>
          {type === "SERVICE" && (
            <div className="flex gap-4 text-sm item-category-form">
              <div className="flex flex-col gap-1">
                <label htmlFor="price">{t("price")}</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  defaultValue={item?.price || 0}
                />

                {fields.price.errors && (
                  <p className="text-xs font-light">{fields.price.errors}</p>
                )}
              </div>
              <ProductsCategorySelect
                categories={categories}
                serviceId={serviceId}
                categoryId={item?.categoryId}
                field={fields.categoryId}
                // state={state}
                // state={fields.categoryId.errors?.[0]}
              />
              {fields.categoryId.errors && (
                <p className="text-xs font-light">{fields.categoryId.errors}</p>
              )}
            </div>
          )}
        </div>
        {type !== "STOCK" && (
          <fieldset className="flex flex-col gap-4 p-4">
            <legend className="font-semibold">{t("catalogItems")}</legend>
            {recipeItems.map((stockItem, index) => {
              return (
                <div key={stockItem.id} className="flex justify-between">
                  <label
                    className="pl-2 py-1 font-light "
                    htmlFor={`CatalogItems[${index}].quantity`}
                  >
                    {stockItem.stockItem.name}
                  </label>

                  <div className="flex flex-col max-w-1/4 text-sm">
                    <input
                      type="number"
                      className=""
                      min={0}
                      name={`CatalogItems[${index}].quantity`}
                      value={stockItem.quantity}
                      onChange={(e) => {
                        const q = Number(e.target.value);
                        setRecipeItems((prev) =>
                          prev.map((ri) =>
                            ri.id === stockItem.id
                              ? {
                                  ...ri,
                                  quantity: q,
                                }
                              : ri,
                          ),
                        );
                      }}
                    />
                    <select
                      name={`CatalogItems[${index}].usageType`}
                      value={stockItem.usageType}
                      onChange={(e) => {
                        const type = e.target.value as "UNIT" | "QUANTITY";

                        setRecipeItems((prev) =>
                          prev.map((ri) =>
                            ri.id === stockItem.id
                              ? { ...ri, usageType: type }
                              : ri,
                          ),
                        );
                      }}
                    >
                      <option value="UNIT">Unit</option>
                      {stockItem.stockItem.unit?.name !== "unit" && (
                        <option value="QUANTITY">
                          {stockItem.stockItem.unit?.name}
                        </option>
                      )}
                    </select>
                  </div>
                  <>
                    <input
                      type="hidden"
                      name={`CatalogItems[${index}].serviceStockItemId`}
                      value={stockItem.id}
                    />
                    <input
                      type="hidden"
                      name={`CatalogItems[${index}].stockItemId`}
                      value={stockItem.stockItemId}
                    />
                  </>
                </div>
              );
            })}
          </fieldset>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="description">{t("description")}</label>

          <textarea
            name="description"
            id="description"
            placeholder={t("description")}
            defaultValue={item?.description || ""}
            className="min-w-80 min-h-40"
          />
          {fields.description.errors && (
            <p className="text-xs font-light">{fields.description.errors}</p>
          )}
        </div>
      </section>
      <section className="errors">
        {state?.status === "error" && (
          <p className="text-xs font-light">{state.error?.general?.[0]}</p>
        )}
      </section>

      <input
        type="submit"
        disabled={isPending}
        value={isPending ? "..." : item ? t("editItem") : t("addItem")}
        className="submit-button"
      />
    </form>
  );
};
