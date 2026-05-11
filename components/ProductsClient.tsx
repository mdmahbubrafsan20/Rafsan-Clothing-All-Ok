"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";
import { Filter } from "lucide-react";

function normalize(name: string): string {
  return name.trim().toLowerCase().replace(/[''`]/g, "").replace(/s$/, "");
}

function categoryMatch(productCategory: string | undefined, filterKey: string) {
  if (filterKey === "all") return true;
  if (!productCategory) return false;
  return normalize(productCategory) === normalize(filterKey);
}

type Props = {
  initialProducts: Product[];
  categories: string[];
  initialCategory: string;
  initialSearch: string;
};

export default function ProductsClient({ initialProducts, categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchParam);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  const allCategories = ["all", ...categories];

  const applyCategory = (category: string) => {
    const p = new URLSearchParams();
    if (category !== "all") p.set("category", category);
    if (searchQuery) p.set("search", searchQuery);
    const qs = p.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    router.push("/products");
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchCategory = categoryMatch(p.category, categoryParam);
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [initialProducts, categoryParam, searchQuery]);

  const categoryFilterActive = (category: string) => {
    if (category === "all") return categoryParam === "all";
    return normalize(category) === normalize(categoryParam);
  };

  const displayCategoryLabel =
    categoryParam === "all" ? "" : categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-6">
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-500 text-sm mt-1">Discover our latest collection of premium clothing</p>
          </div>

          {/* Mobile search */}
          <div className="relative w-full md:hidden mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          {/* Mobile category pills */}
          <div className="lg:hidden mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => applyCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    categoryFilterActive(category)
                      ? "bg-black text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {category === "all" ? "All" : category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> পণ্য
              {categoryParam !== "all" && ` — ${displayCategoryLabel}`}
              {searchQuery && ` — "${searchQuery}"`}
            </p>
            {(searchQuery || categoryParam !== "all") && (
              <button type="button" onClick={clearAllFilters} className="text-xs text-gray-400 hover:text-gray-700 underline">
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Categories</h2>
              <ul className="space-y-1">
                {allCategories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => applyCategory(category)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors text-sm ${
                        categoryFilterActive(category)
                          ? "bg-black text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category === "all" ? "All Products" : category}</span>
                        <span className={`text-xs ${categoryFilterActive(category) ? "text-gray-300" : "text-gray-400"}`}>
                          {category === "all"
                            ? initialProducts.length
                            : initialProducts.filter((p) => categoryMatch(p.category, category)).length}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              {(categoryParam !== "all" || searchQuery) && (
                <button type="button" onClick={clearAllFilters} className="w-full mt-4 px-3 py-2 text-xs text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">কোনো পণ্য পাওয়া যায়নি</h3>
                <p className="text-sm text-gray-500 mb-6">
                  {searchQuery ? `"${searchQuery}" এর কোনো ফলাফল নেই।` : `${displayCategoryLabel} category তে কোনো পণ্য নেই।`}
                </p>
                <button type="button" onClick={clearAllFilters} className="px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 text-sm font-medium">
                  সব পণ্য দেখুন
                </button>
              </div>
            ) : (
              <div className={STORE_PRODUCT_GRID_CLASS}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
