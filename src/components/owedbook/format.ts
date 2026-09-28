// Shared formatters for the OwedBook screen. Tokens/values only — no business logic.

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Money, e.g. 12669.63 → "$12,669.63". */
export const usd = (n: number): string => USD.format(n ?? 0);

/** Whole-number count, e.g. 2631 → "2,631". */
export const count = (n: number): string => (n ?? 0).toLocaleString("en-US");

/** 2-dp rounding, byte-identical to the service's `round2` (services/owedbook.ts:56).
 *  Exported here per RRM-002 ruling A-01 — the service file is frozen. */
export const round2 = (n: number): number => +n.toFixed(2);
