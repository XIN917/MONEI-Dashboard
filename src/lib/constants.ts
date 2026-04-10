import { ChargeStatus } from "@/types/graphql";

export const STATUS_COLORS: Record<ChargeStatus | string, string> = {
  SUCCEEDED: "#22c55e",
  FAILED: "#ef4444",
  CANCELED: "#6b7280",
  REFUNDED: "#3b82f6",
  PENDING: "#f59e0b",
};

export const STATUS_TAILWIND: Record<ChargeStatus | string, string> = {
  SUCCEEDED: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
  FAILED: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
  CANCELED: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600",
  REFUNDED: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
  PENDING: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700",
};

export const DEFAULT_STATUS_COLOR = "#9ca3af";
export const DEFAULT_STATUS_TAILWIND = "bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";

export const PAGE_SIZE_OPTIONS = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 20;

export const DATE_RANGE_PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "This month", days: 0 },
  { label: "Last month", days: -1 },
] as const;
