import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChargesDateRangeKPI } from "@/types/graphql";

interface KPICardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
}

function KPICard({ title, value, description }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="mt-1">{description}</CardDescription>
        )}
      </CardContent>
    </Card>
  );
}

function KPICardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-1" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

interface KPICardsProps {
  data: ChargesDateRangeKPI | null | undefined;
  loading: boolean;
}

export function KPICards({ data, loading }: KPICardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data?.total) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No data available for the selected range
      </div>
    );
  }

  const { total, currency } = data;

  const successRate =
    total.succeededCount + total.failedCount > 0
      ? (
          (total.succeededCount /
            (total.succeededCount + total.failedCount)) *
          100
        ).toFixed(1)
      : "—";

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount == null) return "—";
    return `${(amount / 100).toLocaleString("en-US", { style: "currency", currency })}`;
  };

  const cards: KPICardProps[] = [
    {
      title: "Total Payments",
      value: total.succeededCount.toLocaleString(),
      description: formatCurrency(total.succeededAmount),
    },
    {
      title: "Total Volume",
      value: formatCurrency(total.succeededAmount),
      description: `${total.succeededCount} succeeded payments`,
    },
    {
      title: "Success Rate",
      value: successRate !== "—" ? `${successRate}%` : "—",
      description:
        successRate !== "—"
          ? `${total.failedCount.toLocaleString()} failed`
          : undefined,
    },
    {
      title: "Captured",
      value: total.capturedCount.toLocaleString(),
      description: formatCurrency(total.capturedAmount),
    },
    {
      title: "Refunded",
      value: total.refundedCount.toLocaleString(),
      description: formatCurrency(total.refundedAmount),
    },
    {
      title: "Failed",
      value: total.failedCount.toLocaleString(),
      description: formatCurrency(total.failedAmount),
    },
    {
      title: "Canceled",
      value: total.canceledCount.toLocaleString(),
      description: formatCurrency(total.canceledAmount),
    },
    {
      title: "Card-Present",
      value: total.cuSucceededCount.toLocaleString(),
      description: formatCurrency(total.cuSucceededAmount),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <KPICard key={card.title} {...card} />
      ))}
    </div>
  );
}
