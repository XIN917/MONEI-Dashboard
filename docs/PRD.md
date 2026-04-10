# Product Requirements Document (PRD) — MONEI Payment Dashboard

## 1. Overview

### 1.1 Purpose
Build a payment dashboard application that displays payment analytics, a paginated list of payment records, and detailed views of individual payments by consuming the MONEI GraphQL API.

### 1.2 Scope
- **Analytics Dashboard** — KPI summary cards and time-series charts
- **Payments List View** — Paginated, filterable table of payments
- **Single Payment View** — Comprehensive detail page for individual payments
- Responsive, accessible, and well-structured UI with proper error handling

---

## 2. Technical Stack

| Category | Technology | Rationale |
|----------|------------|-----------|
| Framework | React 18+ with TypeScript | Required by task |
| Build Tool | Vite | Fast HMR, lightweight |
| Routing | React Router v6 | Client-side routing for list/detail views |
| GraphQL Client | Apollo Client v3+ | Recommended by task; built-in caching |
| UI Components | shadcn/ui | Recommended by task |
| Styling | Tailwind CSS | shadcn/ui dependency |
| Charts | Recharts | Lightweight, composable |
| Date Formatting | date-fns | Tree-shakeable, reliable |
| Icons | Lucide React | Consistent with shadcn/ui |

---

## 3. GraphQL API

### 3.1 Configuration
- **Endpoint:** `https://mo-graphql.microapps-staging.com`
- **Authorization:** API Key sent in `Authorization` header
- **Key Management:** Stored in `.env.local` as `VITE_API_KEY`, added to `.gitignore`

### 3.2 Queries

#### 3.2.1 `chargesDateRangeKPI` — Analytics

```graphql
query ChargesDateRangeKPI($startDate: Int, $endDate: Int) {
  chargesDateRangeKPI(startDate: $startDate, endDate: $endDate) {
    currency
    total {
      succeededAmount
      succeededCount
      capturedAmount
      capturedCount
      directAmount
      directCount
      canceledAmount
      canceledCount
      refundedAmount
      refundedCount
      failedAmount
      failedCount
      cuSucceededAmount
      cuSucceededCount
      cuCapturedAmount
      cuCapturedCount
      cuDirectAmount
      cuDirectCount
    }
    data {
      timestamp
      succeededAmount
      succeededCount
      capturedAmount
      capturedCount
      directAmount
      directCount
      canceledAmount
      canceledCount
      refundedAmount
      refundedCount
      failedAmount
      failedCount
      cuSucceededAmount
      cuSucceededCount
      cuCapturedAmount
      cuCapturedCount
      cuDirectAmount
      cuDirectCount
    }
  }
}
```

**Response Types:**

| Type | Field | Type | Description |
|------|-------|------|-------------|
| `ChargesDateRangeKPI` | `currency` | `Currencies!` | Payment currency |
| | `total` | `ChargesDateRangeKPITotal!` | Aggregated totals across the date range |
| | `data` | `[ChargesDateRangeKPIRow!]!` | Time-series breakdown (one row per time bucket) |
| `ChargesDateRangeKPITotal` | `succeededAmount` | `Long!` | Total succeeded payment amount (smallest currency unit) |
| | `succeededCount` | `Long!` | Total succeeded payment count |
| | `capturedAmount` | `Long!` | Total captured amount |
| | `capturedCount` | `Long!` | Total captured count |
| | `directAmount` | `Long!` | Total direct (non-3DS) payment amount |
| | `directCount` | `Long!` | Total direct payment count |
| | `canceledAmount` | `Long!` | Total canceled amount |
| | `canceledCount` | `Long!` | Total canceled count |
| | `refundedAmount` | `Long!` | Total refunded amount |
| | `refundedCount` | `Long!` | Total refunded count |
| | `failedAmount` | `Long!` | Total failed amount |
| | `failedCount` | `Long!` | Total failed count |
| | `cuSucceededAmount` | `Long!` | Card-present succeeded amount |
| | `cuSucceededCount` | `Long!` | Card-present succeeded count |
| | `cuCapturedAmount` | `Long!` | Card-present captured amount |
| | `cuCapturedCount` | `Long!` | Card-present captured count |
| | `cuDirectAmount` | `Long!` | Card-present direct amount |
| | `cuDirectCount` | `Long!` | Card-present direct count |
| `ChargesDateRangeKPIRow` | `timestamp` | `AWSTimestamp!` | Unix timestamp for the time bucket |
| | *(all fields above)* | | Same metrics as `ChargesDateRangeKPITotal`, per time bucket |

#### 3.2.2 `charges` — Payment List (Paginated)

```graphql
query Charges($first: Int, $after: String, $filter: ChargeFilter) {
  charges(first: $first, after: $after, filter: $filter) {
    edges {
      node {
        id
        amount
        currency
        status
        createdAt
        # additional summary fields
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

Uses cursor-based pagination. Filter structure (`ChargeFilter`) to be confirmed via Apollo Studio Sandbox exploration.

#### 3.2.3 `charge` — Single Payment

```graphql
query Charge($id: ID!) {
  charge(id: $id) {
    id
    accountId
    checkoutId
    providerId
    providerInternalId
    providerReferenceId
    createdAt
    updatedAt
    amount
    amountEUR
    authorizationCode
    billingDetails { ... }
    billingPlan { ... }
    currency
    customer { ... }
    description
    descriptor
    livemode
    orderId
    storeId
    pointOfSaleId
    terminalId
    sequenceId
    subscriptionId
    paymentMethod { ... }
    cancellationReason
    lastRefundAmount
    lastRefundReason
    refundedAmount
    shippingDetails { ... }
    shop { ... }
    status
    statusCode
    statusMessage
    sessionDetails { ... }
    traceDetails { ... }
    pageOpenedAt
    metadata { key, value }
    fraudDetectorScore
    callbackUrl
    completeUrl
    failUrl
    cancelUrl
  }
}
```

### 3.3 Charge Object — Complete Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | `ID!` | Unique payment identifier |
| `accountId` | `ID!` | MONEI account ID |
| `checkoutId` | `ID!` | Checkout session ID |
| `providerId` | `ID` | Payment provider ID |
| `providerInternalId` | `ID` | Provider internal ID |
| `providerReferenceId` | `ID` | Provider reference ID |
| `createdAt` | `AWSTimestamp` | Creation time (Unix timestamp) |
| `updatedAt` | `AWSTimestamp` | Last update time (Unix timestamp) |
| `amount` | `Int` | Payment amount (smallest currency unit) |
| `amountEUR` | `Int` | Equivalent amount in EUR cents |
| `authorizationCode` | `String` | Authorization code from provider |
| `billingDetails` | `ContactDetails` | Billing contact information |
| `billingPlan` | `BillingPlans` | Billing plan details |
| `currency` | `String!` | ISO currency code |
| `customer` | `Customer` | Customer information |
| `description` | `String` | Payment description |
| `descriptor` | `String` | Statement descriptor |
| `livemode` | `Boolean` | Whether payment is in live mode |
| `orderId` | `ID` | Associated order ID |
| `storeId` | `ID` | Store ID |
| `pointOfSaleId` | `ID` | POS terminal ID |
| `terminalId` | `ID` | Terminal ID |
| `sequenceId` | `ID` | Sequence ID |
| `subscriptionId` | `ID` | Subscription ID |
| `paymentMethod` | `PaymentMethod` | Payment method details |
| `cancellationReason` | `CancellationReason` | Reason for cancellation |
| `lastRefundAmount` | `Int` | Last refund amount |
| `lastRefundReason` | `RefundReason` | Last refund reason |
| `refundedAmount` | `Int` | Total refunded amount |
| `shippingDetails` | `ContactDetails` | Shipping contact information |
| `shop` | `Shop` | Shop information |
| `status` | `ChargeStatus!` | Payment status enum |
| `statusCode` | `String` | Machine-readable status code |
| `statusMessage` | `String` | Human-readable status message |
| `sessionDetails` | `SessionDetails` | Session information |
| `traceDetails` | `TraceDetails` | Trace/debug information |
| `pageOpenedAt` | `AWSTimestamp` | Payment page opened timestamp |
| `metadata` | `[KeyValueItem!]` | Custom key-value metadata |
| `fraudDetectorScore` | `Int` | Fraud risk score (0–1000) |
| `callbackUrl` | `String` | Webhook callback URL |
| `completeUrl` | `String` | Success redirect URL |
| `failUrl` | `String` | Failure redirect URL |
| `cancelUrl` | `String` | Cancellation redirect URL |

---

## 4. Feature Specifications

### 4.1 Analytics Dashboard

> **Task Requirement:** *"Use the chargesDateRangeKPI GraphQL query to fetch aggregated metrics. Present key performance indicators (KPIs), such as total number of payments, total amount, and other aggregated stats. The analytics view should be visually appealing and display data in an easily consumable manner (charts, summary cards, etc.)."*

#### 4.1.1 KPI Summary Cards

| Card | Metric | Source Field |
|------|--------|-------------|
| **Total Payments** | Count of succeeded payments | `total.succeededCount` |
| **Total Volume** | Succeeded payment amount (formatted currency) | `total.succeededAmount` |
| **Success Rate** | `succeededCount / (succeededCount + failedCount) × 100` | Computed |
| **Captured** | Count and amount | `total.capturedCount`, `total.capturedAmount` |
| **Refunded** | Count and amount | `total.refundedCount`, `total.refundedAmount` |
| **Failed** | Count and amount | `total.failedCount`, `total.failedAmount` |
| **Canceled** | Count and amount | `total.canceledCount`, `total.canceledAmount` |
| **Card-Present** | Count and amount | `total.cuSucceededCount`, `total.cuSucceededAmount` |

#### 4.1.2 Time-Series Charts

| Chart | Data | Type |
|-------|------|------|
| **Payment Volume Over Time** | `data[].timestamp` → `data[].succeededAmount` | Line or bar chart |
| **Status Breakdown** | `data[]` with succeeded, failed, canceled, refunded amounts | Stacked area chart |
| **Card-Present vs Card-Not-Present** | `cuSucceededAmount` vs `succeededAmount - cuSucceededAmount` | Pie or donut chart |

#### 4.1.3 Date Range Filter

- **Presets:** Last 7 days, Last 30 days, Last 90 days, This month, Last month
- **Custom range:** Start date — End date picker
- Changing the range refreshes all KPIs and charts

#### 4.1.4 States

| State | Behavior |
|-------|----------|
| Loading | Skeleton cards and chart placeholders |
| Error | Inline error message with "Retry" button |
| Empty | "No data available for the selected range" |

---

### 4.2 Payments List View

> **Task Requirement:** *"Utilize the charges GraphQL query to retrieve a list of payment records. Provide a paginated view of payments. Add filters to narrow down the list by date range, status, or other payment attributes. Each payment entry should show summary details such as amount, date (formatted from a Unix timestamp), status, and any available reference ID. Include loading states, error handling, and user-friendly messages if the data fetch fails."*

#### 4.2.1 Table Columns

| Column | Field | Formatting |
|--------|-------|------------|
| **Payment ID** | `id` | Truncated (`ch_abc1...xyz`) with copy-to-clipboard |
| **Amount** | `amount` + `currency` | Formatted currency (e.g., €12.50) |
| **Date** | `createdAt` | Human-readable (e.g., "Apr 8, 2026, 2:30 PM") |
| **Status** | `status` | Color-coded badge |
| **Description** | `description` | Truncated with tooltip |
| **Reference** | `providerReferenceId` or `orderId` | If available |

#### 4.2.2 Pagination

- Cursor-based pagination via `edges` / `pageInfo`
- Default: **20 items per page**
- Page size selector: **10, 20, 50**
- Navigation: Previous / Next buttons
- Info text: "Showing 1–20 of X"

#### 4.2.3 Filters

| Filter | Control | Notes |
|--------|---------|-------|
| **Date Range** | Date picker (start — end) | Filters by `createdAt` |
| **Status** | Multi-select dropdown | Values from `ChargeStatus` enum |
| **Amount Range** | Min / Max number inputs | Optional |
| **Search** | Text input | Searches by ID, description, reference |

- Filters are debounced (300ms) to reduce API calls
- Filter state persisted in URL query params for shareability
- "Clear all filters" button

#### 4.2.4 States

| State | Behavior |
|-------|----------|
| Loading | Skeleton table rows |
| Error | Inline error with "Retry" button |
| Empty (no data) | "No payments found" |
| No results (after filtering) | "No payments match your filters" with "Clear filters" CTA |

#### 4.2.5 Row Interaction

- Clicking a row navigates to `/payment/:id` (Single Payment View)
- Hover highlights row
- Keyboard navigation support (arrow keys, Enter to open)

---

### 4.3 Single Payment View

> **Task Requirement:** *"Use the charge GraphQL query to retrieve a single payment record. Enable users to click on a payment from the list to see a detailed view. Display all available information for the selected payment, including metadata and any additional information retrieved from the API. Consider using routing to separate the list view from the detailed view."*

#### 4.3.1 Routing

- Route: `/payment/:id`
- Accessed via row click in Payments List or direct URL
- Browser back button returns to list view

#### 4.3.2 Layout

```
┌─────────────────────────────────────────┐
│ Breadcrumb: Dashboard > Payments > ...  │
├─────────────────────────────────────────┤
│ [Back]  Payment ID    [Status Badge]    │
│           €1,250.00                     │
│           Apr 8, 2026, 2:30 PM          │
├──────────────────┬──────────────────────┤
│ Payment Details  │ Customer Info        │
│ - Account ID     │ - Name               │
│ - Currency       │ - Email              │
│ - Status Code    │ - Phone              │
│ - Description    │                      │
│ - Descriptor     │ Payment Method       │
│ - Refunded Amt   │ - Type, Brand, Last4 │
│ - Fraud Score    │                      │
│ - Created At     │ Billing Details      │
│ - Updated At     │ - Name, Address      │
│ - Livemode       │                      │
│                  │ Shipping Details     │
│ Metadata         │ - Name, Address      │
│ - key: value     │                      │
│                  │ Redirect URLs        │
│                  │ - Callback, Complete │
│                  │ - Fail, Cancel       │
└──────────────────┴──────────────────────┘
```

#### 4.3.3 Content Sections

**Header**
- Payment ID (full, with copy button)
- Status badge (large, color-coded per status)
- Amount (prominent, formatted currency)
- Created date (human-readable + relative time tooltip)

**Payment Details**

| Field | Source |
|-------|--------|
| Account ID | `accountId` |
| Checkout ID | `checkoutId` |
| Provider ID | `providerId` |
| Provider Reference | `providerReferenceId` |
| Currency | `currency` |
| Amount (EUR equiv.) | `amountEUR` |
| Status Code | `statusCode` |
| Status Message | `statusMessage` |
| Description | `description` |
| Statement Descriptor | `descriptor` |
| Authorization Code | `authorizationCode` |
| Refunded Amount | `refundedAmount` |
| Last Refund Amount | `lastRefundAmount` |
| Fraud Detector Score | `fraudDetectorScore` |
| Live Mode | `livemode` (Yes/No badge) |
| Order ID | `orderId` |
| Store ID | `storeId` |
| Subscription ID | `subscriptionId` |
| Created At | `createdAt` (formatted) |
| Updated At | `updatedAt` (formatted) |
| Page Opened At | `pageOpenedAt` (formatted) |

**Customer Information**
- Name, email, phone (from `customer`)

**Payment Method**
- Type, brand, last 4 digits, expiry (from `paymentMethod`)

**Billing Details**
- Name, email, phone, address (from `billingDetails`)

**Shipping Details**
- Name, email, phone, address (from `shippingDetails`)

**Metadata**
- Key-value pairs table (from `metadata`)

**Redirect URLs**
- `callbackUrl`, `completeUrl`, `failUrl`, `cancelUrl` — truncated with external link icon

#### 4.3.4 States

| State | Behavior |
|-------|----------|
| Loading | Full-page skeleton |
| Not Found | "Payment not found" with link back to list |
| Error | Error message with "Retry" button |

---

## 5. Data Transformations

### 5.1 Currency Formatting
- Amounts are in the **smallest currency unit** (e.g., cents for EUR/USD)
- Display formula: `amount / 100` with `Intl.NumberFormat`
- Example: `1250` → `€12.50`

### 5.2 Timestamp Formatting
- Input: **Unix timestamp in seconds** (`AWSTimestamp`)
- Primary display: `"Apr 8, 2026, 2:30 PM"` (via `date-fns` `format()`)
- Relative tooltip: `"2 hours ago"` (via `date-fns` `formatDistanceToNow()`)

### 5.3 Status Badge Colors

| Status | Color | Hex |
|--------|-------|-----|
| SUCCEEDED | Green | `#22c55e` |
| FAILED | Red | `#ef4444` |
| CANCELED | Gray | `#6b7280` |
| REFUNDED | Blue | `#3b82f6` |
| PENDING | Amber | `#f59e0b` |
| Other/Unknown | Neutral | `#9ca3af` |

### 5.4 ID Truncation
- List view: `ch_abc1...xyz` (first 8 + last 4 chars)
- Detail view: Full ID with copy-to-clipboard button

---

## 6. Error Handling

> **Task Requirement:** *"Include loading states, error handling, and user-friendly messages if the data fetch fails."* / *"Handle potential data inconsistencies and errors gracefully."*

### 6.1 API Errors

| Error Type | Handling |
|------------|----------|
| Network failure | Toast notification + inline error with "Retry" |
| GraphQL error | Logged to console; user-friendly message displayed |
| 401 / 403 (auth) | Error page with instructions to check API key |
| Rate limited | Automatic retry with exponential backoff; notify user if persistent |

### 6.2 Data Inconsistencies

| Scenario | Handling |
|----------|----------|
| Missing/null field | Display "—" or hide the field entirely |
| Invalid timestamp | Show raw value with a warning icon |
| Missing currency | Fall back to `amountEUR` with EUR label |
| Empty metadata | Show "No metadata" message |
| Null customer | Show "No customer information" |

### 6.3 Loading States

- **Skeleton screens** for all async data (cards, tables, detail fields)
- **Spinners** for user-triggered actions (retry, filter apply)
- **Optimistic UI** for filter changes where applicable

---

## 7. Security

> **Task Requirement:** *"DO NOT hardcode the API Key in your source code. Instead, store your API key in an environment variable (e.g. in a .env file) and ensure that this file is added to your .gitignore."*

### 7.1 Environment Variables

```env
# .env.local (gitignored)
VITE_API_KEY=pk_test_4a140607778e1217f56ccb8b50540f91
```

```env
# .env.example (committed)
VITE_API_KEY=your_api_key_here
```

### 7.2 Apollo Client Setup

```typescript
const client = new ApolloClient({
  uri: "https://mo-graphql.microapps-staging.com",
  headers: {
    Authorization: import.meta.env.VITE_API_KEY,
  },
  cache: new InMemoryCache(),
});
```

### 7.3 Additional Measures
- `.env`, `.env.local`, `.env.*.local` in `.gitignore`
- No logging of API keys or full API responses in production
- Sanitize filter inputs to prevent injection

---

## 8. UI/UX Design

### 8.1 Layout

```
┌──────────────────────────────────────────────┐
│  [MONEI]  Analytics  |  Payments             │  ← Header / Nav
├──────────────────────────────────────────────┤
│                                              │
│  Main Content Area                           │
│  • /              → Analytics Dashboard      │
│  • /payments      → Payments List            │
│  • /payment/:id   → Payment Detail           │
│                                              │
└──────────────────────────────────────────────┘
```

### 8.2 Navigation

| Element | Behavior |
|---------|----------|
| Header tabs | Switch between Analytics (`/`) and Payments (`/payments`) |
| Row click | Navigate to `/payment/:id` |
| Breadcrumb | `Dashboard > Payments > [ID]` on detail page |
| Back button | Returns to `/payments` |
| Browser history | Full back/forward support |

### 8.3 Responsive Breakpoints

| Breakpoint | Width | Layout Adjustments |
|------------|-------|--------------------|
| Mobile | < 640px | Single column, stacked cards, horizontal scroll table |
| Tablet | 640–1024px | Two-column cards, full table |
| Desktop | > 1024px | Full layout, side-by-side detail panels |

### 8.4 Design System
- **shadcn/ui** for all base components (buttons, dialogs, dropdowns, badges, tables)
- **Tailwind CSS** for custom styling and responsive design
- **Lucide React** for icons
- Consistent 4px spacing grid
- WCAG 2.1 AA color contrast ratios

---

## 9. Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── Header.tsx       # Logo + tab navigation
│   │   └── Layout.tsx       # Page wrapper with nav
│   ├── analytics/
│   │   ├── KPICards.tsx     # Summary metric cards
│   │   ├── VolumeChart.tsx  # Time-series volume chart
│   │   ├── StatusChart.tsx  # Status breakdown chart
│   │   └── DateRangePicker.tsx
│   ├── payments/
│   │   ├── PaymentsTable.tsx
│   │   ├── PaymentRow.tsx
│   │   ├── PaymentsFilters.tsx
│   │   └── Pagination.tsx
│   └── payment/
│       ├── PaymentHeader.tsx
│       ├── PaymentDetails.tsx
│       ├── CustomerInfo.tsx
│       ├── MetadataTable.tsx
│       └── RedirectUrls.tsx
├── graphql/
│   ├── queries/
│   │   ├── chargesDateRangeKPI.ts
│   │   ├── charges.ts
│   │   └── charge.ts
│   └── client.ts            # Apollo Client configuration
├── hooks/
│   ├── useFormattedDate.ts
│   ├── useFormattedCurrency.ts
│   └── useDebounce.ts
├── pages/
│   ├── Analytics.tsx        # Analytics dashboard page
│   ├── Payments.tsx         # Payments list page
│   └── PaymentDetail.tsx    # Single payment detail page
├── lib/
│   ├── utils.ts             # Shared utilities
│   └── constants.ts         # Status colors, config
├── types/
│   └── graphql.ts           # TypeScript types for GraphQL responses
├── App.tsx                  # Router configuration
├── main.tsx                 # App entry point
└── index.css                # Tailwind + global styles
```

---

## 10. Nice-to-Have Features

| Feature | Description |
|---------|-------------|
| **Dark Mode** | Toggle with `localStorage` persistence |
| **Export to CSV** | Export filtered payment list |
| **Copy to Clipboard** | One-click copy for IDs, amounts, URLs |
| **URL State Persistence** | Filters and pagination in query params |
| **Relative Time Tooltips** | Hover timestamps to see "X hours ago" |
| **Keyboard Navigation** | Arrow keys in table, Enter to open |
| **Error Boundary** | React error boundary for graceful crash recovery |

---

## 11. Assumptions

> **Task Requirement:** *"Document any assumptions or trade-offs made during development in the README."*

1. **CORS:** The API supports CORS for local development (`localhost`).
2. **API Stability:** The GraphQL schema remains stable during development.
3. **AWSTimestamp:** Unix timestamps are in **seconds** (not milliseconds).
4. **Amounts:** All amounts are in the **smallest currency unit** (e.g., cents).
5. **Single Currency:** The dashboard displays one currency at a time; multi-currency aggregation is not required.
6. **Data Volume:** The test dataset is of reasonable size (< 1,000 payments).
7. **No User Auth:** The API key is the only authentication mechanism required.
8. **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions).
9. **ChargeStatus Enum:** Exact values to be confirmed via Apollo Studio Sandbox; assumed to include SUCCEEDED, FAILED, CANCELED, REFUNDED, PENDING.
10. **ChargeFilter Input:** Exact filter structure to be confirmed via Apollo Studio Sandbox exploration.

---

## 12. Trade-offs

| Decision | Trade-off | Rationale |
|----------|-----------|-----------|
| Apollo Client over alternatives | Larger bundle size | Recommended by task; excellent caching and dev experience |
| Cursor-based pagination | No direct "jump to page N" | Matches GraphQL API design; more efficient for large datasets |
| Client-side filtering via URL params | URL can get long | Enables shareable links; better UX than local state |
| Recharts over D3.js | Less customization | Simpler API; sufficient for dashboard needs |
| shadcn/ui over custom components | Dependency on Radix UI | Recommended by task; accessible, well-maintained |

---

## 13. Success Criteria

> Mapped directly to task requirements.

| # | Requirement | Status |
|---|-------------|--------|
| 1 | Analytics dashboard using `chargesDateRangeKPI` query | ✅ Specified |
| 2 | KPIs: total payments, total amount, aggregated stats | ✅ Specified |
| 3 | Visually appealing analytics view (charts, cards) | ✅ Specified |
| 4 | Payments list using `charges` query | ✅ Specified |
| 5 | Paginated view of payments | ✅ Specified |
| 6 | Filters: date range, status, other attributes | ✅ Specified |
| 7 | Summary details: amount, date (formatted), status, reference ID | ✅ Specified |
| 8 | Loading states, error handling, user-friendly messages | ✅ Specified |
| 9 | Single payment view using `charge` query | ✅ Specified |
| 10 | Click from list to detailed view | ✅ Specified |
| 11 | Display all available info including metadata | ✅ Specified |
| 12 | Routing to separate list from detail | ✅ Specified |
| 13 | ReactJS with TypeScript | ✅ Specified |
| 14 | shadcn/ui for UI components | ✅ Specified |
| 15 | API key in env variable, not hardcoded | ✅ Specified |
| 16 | Unix timestamps converted to human-readable | ✅ Specified |
| 17 | Handle data inconsistencies gracefully | ✅ Specified |
| 18 | README with setup instructions | ✅ Planned |
| 19 | README with design decisions and assumptions | ✅ Planned |

---

## 14. README Documentation Plan

> **Task Requirement:** *"Provide a README file with clear instructions on how to run the app. Explain any design decisions or assumptions."* / *"Document any assumptions or trade-offs made during development in the README."*

The README.md will include the following sections:

### 14.1 Project Overview
- Brief description of the application
- Technologies used (React, TypeScript, Apollo Client, shadcn/ui, Recharts)

### 14.2 Prerequisites
- Node.js version (e.g., >= 18)
- Package manager (npm / pnpm / yarn)

### 14.3 Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
4. Add your API key to `.env.local`:
   ```env
   VITE_API_KEY=your_api_key_here
   ```
5. Start the development server: `npm run dev`
6. Open `http://localhost:5173`

### 14.4 Available Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

### 14.5 Project Structure
- High-level overview of the `src/` directory layout

### 14.6 Design Decisions
- Why Apollo Client (recommended by task, caching, dev tools)
- Why cursor-based pagination (matches GraphQL API design)
- Why Recharts (lightweight, sufficient for dashboard)
- Why shadcn/ui (recommended, accessible, customizable)
- URL state persistence for filters (shareable links)

### 14.7 Assumptions
1. CORS is enabled for local development
2. API schema is stable during development
3. AWSTimestamp is in seconds (not milliseconds)
4. Amounts are in smallest currency unit (cents)
5. Single currency displayed at a time
6. Test dataset is reasonable in size (< 1,000 payments)
7. API key is the only auth mechanism required
8. Modern browsers supported (last 2 versions)
9. `ChargeStatus` enum values to be confirmed via Apollo Studio Sandbox
10. `ChargeFilter` input structure to be confirmed via Apollo Studio Sandbox

### 14.8 Trade-offs
- Apollo Client bundle size vs. developer experience and caching
- Cursor-based pagination vs. offset-based (no direct page jump, but more efficient)
- Client-side filter state in URL vs. local state (shareable but longer URLs)

### 14.9 Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_KEY` | MONEI GraphQL API key | Yes |

### 14.10 Known Limitations
- Any features not fully implemented
- Areas for future improvement

---

## 15. Open Questions

1. What are the exact values of the `ChargeStatus` enum?
2. What is the exact structure of the `ChargeFilter` input type for filtering the `charges` query?
3. Are there official MONEI branding guidelines (logo, primary colors)?
4. Should amounts always display in the original currency, or should EUR (`amountEUR`) be the default?
5. What time buckets does `chargesDateRangeKPI.data` use (hourly, daily, weekly)?

---

## 16. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-08 | Frontend Candidate | Initial PRD creation |
| 1.1 | 2026-04-08 | Frontend Candidate | Added README Documentation Plan (Section 14); cleaned up duplicate content |
