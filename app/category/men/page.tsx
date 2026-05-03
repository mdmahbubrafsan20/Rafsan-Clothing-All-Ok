"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

export default function MenCategoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            categories (
              id,
              name
            )
          `)
          .eq("categories.name", "men");

        if (error) {
          console.error("Supabase query error:", error);
          throw error;
        }

        console.log("Men products from Supabase (relational):", data);
        
        // Map the data to include category from the joined table
        const mappedProducts = (data || []).map((product: any) => ({
          ...product,
          category: product.categories?.name || "men",
        }));
        
        setProducts(mappedProducts);
      } catch (err: any) {
        console.error("Failed to load men's products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Men Collection</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover trendy and comfortable clothing for men
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-800 rounded-lg md:rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-zinc-700"></div>
                <div className="p-3 md:p-4">
                  <div className="h-3 md:h-4 bg-gray-200 dark:bg-zinc-700 rounded mb-2"></div>
                  <div className="h-5 md:h-6 bg-gray-200 dark:bg-zinc-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Men Collection</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover trendy and comfortable clothing for men
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">Error loading products: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Men Collection</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover trendy and comfortable clothing for men
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No products found in this category.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Page header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Men Collection</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover trendy and comfortable clothing for men
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}