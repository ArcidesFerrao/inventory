"use client";

import { getCategories } from "@/app/actions/categories";
import { createProduct } from "@/app/actions/product";
import { editProduct } from "@/app/actions/product";
import { productSchema } from "@/schemas/productSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string | null;
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

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(
        product
          ? "Product edited successfully!"
          : "Product created successfully!"
      );
      redirect("/service/products");
    }

    const fetchCategories = async () => {
      setCategories(await getCategories());
    };

    fetchCategories();
  }, [state, product]);

  return (
    <form
      id={form.id}
      action={action}
      onSubmit={form.onSubmit}
      className="flex flex-col py-4 gap-2 "
    >
      <h2 className="text-center">
        Fill the form to {product ? "edit the" : "create a new"} Product
      </h2>
      <section className="flex flex-col gap-4">
        {product && (
          <input type="hidden" name="id" id="id" value={product.id} />
        )}
        <div className="flex flex-col gap-1">
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
        <div className="flex gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              defaultValue={product?.price}
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
              defaultValue={product?.stock}
            />
            {fields.stock.errors && (
              <p className="text-xs font-light">{fields.stock.errors}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 w-1/2">
            <label htmlFor="categoryId">Category</label>
            <select name="categoryId" id="categoryId">
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {fields.category.errors && (
              <p className="text-xs font-light">{fields.category.errors}</p>
            )}
          </div>
          <div className="flex flex-col w-1/2 gap-1">
            <label htmlFor="unit">Unit</label>
            <select name="unit" id="unit">
              <option value="" disabled>
                Select a unit
              </option>
              <option value="kg">Kg</option>
              <option value="liters">Liters</option>
            </select>

            {fields.category.errors && (
              <p className="text-xs font-light">{fields.category.errors}</p>
            )}
          </div>
        </div>
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
