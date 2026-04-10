# MONEI Payment Dashboard

A payment dashboard application that displays payment analytics, a paginated list of payment records, and detailed views of individual payments.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![Vite](https://img.shields.io/badge/Vite-6-646cff)

## Features

- **Analytics Dashboard** — KPI summary cards (total payments, volume, success rate, captured, refunded, failed, card-present) and time-series charts with a date range filter
- **Payments List View** — Paginated, filterable table with cursor-based pagination and URL-persisted filters
- **Single Payment View** — Comprehensive detail page showing all payment fields, customer info, billing/shipping details, metadata, and redirect URLs
- **Dark Mode** — Toggle between light and dark themes with localStorage persistence
- **Responsive Design** — Mobile hamburger menu, horizontally scrollable tables, and adaptive layouts
- **Error Handling** — React Error Boundary, per-page loading skeletons, error states with retry buttons, and not-found pages

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18+ with TypeScript |
| Build Tool | Vite 6 |
| GraphQL Client | Apollo Client 3 |
| Routing | React Router 6 |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Date Formatting | date-fns |
| Icons | Lucide React |

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui components (auto-generated)
│   ├── layout/              # Header (with dark mode toggle & mobile menu), Layout
│   ├── analytics/           # KPICards, VolumeChart, StatusChart, DateRangePicker
│   ├── payments/            # PaymentsTable, PaymentsFilters, Pagination
│   └── payment/             # PaymentHeader, PaymentDetails, CustomerInfo, MetadataTable, RedirectUrls
├── graphql/
│   ├── queries/             # chargesDateRangeKPI, charges, charge
│   └── client.ts            # Apollo Client configuration
├── hooks/                   # useFormattedDate, useFormattedCurrency, useDebounce, useTheme
├── pages/                   # Analytics, Payments, PaymentDetail
├── lib/                     # utils, constants (status colors, page size, date presets)
├── types/                   # TypeScript types for GraphQL responses
├── App.tsx                  # Router + Error Boundary
├── main.tsx                 # App entry point (Apollo Provider)
└── index.css                # Tailwind + CSS variables for light/dark themes
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd monei-payment-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your API key:
   ```env
   VITE_API_KEY=your_api_key_here
   ```
   See `.env.example` for reference. The `.env.local` file is gitignored.

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Architecture Decisions

### Apollo Client over Alternatives

Chose Apollo Client for its built-in caching, normalized store, and excellent dev experience. The trade-off is a larger bundle size (~300 KB gzipped), but this is acceptable for a dashboard application.

### Cursor-Based Pagination

The GraphQL API uses cursor-based pagination (`edges` / `pageInfo`), which is more efficient for large, real-time datasets than offset pagination. The trade-off is no direct "jump to page N" — instead, we maintain a cursor history stack in local state.

### URL Query Param Persistence

Filter state (date range, status, amount range, search) is persisted in URL query params. This enables shareable links and browser history navigation. The trade-off is that URLs can get long with many filters active.

### Client-Side Filter Debouncing

Filters are debounced at 300ms to reduce the number of API calls during typing. This improves UX by avoiding unnecessary network requests while keeping the UI responsive.

### shadcn/ui over Full Component Libraries

Chose shadcn/ui for its copy-paste component model, which gives full control over component code and styling. It also integrates seamlessly with Tailwind CSS and uses accessible Radix UI primitives under the hood.

### Recharts over D3.js

Recharts provides a simpler, composable API that is sufficient for dashboard needs. D3.js offers more customization but has a steeper learning curve and larger bundle size.

## Data Transformations

### Currency Formatting

Payment amounts are stored in the **smallest currency unit** (e.g., cents for EUR/USD). Display uses the formula:

```
displayAmount = amount / 100
```

Formatted via `Intl.NumberFormat` with the appropriate currency symbol.

### Timestamp Formatting

All timestamps (`createdAt`, `updatedAt`, `pageOpenedAt`) are **Unix timestamps in seconds**. They are converted to human-readable format via `date-fns`:

- **Absolute:** `"Apr 8, 2026, 2:30 PM"`
- **Relative:** `"2 hours ago"` (used as tooltip text)

### Status Badge Colors

| Status | Color |
|--------|-------|
| SUCCEEDED | Green |
| FAILED | Red |
| CANCELED | Gray |
| REFUNDED | Blue |
| PENDING | Amber |

## Assumptions

1. **CORS:** The MONEI API supports CORS for local development (`localhost`).
2. **API Stability:** The GraphQL schema remains stable during development.
3. **Timestamps:** Unix timestamps are in **seconds** (not milliseconds).
4. **Amounts:** All amounts are in the **smallest currency unit** (e.g., cents).
5. **Single Currency:** The dashboard displays one currency at a time; multi-currency aggregation is not required.
6. **No User Authentication:** The API key is the only authentication mechanism required.
7. **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions).
8. **Data Volume:** The test dataset is of reasonable size (< 1,000 payments).

## Trade-offs

| Decision | Trade-off | Rationale |
|----------|-----------|-----------|
| Cursor-based pagination | No direct "jump to page N" | Matches API design; more efficient for large datasets |
| URL filter state | URLs can get long | Shareable links; better UX than local-only state |
| Recharts over D3.js | Less customization | Simpler API; sufficient for dashboard |
| shadcn/ui over custom components | Dependency on Radix UI | Accessible, well-maintained, recommended by task |
| TypeScript path aliases (`@/*`) | Requires bundler support for `baseUrl` | Cleaner imports; standard in Vite projects |

## License

Private — for evaluation purposes only.
