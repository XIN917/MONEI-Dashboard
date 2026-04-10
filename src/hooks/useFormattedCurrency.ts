import { useMemo } from "react";

export function useFormattedCurrency(
  amount: number | null | undefined,
  currency: string = "EUR"
): string {
  return useMemo(() => {
    if (amount == null || isNaN(amount)) return "—";

    // Amounts are in smallest currency unit (cents)
    const value = amount / 100;

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
      }).format(value);
    } catch {
      return `€${value.toFixed(2)}`;
    }
  }, [amount, currency]);
}
