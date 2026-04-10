import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Charge, ContactDetails } from "@/types/graphql";

interface ContactDetailsSectionProps {
  title: string;
  details: ContactDetails | null | undefined;
}

function ContactDetailsSection({
  title,
  details,
}: ContactDetailsSectionProps) {
  if (!details) {
    return null;
  }

  const hasAnyInfo = details.name || details.email || details.phone || details.address;
  if (!hasAnyInfo) {
    return null;
  }

  const address = details.address;
  const addressLines = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postalCode,
    address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          {details.name && (
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd className="text-sm font-medium">{details.name}</dd>
            </div>
          )}
          {details.email && (
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="text-sm font-medium">{details.email}</dd>
            </div>
          )}
          {details.phone && (
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Phone</dt>
              <dd className="text-sm font-medium">{details.phone}</dd>
            </div>
          )}
          {addressLines && (
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Address</dt>
              <dd className="text-sm font-medium text-right max-w-xs break-words">
                {addressLines}
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}

interface PaymentMethodSectionProps {
  paymentMethod: Charge["paymentMethod"];
}

function PaymentMethodSection({ paymentMethod }: PaymentMethodSectionProps) {
  if (!paymentMethod) {
    return null;
  }

  const hasAnyInfo =
    paymentMethod.type ||
    paymentMethod.brand ||
    paymentMethod.last4 ||
    paymentMethod.expMonth ||
    paymentMethod.expYear;

  if (!hasAnyInfo) {
    return null;
  }

  const expiry =
    paymentMethod.expMonth != null && paymentMethod.expYear != null
      ? `${paymentMethod.expMonth.toString().padStart(2, "0")}/${paymentMethod.expYear}`
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          {paymentMethod.type && (
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Type</dt>
              <dd className="text-sm font-medium capitalize">{paymentMethod.type}</dd>
            </div>
          )}
          {paymentMethod.brand && (
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Brand</dt>
              <dd className="text-sm font-medium">{paymentMethod.brand}</dd>
            </div>
          )}
          {paymentMethod.last4 && (
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Last 4</dt>
              <dd className="text-sm font-medium font-mono">•••• {paymentMethod.last4}</dd>
            </div>
          )}
          {expiry && (
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Expiry</dt>
              <dd className="text-sm font-medium">{expiry}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}

interface CustomerInfoProps {
  charge: Charge;
}

export function CustomerInfo({ charge }: CustomerInfoProps) {
  return (
    <div className="space-y-4">
      <ContactDetailsSection
        title="Customer Information"
        details={charge.customer}
      />
      <PaymentMethodSection paymentMethod={charge.paymentMethod} />
      <ContactDetailsSection
        title="Billing Details"
        details={charge.billingDetails}
      />
      <ContactDetailsSection
        title="Shipping Details"
        details={charge.shippingDetails}
      />
    </div>
  );
}

export function CustomerInfoSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
