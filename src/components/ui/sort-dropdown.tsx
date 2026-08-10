"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortDropdownProps = {
  currentSort: string;
  currentPage: number;
  type: string;
  category?: string;
};

export function SortDropdown({ currentSort, currentPage }: SortDropdownProps) {
  const router = useRouter();

  const handleSortChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sort", value);

    // Keep the current page if it exists
    if (currentPage > 1) {
      url.searchParams.set("page", currentPage.toString());
    } else {
      url.searchParams.delete("page");
    }

    router.push(url.pathname + url.search);
  };

  return (
    <Select defaultValue={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Featured</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  );
}
