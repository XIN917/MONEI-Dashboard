import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react/hooks/useQuery";
import { useSearchParams, useNavigate } from "react-router-dom";

import { CHARGES } from "@/graphql/queries/charges";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { PaymentsFilters, type FiltersState } from "@/components/payments/PaymentsFilters";
import { Pagination } from "@/components/payments/Pagination";

interface CursorHistory {
  cursors: (string | null)[];
  currentIndex: number;
}

export default function Payments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read initial filters from URL
  const initialFilters: FiltersState = {
    startDate: searchParams.get("startDate") ?? "",
    endDate: searchParams.get("endDate") ?? "",
    status: searchParams.get("status") ?? "",
    minAmount: searchParams.get("minAmount") ?? "",
    maxAmount: searchParams.get("maxAmount") ?? "",
    search: searchParams.get("search") ?? "",
  };

  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const debouncedFilters = useDebounce(filters, 300);

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [cursorHistory, setCursorHistory] = useState<CursorHistory>({
    cursors: [null],
    currentIndex: 0,
  });

  // Sync URL params with filter state
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.status) params.set("status", filters.status);
    if (filters.minAmount) params.set("minAmount", filters.minAmount);
    if (filters.maxAmount) params.set("maxAmount", filters.maxAmount);
    if (filters.search) params.set("search", filters.search);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Build GraphQL filter object
  const gqlFilter = useMemo(() => {
    const filter: Record<string, unknown> = {};
    if (debouncedFilters.startDate) {
      filter.startDate = Math.floor(new Date(debouncedFilters.startDate).getTime() / 1000);
    }
    if (debouncedFilters.endDate) {
      filter.endDate = Math.floor(
        new Date(new Date(debouncedFilters.endDate).setHours(23, 59, 59, 999)).getTime() / 1000
      );
    }
    if (debouncedFilters.status) {
      filter.status = [debouncedFilters.status];
    }
    if (debouncedFilters.minAmount) {
      filter.minAmount = Math.round(parseFloat(debouncedFilters.minAmount) * 100);
    }
    if (debouncedFilters.maxAmount) {
      filter.maxAmount = Math.round(parseFloat(debouncedFilters.maxAmount) * 100);
    }
    if (debouncedFilters.search) {
      filter.search = debouncedFilters.search.trim();
    }
    return Object.keys(filter).length > 0 ? filter : undefined;
  }, [debouncedFilters]);

  const { after } = useMemo(() => {
    const cursors = cursorHistory.cursors;
    const idx = cursorHistory.currentIndex;
    return { after: idx < cursors.length ? cursors[idx] : null };
  }, [cursorHistory]);

  const { loading, error, data, refetch } = useQuery(CHARGES, {
    variables: {
      first: pageSize,
      after: after,
      filter: gqlFilter,
    },
    fetchPolicy: "cache-and-network",
  });

  const charges = data?.charges?.edges?.map((e: { node: unknown }) => e.node) ?? [];
  const pageInfo = data?.charges?.pageInfo ?? { hasNextPage: false, endCursor: null };

  // Handle filter change
  const handleFilterChange = useCallback((partial: Partial<FiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    // Reset pagination to first page when filters change
    setCursorHistory({ cursors: [null], currentIndex: 0 });
  }, []);

  // Handle row click -> navigate to payment detail
  const handleRowClick = useCallback(
    (id: string) => {
      navigate(`/payment/${id}`);
    },
    [navigate]
  );

  // Next page
  const handleNextPage = useCallback(() => {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor) return;
    setCursorHistory((prev) => ({
      cursors: [...prev.cursors.slice(0, prev.currentIndex + 1), pageInfo.endCursor],
      currentIndex: prev.currentIndex + 1,
    }));
  }, [pageInfo]);

  // Previous page
  const handlePreviousPage = useCallback(() => {
    setCursorHistory((prev) => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  }, []);

  // Page size change
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCursorHistory({ cursors: [null], currentIndex: 0 });
  }, []);

  const hasPreviousPage = cursorHistory.currentIndex > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Browse and filter all payment transactions
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-card p-4">
        <PaymentsFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load payments. Please check your connection and try again.
          </p>
          <button
            className="mt-2 text-sm font-medium text-destructive underline underline-offset-4"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <PaymentsTable
            charges={charges}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </div>

        {/* Empty state */}
        {!loading && (!charges || charges.length === 0) && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              No payments found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {Object.values(debouncedFilters).some(Boolean)
                ? "No payments match your filters."
                : "There are no payments to display."}
              {Object.values(debouncedFilters).some(Boolean) && (
                <button
                  className="ml-1 text-primary underline underline-offset-4"
                  onClick={() =>
                    handleFilterChange({
                      startDate: "",
                      endDate: "",
                      status: "",
                      minAmount: "",
                      maxAmount: "",
                      search: "",
                    })
                  }
                >
                  Clear all filters
                </button>
              )}
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          hasNextPage={pageInfo.hasNextPage}
          hasPreviousPage={hasPreviousPage}
          pageSize={pageSize}
          itemCount={charges.length}
          currentPage={cursorHistory.currentIndex + 1}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
