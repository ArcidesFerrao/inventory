"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface SearchInputProps {
  currentSearch: string;
}

export const SearchInput = ({ currentSearch }: SearchInputProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(currentSearch);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClear = () => {
    handleSearch("");
  };

  return (
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
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-100 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};
