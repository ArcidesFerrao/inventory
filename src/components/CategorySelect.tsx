import { createNewSupplierCategory } from "@/app/actions/categories";
import React, { useState } from "react";
import { Modal } from "./Modal";
import { Category } from "@prisma/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function CategorySelect({
  categories,
  supplierId,
}: {
  categories: Category[];
  supplierId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
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
        <select name="categoryId" id="categoryId">
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
    </div>
  );
}
