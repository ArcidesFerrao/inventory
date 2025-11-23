import {
  createNewCategory,
  createNewSupplierCategory,
} from "@/app/actions/categories";
import React, { useState } from "react";
import { Modal } from "./Modal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Category } from "@/generated/prisma/client";

export function CategorySelect({
  categoryId,
  categories,
  supplierId,
  state,
}: {
  categoryId?: string;
  categories: Category[];
  supplierId: string;
  state: string[] | undefined;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [cId, setCId] = useState(categoryId || "");
  const router = useRouter();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    const createdCategory = await createNewSupplierCategory({
      newCategoryName,
      supplierId,
    });

    if (createdCategory?.success) {
      toast.success("Category created successfully");
      router.refresh();
    } else {
      toast.error("Failed to create new Category");
    }

    setNewCategoryName("");
    setIsModalOpen(false);
  };
  return (
    <div className="self-start flex flex-col gap-1">
      <label htmlFor="categoryId">Category</label>
      <div className="flex gap-2">
        <select
          name="categoryId"
          id="categoryId"
          value={cId}
          onChange={(e) => setCId(e.target.value)}
        >
          <option value="">Select or create category</option>
          {categories?.map((c: { id: string; name: string }) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          className="add-category-btn px-2 hover:bg-green-700"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create new Category"
        >
          <input
            className="w-full"
            type="text"
            name="categoryName"
            id="categoryName"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <button
            type="submit"
            onClick={handleAddCategory}
            className="p-2 hover:bg-blue-700"
          >
            Save
          </button>
        </Modal>
      </div>
      {state && <p className="text-xs font-light">{state}</p>}
    </div>
  );
}
export function ProductsCategorySelect({
  categoryId,
  categories,
  serviceId,
  state,
  field,
}: // onChange,
{
  categoryId?: string | null;
  categories: { id: string; name: string }[];
  serviceId: string;
  state: string;
  field: {
    name: string;
    value?: string;
    errors?: string[];
  };
  // onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [cId, setCId] = useState(categoryId || "");
  const router = useRouter();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    const createdCategory = await createNewCategory({
      newCategoryName,
      serviceId,
    });

    if (createdCategory?.success) {
      toast.success("Category created successfully");
      router.refresh();
    } else {
      toast.error("Failed to create new Category");
    }

    setNewCategoryName("");
    setIsModalOpen(false);
  };

  return (
    <div className="self-start flex flex-col gap-1">
      <label htmlFor="categoryId">Category</label>
      <div className="flex gap-2">
        <select
          {...field}
          value={field.value || cId || ""}
          onChange={(e) => setCId(e.target.value)}
          id="categoryId"
          // onChange={field.onChange}
          // id={field.name}
          // name="categoryId"
          // value={cId}
        >
          <option value="">Select or create category</option>
          {categories?.map((c: { id: string; name: string }) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          className="add-category-btn px-2 hover:bg-green-700"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create new Category"
        >
          <input
            className="w-full"
            type="text"
            name="categoryName"
            id="categoryName"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <button
            type="submit"
            onClick={handleAddCategory}
            className="p-2 hover:bg-blue-700"
          >
            Save
          </button>
        </Modal>
      </div>
      {state && <p className="text-xs font-light">{state}</p>}
    </div>
  );
}
