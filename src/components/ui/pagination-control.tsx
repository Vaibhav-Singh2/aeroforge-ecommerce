import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  type: string;
  category?: string;
  sortOption?: string;
}

export function PaginationControl({
  currentPage,
  totalPages,
  type,
  category,
  sortOption,
}: PaginationControlProps) {
  // Server-compatible URL creation function
  const createPageUrl = (pageNumber: number) => {
    // Create search params object
    const params: Record<string, string> = {
      page: pageNumber.toString(),
    };

    // Add sort if it exists
    if (sortOption) {
      params.sort = sortOption;
    }

    return {
      pathname: `/category/${type}${category ? `/${category}` : ""}`,
      query: params,
    };
  };
  return (
    <div className="mt-12 flex justify-center">
      <div className="flex gap-1">
        <Link href={createPageUrl(currentPage > 1 ? currentPage - 1 : 1)}>
          <Button variant="outline" size="icon" disabled={currentPage <= 1}>
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
        </Link>
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNumber = i + 1;
          // Show limited pages with ellipsis for better UX
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <Link key={i} href={createPageUrl(pageNumber)}>
                <Button
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  className="cursor-pointer"
                >
                  {pageNumber}
                </Button>
              </Link>
            );
          }

          // Add ellipsis
          if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return (
              <span key={i} className="flex items-center px-2">
                ...
              </span>
            );
          }

          return null;
        })}{" "}
        <Link
          href={createPageUrl(
            currentPage < totalPages ? currentPage + 1 : totalPages,
          )}
        >
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
