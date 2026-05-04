import Link from "next/link";
import type { Category } from "@/lib/products";
import {
  CORE_SHOP_CATEGORIES,
  normalizeCategoryName,
  productsCategoryHref,
} from "@/lib/category-nav";

type Props = {
  categories: Category[];
};

/**
 * Single horizontal category bar for the homepage (matches `/products` filtering via `?category=`).
 */
export default function CategorySection({ categories }: Props) {
  const items: { label: string; href: string }[] = [{ label: "All", href: "/products" }];

  for (const label of CORE_SHOP_CATEGORIES) {
    items.push({ label, href: productsCategoryHref(label) });
  }

  for (const c of categories) {
    const n = normalizeCategoryName(c.name);
    if (CORE_SHOP_CATEGORIES.some((core) => normalizeCategoryName(core) === n)) continue;
    items.push({ label: c.name, href: productsCategoryHref(c.name) });
  }

  const deduped: { label: string; href: string }[] = [];
  const seenHref = new Set<string>();
  for (const it of items) {
    if (seenHref.has(it.href)) continue;
    seenHref.add(it.href);
    deduped.push(it);
  }

  return (
    <section className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-100 bg-white" aria-label="Shop by category">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {deduped.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              prefetch={false}
              className="shrink-0 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:border-black hover:bg-black hover:text-white transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
