import { useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChargeStatus } from "@/types/graphql";

export interface FiltersState {
  startDate: string;
  endDate: string;
  status: string;
  minAmount: string;
  maxAmount: string;
  search: string;
}

interface PaymentsFiltersProps {
  filters: FiltersState;
  onFilterChange: (filters: Partial<FiltersState>) => void;
}

export function PaymentsFilters({ filters, onFilterChange }: PaymentsFiltersProps) {
  const handleStatusChange = useCallback(
    (value: string) => {
      onFilterChange({ status: value === "ALL" ? "" : value });
    },
    [onFilterChange]
  );

  const hasActiveFilters =
    filters.startDate ||
    filters.endDate ||
    filters.status ||
    filters.minAmount ||
    filters.maxAmount ||
    filters.search;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      {/* Date range */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="filter-start-date" className="mb-1 block text-xs font-medium text-muted-foreground">
            Start date
          </label>
          <Input
            id="filter-start-date"
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="h-9"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="filter-end-date" className="mb-1 block text-xs font-medium text-muted-foreground">
            End date
          </label>
          <Input
            id="filter-end-date"
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
            className="h-9"
          />
        </div>
      </div>

      {/* Status */}
      <div className="w-full sm:w-44">
        <label htmlFor="filter-status" className="mb-1 block text-xs font-medium text-muted-foreground">
          Status
        </label>
        <Select value={filters.status || "ALL"} onValueChange={handleStatusChange}>
          <SelectTrigger id="filter-status" className="h-9">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {Object.values(ChargeStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount range */}
      <div className="flex gap-2">
        <div className="flex-1 sm:w-28">
          <label htmlFor="filter-min-amount" className="mb-1 block text-xs font-medium text-muted-foreground">
            Min amount
          </label>
          <Input
            id="filter-min-amount"
            type="number"
            placeholder="0"
            value={filters.minAmount}
            onChange={(e) => onFilterChange({ minAmount: e.target.value })}
            className="h-9"
          />
        </div>
        <div className="flex-1 sm:w-28">
          <label htmlFor="filter-max-amount" className="mb-1 block text-xs font-medium text-muted-foreground">
            Max amount
          </label>
          <Input
            id="filter-max-amount"
            type="number"
            placeholder="∞"
            value={filters.maxAmount}
            onChange={(e) => onFilterChange({ maxAmount: e.target.value })}
            className="h-9"
          />
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 sm:w-56">
        <label htmlFor="filter-search" className="mb-1 block text-xs font-medium text-muted-foreground">
          Search
        </label>
        <Input
          id="filter-search"
          type="text"
          placeholder="ID, description, reference..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="h-9"
        />
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          type="button"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          onClick={() =>
            onFilterChange({
              startDate: "",
              endDate: "",
              status: "",
              minAmount: "",
              maxAmount: "",
              search: "",
            })
          }
        >
          Clear all
        </button>
      )}
    </div>
  );
}
