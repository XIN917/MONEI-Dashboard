// GraphQL Types for MONEI Payment Dashboard

export type Currencies = string;

export type AWSTimestamp = number;

export interface ChargesDateRangeKPITotal {
  succeededAmount: number;
  succeededCount: number;
  capturedAmount: number;
  capturedCount: number;
  directAmount: number;
  directCount: number;
  canceledAmount: number;
  canceledCount: number;
  refundedAmount: number;
  refundedCount: number;
  failedAmount: number;
  failedCount: number;
  cuSucceededAmount: number;
  cuSucceededCount: number;
  cuCapturedAmount: number;
  cuCapturedCount: number;
  cuDirectAmount: number;
  cuDirectCount: number;
}

export interface ChargesDateRangeKPIRow {
  timestamp: AWSTimestamp;
  succeededAmount: number;
  succeededCount: number;
  capturedAmount: number;
  capturedCount: number;
  directAmount: number;
  directCount: number;
  canceledAmount: number;
  canceledCount: number;
  refundedAmount: number;
  refundedCount: number;
  failedAmount: number;
  failedCount: number;
  cuSucceededAmount: number;
  cuSucceededCount: number;
  cuCapturedAmount: number;
  cuCapturedCount: number;
  cuDirectAmount: number;
  cuDirectCount: number;
}

export interface ChargesDateRangeKPI {
  currency: Currencies;
  total: ChargesDateRangeKPITotal;
  data: ChargesDateRangeKPIRow[];
}

// Charges query types

export enum ChargeStatus {
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
  REFUNDED = "REFUNDED",
  PENDING = "PENDING",
}

export interface ChargeFilter {
  startDate?: number;
  endDate?: number;
  status?: ChargeStatus[];
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface ChargeNode {
  id: string;
  amount: number;
  currency: string;
  status: ChargeStatus;
  createdAt: AWSTimestamp;
  description?: string | null;
  providerReferenceId?: string | null;
}

export interface ChargeEdge {
  node: ChargeNode;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ChargesResponse {
  edges: ChargeEdge[];
  pageInfo: PageInfo;
}

// Single Charge query types

export interface ContactDetails {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  } | null;
}

export interface Customer {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface PaymentMethod {
  type?: string | null;
  brand?: string | null;
  last4?: string | null;
  expMonth?: number | null;
  expYear?: number | null;
}

export interface KeyValueItem {
  key: string;
  value: string;
}

export interface BillingPlans {
  id?: string | null;
  name?: string | null;
}

export interface Shop {
  id?: string | null;
  name?: string | null;
}

export interface SessionDetails {
  id?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}

export interface TraceDetails {
  id?: string | null;
}

export interface CancellationReason {
  code?: string | null;
  description?: string | null;
}

export interface RefundReason {
  code?: string | null;
  description?: string | null;
}

export interface Charge {
  id: string;
  accountId: string;
  checkoutId: string;
  providerId?: string | null;
  providerInternalId?: string | null;
  providerReferenceId?: string | null;
  createdAt?: AWSTimestamp | null;
  updatedAt?: AWSTimestamp | null;
  amount?: number | null;
  amountEUR?: number | null;
  authorizationCode?: string | null;
  billingDetails?: ContactDetails | null;
  billingPlan?: BillingPlans | null;
  currency: string;
  customer?: Customer | null;
  description?: string | null;
  descriptor?: string | null;
  livemode?: boolean | null;
  orderId?: string | null;
  storeId?: string | null;
  pointOfSaleId?: string | null;
  terminalId?: string | null;
  sequenceId?: string | null;
  subscriptionId?: string | null;
  paymentMethod?: PaymentMethod | null;
  cancellationReason?: CancellationReason | null;
  lastRefundAmount?: number | null;
  lastRefundReason?: RefundReason | null;
  refundedAmount?: number | null;
  shippingDetails?: ContactDetails | null;
  shop?: Shop | null;
  status: ChargeStatus;
  statusCode?: string | null;
  statusMessage?: string | null;
  sessionDetails?: SessionDetails | null;
  traceDetails?: TraceDetails | null;
  pageOpenedAt?: AWSTimestamp | null;
  metadata?: KeyValueItem[] | null;
  fraudDetectorScore?: number | null;
  callbackUrl?: string | null;
  completeUrl?: string | null;
  failUrl?: string | null;
  cancelUrl?: string | null;
}
