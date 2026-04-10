import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChargesDateRangeKPIRow } from "@/types/graphql";
import { STATUS_COLORS } from "@/lib/constants";

interface StatusChartProps {
  data: ChargesDateRangeKPIRow[] | undefined;
  loading: boolean;
}

function StatusChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-72 w-full" />
      </CardContent>
    </Card>
  );
}

export function StatusChart({ data, loading }: StatusChartProps) {
  if (loading) {
    return <StatusChartSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            No data available for the selected range
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((row) => ({
    date: new Date(row.timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    succeeded: row.succeededAmount / 100,
    failed: row.failedAmount / 100,
    refunded: row.refundedAmount / 100,
    canceled: row.canceledAmount / 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              className="text-xs"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `€${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: number) => [`€${value.toLocaleString()}`, ""]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="succeeded"
              stackId="status"
              fill={STATUS_COLORS.SUCCEEDED}
              name="Succeeded"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="refunded"
              stackId="status"
              fill={STATUS_COLORS.REFUNDED}
              name="Refunded"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="canceled"
              stackId="status"
              fill={STATUS_COLORS.CANCELED}
              name="Canceled"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="failed"
              stackId="status"
              fill={STATUS_COLORS.FAILED}
              name="Failed"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
