"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
};

type CategoryMobileSelectProps = {
  type: string;
  category?: string;
  categoryList: Category[];
  totalItems: number;
};

export function CategoryMobileSelect({
  type,
  category,
  categoryList,
  totalItems,
}: CategoryMobileSelectProps) {
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      router.push(`/category/${type}`);
    } else {
      router.push(`/category/${type}/${value}`);
    }
  };

  return (
    <div className="lg:hidden">
      <h3 className="mb-3 font-medium">Categories</h3>
      <Select
        defaultValue={category || "all"}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All ({totalItems})</SelectItem>
          {categoryList.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {cat.name} ({cat._count.products})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
