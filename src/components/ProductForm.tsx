"use client";

import { createProduct } from "@/app/actions/createProduct";
import { productSchema } from "@/schemas/productSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import React, { useActionState } from "react";

// const initialState = {
//   success: false,
//   message: "",
// };

export const ProductForm = () => {
  const [state, action, isPending] = useActionState(createProduct, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: productSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onSubmit",
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      className="flex flex-col"
    >
      <h2>Add Product</h2>
      <section>
        <div>
          <input type="text" name="name" placeholder="Product Name" />
          {fields.name.errors && <p>{fields.name.errors}</p>}
        </div>
        <div>
          <input type="number" name="price" id="price" />
          {fields.price.errors && <p>{fields.price.errors}</p>}
        </div>
        <div>
          <input type="number" name="stock" id="stock" />
          {fields.stock.errors && <p>{fields.stock.errors}</p>}
        </div>
        <div>
          <input type="text" name="category" placeholder="Category" />
          {fields.category.errors && <p>{fields.category.errors}</p>}
        </div>
        <div>
          <textarea
            name="description"
            id="description"
            placeholder="Description"
          />
          {fields.description.errors && <p>{fields.description.errors}</p>}
        </div>
      </section>
      <section className="errors">
        {state?.status === "error" && <p>{state.error?.general?.[0]}</p>}
      </section>
      <input
        type="submit"
        disabled={isPending}
        value={isPending ? "..." : "Add Product"}
      />
    </form>
  );
};
