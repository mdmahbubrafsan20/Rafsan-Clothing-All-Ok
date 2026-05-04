"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { fetchActiveProductsRange } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";

const PAGE_SIZE = 12;

type Props = {
  initialProducts: Product[];
  initialHasMore: boolean;
};

export default function HomeProductGrid({ initialProducts, initialHasMore }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const next = await fetchActiveProductsRange(products.length, PAGE_SIZE);
      if (next.length < PAGE_SIZE) setHasMore(false);
      setProducts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        for (const p of next) {
          if (!ids.has(p.id)) merged.push(p);
        }
        return merged;
      });
    } finally {
      setLoading(false);
    }
  }

  if (products.length === 0) return null;

  return (
    <div className="px-4 py-6 md:px-0 md:py-0">
      <div className={STORE_PRODUCT_GRID_CLASS}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8 pb-4">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 rounded-full border border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
