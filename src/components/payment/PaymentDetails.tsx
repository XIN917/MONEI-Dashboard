import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormattedDate } from "@/hooks";
import type { Charge } from "@/types/graphql";

interface FieldRowProps {
  label: string;
  value: string | React.ReactNode;
}

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b last:border-b-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium mt-1 sm:mt-0">{value}</dd>
    </div>
  );
}

interface PaymentDetailsProps {
  charge: Charge;
}

export function PaymentDetails({ charge }: PaymentDetailsProps) {
  const createdAt = useFormattedDate(charge.createdAt);
  const updatedAt = useFormattedDate(charge.updatedAt);
  const pageOpenedAt = useFormattedDate(charge.pageOpenedAt);

  const formatAmount = (amount: number | null | undefined, currency: string) => {
    if (amount == null) return "—";
    return `${(amount / 100).toLocaleString("en-US", { style: "currency", currency })}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl>
          <FieldRow label="Account ID" value={charge.accountId || "—"} />
          <FieldRow label="Checkout ID" value={charge.checkoutId || "—"} />
          <FieldRow label="Provider ID" value={charge.providerId || "—"} />
          <FieldRow
            label="Provider Reference"
            value={charge.providerReferenceId || "—"}
          />
          <FieldRow label="Currency" value={charge.currency} />
          <FieldRow
            label="Amount (EUR equiv.)"
            value={formatAmount(charge.amountEUR, "EUR")}
          />
          <FieldRow label="Status Code" value={charge.statusCode || "—"} />
          <FieldRow
            label="Status Message"
            value={charge.statusMessage || "—"}
          />
          <FieldRow label="Description" value={charge.description || "—"} />
          <FieldRow
            label="Statement Descriptor"
            value={charge.descriptor || "—"}
          />
          <FieldRow
            label="Authorization Code"
            value={charge.authorizationCode || "—"}
          />
          <FieldRow
            label="Refunded Amount"
            value={formatAmount(charge.refundedAmount, charge.currency)}
          />
          <FieldRow
            label="Last Refund Amount"
            value={formatAmount(charge.lastRefundAmount, charge.currency)}
          />
          <FieldRow
            label="Fraud Detector Score"
            value={
              charge.fraudDetectorScore != null
                ? `${charge.fraudDetectorScore} / 1000`
                : "—"
            }
          />
          <FieldRow
            label="Live Mode"
            value={
              charge.livemode ? (
                <span className="text-green-600 font-medium">Yes</span>
              ) : (
                <span className="text-muted-foreground">No</span>
              )
            }
          />
          <FieldRow label="Order ID" value={charge.orderId || "—"} />
          <FieldRow label="Store ID" value={charge.storeId || "—"} />
          <FieldRow
            label="Subscription ID"
            value={charge.subscriptionId || "—"}
          />
          <FieldRow label="Created At" value={createdAt.absolute} />
          <FieldRow label="Updated At" value={updatedAt.absolute} />
          <FieldRow
            label="Page Opened At"
            value={pageOpenedAt.absolute}
          />
        </dl>
      </CardContent>
    </Card>
  );
}

export function PaymentDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
      </CardHeader>
      <CardContent>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between py-2 border-b last:border-b-0"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
