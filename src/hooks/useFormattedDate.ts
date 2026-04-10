import { useMemo } from "react";
import { format, formatDistanceToNow, isValid } from "date-fns";

export function useFormattedDate(
  timestamp: number | null | undefined
): { absolute: string; relative: string } {
  return useMemo(() => {
    if (timestamp == null || isNaN(timestamp)) {
      return { absolute: "—", relative: "" };
    }

    // AWSTimestamp is in seconds; JS Date expects milliseconds
    const date = new Date(timestamp * 1000);

    if (!isValid(date)) {
      return { absolute: "Invalid date", relative: "" };
    }

    return {
      absolute: format(date, "MMM d, yyyy, h:mm a"),
      relative: formatDistanceToNow(date, { addSuffix: true }),
    };
  }, [timestamp]);
}

export function formatTimestamp(
  timestamp: number | null | undefined,
  dateFormat: string = "MMM d, yyyy, h:mm a"
): string {
  if (timestamp == null || isNaN(timestamp)) return "—";

  const date = new Date(timestamp * 1000);

  if (!isValid(date)) {
    return "Invalid date";
  }

  return format(date, dateFormat);
}
