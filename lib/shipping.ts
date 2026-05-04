/** Match checkout delivery fees (BDT). */
export const DELIVERY_INSIDE_DHK = 60;
export const DELIVERY_OUTSIDE_DHK = 120;

export function deliveryFee(option: "inside" | "outside"): number {
  return option === "inside" ? DELIVERY_INSIDE_DHK : DELIVERY_OUTSIDE_DHK;
}
