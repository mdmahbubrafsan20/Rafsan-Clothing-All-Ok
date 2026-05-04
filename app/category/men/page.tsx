"use client";

import { useState, useEffect, type ReactNode } from "react";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";
import { getProductsByCategory, type Product } from "@/lib/products";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";

export default function MenCategoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductsByCategory("men");
        if (!cancelled) setProducts(data);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const shell = (children: ReactNode) => (
    <>
      <div className="min-h-screen bg-white max-md:bg-white pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Men Collection</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Discover trendy and comfortable clothing for men
            </p>
          </div>
          {children}
        </div>
      </div>
      <BottomNav />
    </>
  );

  if (loading) {
    return shell(
      <div className={STORE_PRODUCT_GRID_CLASS}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm animate-pulse"
          >
            <div className="aspect-square bg-gray-200" />
            <div className="p-3 md:p-4">
              <div className="h-3 md:h-4 bg-gray-200 rounded mb-2" />
              <div className="h-5 md:h-6 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return shell(
      <div className="text-center py-12">
        <p className="text-red-600">Error loading products: {error}</p>
      </div>
    );
  }

  if (!products.length) {
    return shell(
      <div className="text-center py-12 text-gray-500">No products found in this category.</div>
    );
  }

  return shell(
    <div className={STORE_PRODUCT_GRID_CLASS}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
