"use client";

import { createExpense } from "@/app/actions/expenses";
import { expenseSchema } from "@/schemas/schema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

type ExpenseFormData = {
  amount: number;
  description: string;
  categoryId: string;
  paymentMethod: string;
  serviceId: string;
  userId: string;
};

export default function ExpenseForm({
  serviceId,
  userId,
}: {
  serviceId: string;
  userId: string;
}) {
  const [state, action, isPending] = useActionState(createExpense, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: expenseSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onSubmit",
  });
  const router = useRouter();

  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    description: "",
    categoryId: "",
    paymentMethod: "CASH",
    serviceId: serviceId,
    userId: userId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  useEffect(() => {
    if (state?.status === "success") {
      toast.success("Item created successfully!");
      router.push("/service/expenses");
    }
    if (state?.status === "error") {
      toast.error("Failed to add Item!");
    }
  }, [state, router, serviceId]);
  return (
    <form
      id={form.id}
      action={action}
      onSubmit={form.onSubmit}
      className="expense-form flex flex-col gap-4 min-w-md"
    >
      <input
        type="hidden"
        name="serviceId"
        id="serviceId"
        value={formData.serviceId}
        onChange={handleChange}
        required
        min={0}
      />
      <input
        type="hidden"
        name="userId"
        id="userId"
        value={formData.userId}
        onChange={handleChange}
        required
        min={0}
      />
      <div className=" flex gap-4 justify-between">
        <label htmlFor="amount">Amount (MZN)</label>
        <input
          type="number"
          name="amount"
          id="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min={0}
        />
      </div>
      {fields.amount.allErrors && <p>{fields.amount.errors}</p>}
      <div className="flex gap-4 justify-between">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </div>
      {fields.description.allErrors && <p>{fields.description.errors}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Expense"}
      </button>
    </form>
  );
}
