"use client";

import { ExpenseCategory } from "@/generated/prisma";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface ExpenseFiltersProps {
  currentSearch: string;
  currentCategory: string;
  currentPeriod: string;
  categories: ExpenseCategory[];
}

export const ExpenseFilters = ({
  currentSearch,
  currentCategory,
  currentPeriod,
  categories,
}: ExpenseFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateParams = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    updateParams("search", value);
  };

  const handleClear = () => {
    setSearchValue("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex w-full items-center gap-2">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name or ID..."
          className="w-full px-4 py-2 pr-10 rounded-lg  text-sm focus:outline-none focus:ring-2"
        />
        {searchValue && !isPending && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2  text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            x
          </button>
        )}
        {/* {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-100 border-t-transparent rounded-full"></div>
          </div>
        )} */}
      </div>
      <div className="flex gap-2">
        <div className="flex">
          <select
            value={currentCategory}
            onChange={(e) => updateParams("category", e.target.value)}
            name="category"
            id="category"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            title="Create new category"
            onClick={() => setIsModalOpen(true)}
          >
            +
          </button>
        </div>
        <select
          value={currentPeriod}
          onChange={(e) => updateParams("period", e.target.value)}
          name="period"
          id="period"
        >
          <option value="all">All Time</option>
          <option value="daily">last 24 hours</option>
          <option value="weekly">Last 7 days</option>
          <option value="monthly">Last 30 days</option>
        </select>
      </div>

      {isPending && (
        <div className="flex w-full justify-center items-center">
          <div className="animate-spin h-5 w-5 border-2 border-blue-100 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};
