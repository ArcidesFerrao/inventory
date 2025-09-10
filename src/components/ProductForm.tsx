"use client";

import { getCategories } from "@/app/actions/categories";
import { createProduct, getProducts } from "@/app/actions/product";
import { editProduct } from "@/app/actions/product";
import { getUnits } from "@/app/actions/units";
import { productSchema } from "@/schemas/productSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  price: number | null;
  stock?: number | null;
  quantity: number;
  type: "STOCK" | "SERVICE";
  description: string | null;
  Unit?: {
    id: string;
    name: string;
  };
  Category?: {
    id: string;
    name: string;
  };
};

export const ProductForm = ({ product }: { product?: Product }) => {
  const actionFn = product ? editProduct : createProduct;
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
    { productId: string; name: string; quantity: number }[]
  >([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();

      setRecipeItems(
        products.map((p) => ({
          productId: p.id,
          name: p.name,
          quantity: 0,
        }))
      );
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(
        product
          ? "Product edited successfully!"
          : "Product created successfully!"
      );
      router.push("/service/products");
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
      className="flex flex-col py-4 gap-2 min-w-md"
    >
      <h2 className="text-center">
        Fill the form to {product ? "edit the" : "create a new"} Product
      </h2>
      <section className="flex flex-col gap-4">
        {product && (
          <input type="hidden" name="id" id="id" value={product.id} />
        )}
        <div className="flex gap-2 items-end">
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
          <div className="flex flex-col gap-1">
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
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="quantity">Quantidade Unit.</label>
            {type === "SERVICE" ? (
              <input
                type="number"
                name="quantity"
                id="quantity"
                min={1}
                defaultValue={1}
                readOnly
              />
            ) : (
              <input
                type="number"
                name="quantity"
                id="quantity"
                defaultValue={product?.quantity ?? 1}
              />
            )}
            {fields.quantity.errors && (
              <p className="text-xs font-light">{fields.quantity.errors}</p>
            )}
          </div>
          <div className="flex flex-col w-1/2 gap-1">
            <label htmlFor="unit">Unit</label>
            {type === "SERVICE" ? (
              <select
                name="unitId"
                id="unitId"
                value={units.find((u) => u.name === "pcs")?.id}
                disabled
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
            ) : (
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
            )}

            {fields.Unit.errors && (
              <p className="text-xs font-light">{fields.Unit.errors}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
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

          <div className="flex flex-col gap-1">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              name="stock"
              id="stock"
              min={1}
              defaultValue={product?.stock || 1}
              readOnly={type === "SERVICE"}
            />
            {fields.stock.errors && (
              <p className="text-xs font-light">{fields.stock.errors}</p>
            )}
          </div>
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

              {fields.Category.errors && (
                <p className="text-xs font-light">{fields.Category.errors}</p>
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
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = Number(e.target.value);
                        setRecipeItems((prev) =>
                          prev.map((ri) =>
                            ri.productId === item.productId
                              ? {
                                  ...ri,
                                  quantity: newQuantity,
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
