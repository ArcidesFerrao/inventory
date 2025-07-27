import React, { useActionState } from "react";

const initialState = {
  success: false,
  message: "",
};

export const ProductForm = () => {
  const [state, action, isPending] = useActionState();

  return (
    <form className="flex flex-col">
      <h2>Add Product</h2>
      <section>
        <input type="text" name="name" placeholder="Product Name" />
        <input type="number" name="price" id="price" />
        <input type="number" name="stock" id="stock" />
        <input type="text" name="category" placeholder="Category" />
        <textarea
          name="description"
          id="description"
          placeholder="Description"
        />
      </section>
      <input type="submit" value="Add Product" />
    </form>
  );
};
