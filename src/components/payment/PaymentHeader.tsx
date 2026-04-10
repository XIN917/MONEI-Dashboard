import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormattedCurrency, useFormattedDate } from "@/hooks";
import { STATUS_TAILWIND, DEFAULT_STATUS_TAILWIND } from "@/lib/constants";
import type { Charge } from "@/types/graphql";

interface PaymentHeaderProps {
  charge: Charge;
}

export function PaymentHeader({ charge }: PaymentHeaderProps) {
  const formattedAmount = useFormattedCurrency(charge.amount, charge.currency);
  const createdAt = useFormattedDate(charge.createdAt);

  const statusClass =
    STATUS_TAILWIND[charge.status] ?? DEFAULT_STATUS_TAILWIND;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold font-mono break-all">
            {charge.id}
          </h1>
          <Badge className={statusClass}>{charge.status}</Badge>
        </div>
        <p className="text-muted-foreground mt-1">{createdAt.absolute}</p>
      </div>
      <div className="text-3xl font-bold">{formattedAmount}</div>
    </div>
  );
}

export function PaymentHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-4 w-36 mt-2" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
