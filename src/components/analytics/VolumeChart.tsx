import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChargesDateRangeKPIRow } from "@/types/graphql";

interface VolumeChartProps {
  data: ChargesDateRangeKPIRow[] | undefined;
  loading: boolean;
}

function VolumeChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-72 w-full" />
      </CardContent>
    </Card>
  );
}

export function VolumeChart({ data, loading }: VolumeChartProps) {
  if (loading) {
    return <VolumeChartSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Volume Over Time</CardTitle>
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
    timestamp: row.timestamp,
    date: format(new Date(row.timestamp * 1000), "MMM d"),
    succeededAmount: row.succeededAmount / 100,
    succeededCount: row.succeededCount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Volume Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
              formatter={(value: number) => [
                `€${value.toLocaleString()}`,
                "Volume",
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="succeededAmount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
