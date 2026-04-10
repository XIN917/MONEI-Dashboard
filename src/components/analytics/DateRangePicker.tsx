import * as React from "react";
import { format, startOfMonth, endOfMonth, subMonths, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DATE_RANGE_PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "This month", days: 0 },
  { label: "Last month", days: -1 },
] as const;

export interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

function getPresetRange(preset: (typeof DATE_RANGE_PRESETS)[number]): DateRange {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (preset.days === 0) {
    // This month
    return {
      from: startOfMonth(today),
      to: today,
    };
  }

  if (preset.days === -1) {
    // Last month
    const lastMonth = subMonths(today, 1);
    return {
      from: startOfMonth(lastMonth),
      to: endOfMonth(lastMonth),
    };
  }

  return {
    from: subDays(today, preset.days - 1),
    to: today,
  };
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handlePresetClick = (preset: (typeof DATE_RANGE_PRESETS)[number]) => {
    onDateRangeChange(getPresetRange(preset));
    setOpen(false);
  };

  const handleSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
  };

  const displayValue = React.useMemo(() => {
    if (dateRange?.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, "MMM d, yyyy")} — ${format(dateRange.to, "MMM d, yyyy")}`;
      }
      return format(dateRange.from, "MMM d, yyyy");
    }
    return "Pick a date range";
  }, [dateRange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            {/* Presets sidebar */}
            <div className="border-b p-3 sm:border-r sm:border-b-0 sm:w-40">
              <p className="mb-2 text-xs font-medium text-muted-foreground px-1">
                Presets
              </p>
              <div className="space-y-1">
                {DATE_RANGE_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm font-normal"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            {/* Calendar */}
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleSelect}
              numberOfMonths={1}
              defaultMonth={dateRange?.from}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
