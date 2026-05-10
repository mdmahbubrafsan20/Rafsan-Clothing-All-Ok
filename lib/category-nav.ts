/** Query key used on `/products` for category filtering. */
export const PRODUCTS_CATEGORY_PARAM = "category";

/** Canonical shop labels (order) — links go to `/products?category=…` (case-insensitive match on catalog). */
export const CORE_SHOP_CATEGORIES = ["Men", "Women", "Kids", "Sports"] as const;

export function productsCategoryHref(categoryName: string): string {
  return `/products?${PRODUCTS_CATEGORY_PARAM}=${encodeURIComponent(categoryName)}`;
}

/** Normalize category name for comparison —
 *  strips apostrophe+s ("Men's" → "men"), trailing s ("mens" → "men"),
 *  trims and lowercases so "Men", "Men's", "Mens" all match each other.
 */
export function normalizeCategoryName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[''`]s$/, "") // remove 's (Men's → men)
    .replace(/s$/, "");     // remove trailing s (mens → men, womens → women)
}
