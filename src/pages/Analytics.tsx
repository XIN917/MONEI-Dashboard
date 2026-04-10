import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react/hooks/useQuery";
import type { DateRange } from "react-day-picker";
import { subDays } from "date-fns";

import { CHARGES_DATE_RANGE_KPI } from "@/graphql/queries/chargesDateRangeKPI";
import type { ChargesDateRangeKPI as KPIType } from "@/types/graphql";
import { KPICards } from "@/components/analytics/KPICards";
import { VolumeChart } from "@/components/analytics/VolumeChart";
import { StatusChart } from "@/components/analytics/StatusChart";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";

// Extend Apollo's response type to include the top-level KPI field
interface QueryResult {
  chargesDateRangeKPI: KPIType | null;
}

export default function Analytics() {
  // Default to last 30 days
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  // Convert DateRange to Unix timestamps for the GraphQL query
  const { startDate, endDate } = useMemo(() => {
    if (!dateRange?.from) return { startDate: undefined, endDate: undefined };

    const start = Math.floor(dateRange.from.getTime() / 1000);
    const end = dateRange.to
      ? Math.floor(
          new Date(
            dateRange.to.getFullYear(),
            dateRange.to.getMonth(),
            dateRange.to.getDate(),
            23,
            59,
            59
          ).getTime() / 1000
        )
      : start;

    return { startDate: start, endDate: end };
  }, [dateRange]);

  const { loading, error, data, refetch } = useQuery<QueryResult>(
    CHARGES_DATE_RANGE_KPI,
    {
      variables: { startDate, endDate },
      fetchPolicy: "cache-and-network",
    }
  );

  const kpiData = data?.chargesDateRangeKPI ?? null;

  return (
    <div className="space-y-6">
      {/* Header with date range picker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="w-full sm:w-72">
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load analytics data. Please check your connection and try
            again.
          </p>
          <button
            className="mt-2 text-sm font-medium text-destructive underline underline-offset-4"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <KPICards data={kpiData} loading={loading} />

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <VolumeChart data={kpiData?.data} loading={loading} />
        <StatusChart data={kpiData?.data} loading={loading} />
      </div>
    </div>
  );
}
