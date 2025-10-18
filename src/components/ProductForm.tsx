"use client";

import { getCategories } from "@/app/actions/categories";
import {
  createProduct,
  createSupplierProduct,
  editSupplierProduct,
  getProducts,
} from "@/app/actions/product";
import { editProduct } from "@/app/actions/product";
import { getUnits } from "@/app/actions/units";
import { productSchema, supplierProductSchema } from "@/schemas/productSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { $Enums, Product, SupplierProduct } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

type SupplierProductWithUnit = SupplierProduct & {
  Unit: {
    name: string;
    id: string;
    description: string | null;
  } | null;
  type: "SUPPLY" | "STOCK" | "SERVICE";
  quantity: number;
};

type ProductWithUnit = Product & {
  Unit: {
    name: string;
    id: string;
    description: string | null;
  } | null;
  Category: {
    name: string;
    id: string;
    type: $Enums.CategoryType;
  } | null;
};

export const ProductForm = ({
  product,
  serviceId,
}: {
  product?: ProductWithUnit;
  serviceId: string;
}) => {
  const actionFn = product ? editProduct : createProduct;
  // console.log(actionFn);
  const [state, action, isPending] = useActionState(actionFn, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: productSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onSubmit",
    defaultValue: product,
  });
  const router = useRouter();
  const [type, setType] = useState(product ? product.type : "STOCK");
  const [category, setCategory] = useState("Lanche");

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);

  const [recipeItems, setRecipeItems] = useState<
    { productId: string; name: string; unitQty: number }[]
  >([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts(serviceId);

      setRecipeItems(
        products.map((p) => ({
          productId: p.id,
          name: p.name,
          unitQty: 0,
        }))
      );
    };

    fetchProducts();
  }, [serviceId]);

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(
        product
          ? "Product edited successfully!"
          : "Product created successfully!"
      );
      router.push("/service/products");
    }
    if (state?.status === "error") {
      toast.error(
        product ? "Failed to edit Product" : "Failed to add Product!"
      );
    }

    const fetchCategories = async () => {
      setCategories(await getCategories());
    };
    const fetchUnits = async () => {
      setUnits(await getUnits());
    };

    fetchCategories();
    fetchUnits();
  }, [state, product, router]);

  return (
    <form
      id={form.id}
      action={action}
      onSubmit={form.onSubmit}
      className="flex flex-col gap-4 min-w-md"
    >
      <h2 className="font-extralight">
        Fill the form to {product ? "edit the" : "create a new"} Product
      </h2>
      <section className="flex flex-col gap-4">
        <input
          type="hidden"
          name="serviceId"
          id="serviceId"
          value={serviceId}
        />
        {product && (
          <input type="hidden" name="id" id="id" value={product.id} />
        )}
        <div className="flex w-full flex-col gap-1">
          <label htmlFor="name">Product Name</label>

          <input
            type="text"
            name="name"
            id="name"
            placeholder="Product Name"
            defaultValue={product?.name}
          />
          {fields.name.errors && (
            <p className="text-xs font-light">{fields.name.errors}</p>
          )}
        </div>
        <div className="flex gap-2 justify-between">
          <div className="flex flex-col gap-2">
            <label htmlFor="type">Type</label>
            <select
              name="type"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as "STOCK" | "SERVICE")}
            >
              <option value="" disabled>
                Select a type
              </option>
              <option value="STOCK">Stock</option>
              <option value="SERVICE">Menu</option>
            </select>
            {fields.type.errors && (
              <p className="text-xs font-light">{fields.type.errors}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 w-1/3">
            {type === "SERVICE" ? (
              <div hidden className="flex flex-col gap-2">
                <label htmlFor="unitQty">Unit Quantity</label>
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
                <label htmlFor="unitQty">Unit Quantity</label>
                <input
                  type="number"
                  name="unitQty"
                  id="unitQty"
                  defaultValue={product?.unitQty ?? 1}
                />
              </div>
            )}
            {fields.unitQty.errors && (
              <p className="text-xs font-light">{fields.unitQty.errors}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {type === "SERVICE" ? (
              <div hidden className="flex flex-col">
                <label htmlFor="unit">Unit</label>
                <select
                  name="unitId"
                  id="unitId"
                  value={units.find((u) => u.name === "pcs")?.id}
                >
                  <option value="" disabled>
                    Select a unit
                  </option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label htmlFor="unit">Unit</label>
                <select name="unitId" id="unitId">
                  <option value="" disabled>
                    Select a unit
                  </option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {fields.Unit.errors && (
              <p className="text-xs font-light">{fields.Unit.errors}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2 justify-between">
          <div hidden className="flex flex-col gap-1">
            <label htmlFor="stock">Stock Quantity</label>
            <input
              type="hidden"
              name="stock"
              id="stock"
              min={0}
              defaultValue={product?.stock || 0}
              readOnly={type === "SERVICE"}
            />
            {fields.stock.errors && (
              <p className="text-xs font-light">{fields.stock.errors}</p>
            )}
          </div>
          {type === "SERVICE" && (
            <div className="flex flex-col gap-1">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                name="price"
                id="price"
                defaultValue={product?.price || 0}
              />

              {fields.price.errors && (
                <p className="text-xs font-light">{fields.price.errors}</p>
              )}
            </div>
          )}
        </div>
        {type === "SERVICE" && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="categoryId">Category</label>
              <select
                name="categoryId"
                id="categoryId"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {fields.categoryId.errors && (
                <p className="text-xs font-light">{fields.categoryId.errors}</p>
              )}
            </div>
            <fieldset className="flex flex-col gap-4">
              <legend>Recipe</legend>
              <div className="flex flex-col gap-2">
                {recipeItems.map((item, index) => (
                  <div key={item.productId} className="flex justify-between">
                    <label htmlFor={`recipe[${index}].quantity`}>
                      {item.name}
                    </label>
                    <input
                      type="number"
                      className="max-w-1/3"
                      min={0}
                      name={`recipe[${index}].quantity`}
                      value={item.unitQty}
                      onChange={(e) => {
                        const newQuantity = Number(e.target.value);
                        setRecipeItems((prev) =>
                          prev.map((ri) =>
                            ri.productId === item.productId
                              ? {
                                  ...ri,
                                  unitQty: newQuantity,
                                }
                              : ri
                          )
                        );
                      }}
                    />
                    <input
                      type="hidden"
                      name={`recipe[${index}].stockId`}
                      value={item.productId}
                    />
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            defaultValue={product?.description || ""}
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
        value={isPending ? "..." : product ? "Edit Product" : "Add Product"}
        className="submit-button"
      />
    </form>
  );
};

export const SupplierProductForm = ({
  supplierProduct,
  supplierId,
}: {
  supplierProduct?: SupplierProductWithUnit | null;
  supplierId: string;
}) => {
  const actionFn = supplierProduct
    ? editSupplierProduct
    : createSupplierProduct;
  const [state, action, isPending] = useActionState(actionFn, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: supplierProductSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onSubmit",
    defaultValue: supplierProduct,
  });
  const router = useRouter();

  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);
  const [unitId, setUnitId] = useState(supplierProduct?.unitId || "");

  useEffect(() => {
    if (supplierProduct?.unitId) {
      setUnitId(supplierProduct.unitId);
    }
  }, [supplierProduct]);

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(
        supplierProduct
          ? "Product edited successfully!"
          : "Product created successfully!"
      );
      router.push("/supply/products");
    }

    const fetchUnits = async () => {
      setUnits(await getUnits());
    };

    fetchUnits();
  }, [state, supplierProduct, router]);

  return (
    <form
      id={form.id}
      action={action}
      onSubmit={form.onSubmit}
      className="flex flex-col gap-4 min-w-md"
    >
      <h2 className="font-extralight">
        Fill the form to {supplierProduct ? "edit the" : "create a new"}{" "}
        Supplier Product
      </h2>
      <section className="flex flex-col gap-4">
        {supplierProduct && (
          <input type="hidden" name="id" id="id" value={supplierProduct.id} />
        )}
        <input
          type="hidden"
          name="supplierId"
          id="supplierId"
          value={supplierId}
        />
        <div className="flex gap-2 items-end">
          <div className="flex w-full flex-col gap-1">
            <label htmlFor="name">Product Name</label>

            <input
              type="text"
              name="name"
              id="name"
              placeholder="Product Name"
              defaultValue={supplierProduct?.name}
            />
            {fields.name.errors && (
              <p className="text-xs font-light">{fields.name.errors}</p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="unitQty">Unit Qty.</label>
              <input
                type="number"
                name="unitQty"
                id="unitQty"
                className="max-w-32"
                defaultValue={supplierProduct?.unitQty ?? 1}
              />
              {fields.unitQty.errors && (
                <p className="text-xs font-light">{fields.unitQty.errors}</p>
              )}
            </div>
            <div className="flex flex-col w-1/2 gap-1">
              <label htmlFor="unit">Unit</label>
              <select
                name="unitId"
                id="unitId"
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
              >
                <option value="" disabled>
                  Select a unit
                </option>
                {units.map((unit) => (
                  <option
                    key={unit.id}
                    value={unit.id}
                    // defaultChecked={unit.id === supplierProduct?.unitId}
                  >
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
        <div className="flex gap-2 w-full justify-between">
          <div className="flex flex-col gap-1">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              defaultValue={supplierProduct?.price || 0}
              required
            />

            {fields.price.errors && (
              <p className="text-xs font-light">{fields.price.errors}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              name="stock"
              id="stock"
              min={0}
              defaultValue={supplierProduct?.stock || 0}
            />
            {fields.stock.errors && (
              <p className="text-xs font-light">{fields.stock.errors}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="cost">Cost</label>
            <input
              type="number"
              name="cost"
              id="cost"
              defaultValue={supplierProduct?.cost || 0}
            />

            {fields.cost.errors && (
              <p className="text-xs font-light">{fields.cost.errors}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            defaultValue={supplierProduct?.description || ""}
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
        value={
          isPending ? "..." : supplierProduct ? "Edit Product" : "Add Product"
        }
        className="submit-button"
      />
    </form>
  );
};
