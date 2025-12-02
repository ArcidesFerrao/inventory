import React, { useState } from "react";

type ExpenseFormData = {
  amount: number;
  description: string;
  categoryId: string;
  paymentMethod: string;
};

export default function ExpenseForm() {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    description: "",
    categoryId: "",
    paymentMethod: "CASH",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };
  return (
    <form>
      <div className="">
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
      <div>
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
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Expense"}
      </button>
    </form>
  );
}
