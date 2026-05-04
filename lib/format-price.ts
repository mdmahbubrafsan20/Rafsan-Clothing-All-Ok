/** Safe BDT display — avoids runtime errors if Supabase returns numeric strings. */
export function formatBdt(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "0";
  return n.toFixed(2);
}
