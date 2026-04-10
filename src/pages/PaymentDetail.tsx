import { useQuery } from "@apollo/client";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHARGE } from "@/graphql/queries/charge";
import { PaymentHeader, PaymentHeaderSkeleton } from "@/components/payment/PaymentHeader";
import { PaymentDetails, PaymentDetailsSkeleton } from "@/components/payment/PaymentDetails";
import { CustomerInfo, CustomerInfoSkeleton } from "@/components/payment/CustomerInfo";
import { MetadataTable, MetadataTableSkeleton } from "@/components/payment/MetadataTable";
import { RedirectUrls, RedirectUrlsSkeleton } from "@/components/payment/RedirectUrls";
import type { Charge } from "@/types/graphql";

export default function PaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(CHARGE, {
    variables: { id: id! },
    skip: !id,
  });

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <div className="text-center">
          <h1 className="text-xl font-semibold">No payment ID provided</h1>
          <p className="text-muted-foreground mt-1">
            Please go back and select a payment from the list.
          </p>
        </div>
        <Button onClick={() => navigate("/payments")}>Back to Payments</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="truncate">Dashboard</span>
          <span>/</span>
          <span className="truncate">Payments</span>
          <span>/</span>
          <span className="truncate">
            <span className="inline-block w-24 h-4 bg-muted rounded animate-pulse" />
          </span>
        </div>

        <PaymentHeaderSkeleton />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PaymentDetailsSkeleton />
            <MetadataTableSkeleton />
            <RedirectUrlsSkeleton />
          </div>
          <div className="space-y-6">
            <CustomerInfoSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h1 className="text-xl font-semibold">Failed to load payment</h1>
          <p className="text-muted-foreground mt-1">{error.message}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/payments")}>
            Back to Payments
          </Button>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!data?.charge) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <div className="text-center">
          <h1 className="text-xl font-semibold">Payment not found</h1>
          <p className="text-muted-foreground mt-1">
            The payment with ID <code className="font-mono text-xs">{id}</code>{" "}
            could not be found.
          </p>
        </div>
        <Button onClick={() => navigate("/payments")}>Back to Payments</Button>
      </div>
    );
  }

  const charge = data.charge as Charge;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:underline">
          Dashboard
        </Link>
        <span>/</span>
        <Link to="/payments" className="hover:underline">
          Payments
        </Link>
        <span>/</span>
        <span className="font-mono text-xs truncate max-w-[200px]" title={charge.id}>
          {charge.id}
        </span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" size="sm" className="self-start" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      <PaymentHeader charge={charge} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PaymentDetails charge={charge} />
          <MetadataTable metadata={charge.metadata} />
          <RedirectUrls charge={charge} />
        </div>
        <div className="space-y-6">
          <CustomerInfo charge={charge} />
        </div>
      </div>
    </div>
  );
}
