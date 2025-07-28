"use client";

import { createProduct } from "@/app/actions/createProduct";
import { productSchema } from "@/schemas/productSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import React, { useActionState } from "react";

export const ProductForm = () => {
  const [state, action, isPending] = useActionState(createProduct, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: productSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onSubmit",
  });

  if (state?.status === "success") {
    redirect("/dashboard/products");
  }

  return (
    <form
      id={form.id}
      action={action}
      onSubmit={form.onSubmit}
      className="flex flex-col py-4 gap-2 "
    >
      <h2 className="text-center">Fill the form to create a new Product</h2>
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <input type="text" name="name" id="name" placeholder="Product Name" />
          {fields.name.errors && (
            <p className="text-xs font-light">{fields.name.errors}</p>
          )}
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="price">Price</label>
            <input type="number" name="price" id="price" />

            {fields.price.errors && (
              <p className="text-xs font-light">{fields.price.errors}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="stock">Stock</label>
            <input type="number" name="stock" id="stock" />
            {fields.stock.errors && (
              <p className="text-xs font-light">{fields.stock.errors}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col  gap-1">
          <input
            type="text"
            name="category"
            id="category"
            placeholder="Category"
          />
          {fields.category.errors && (
            <p className="text-xs font-light">{fields.category.errors}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <textarea
            name="description"
            id="description"
            placeholder="Description"
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
        value={isPending ? "..." : "Add Product"}
        className="submit-button"
      />
    </form>
  );
};
