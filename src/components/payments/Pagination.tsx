import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  itemCount: number;
  currentPage: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageSizeChange: (size: number) => void;
}

export function Pagination({
  hasNextPage,
  hasPreviousPage,
  pageSize,
  itemCount,
  currentPage,
  onNextPage,
  onPreviousPage,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = hasPreviousPage ? (currentPage - 1) * pageSize + 1 : 1;
  const endItem = startItem + itemCount - 1;

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t px-2 py-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing {itemCount > 0 ? `${startItem}–${endItem}` : "0"} of {currentPage === 1 ? `${itemCount}` : `page ${currentPage}`}
        {hasNextPage && " (more available)"}
      </p>

      <div className="flex items-center gap-2">
        {/* Page size selector */}
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          aria-label="Items per page"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>

        {/* Previous */}
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage}
          onClick={onPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          onClick={onNextPage}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
