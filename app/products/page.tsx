"use client";

import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchProducts, getAllCategories } from "@/lib/products";
import { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";
import { Search, Filter } from "lucide-react";
import { normalizeCategoryName } from "@/lib/category-nav";

function categoryMatch(productCategory: string | undefined, filterKey: string) {
  if (filterKey === "all") return true;
  return (
    !!productCategory &&
    normalizeCategoryName(productCategory) === normalizeCategoryName(filterKey)
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>(search);

  /** Category filter always follows `?category=` when present (matches DB name case-insensitively). */
  const effectiveCategory = useMemo(() => {
    const q = categoryParam.trim();
    return q.length > 0 ? q : "all";
  }, [categoryParam]);

  const applyCategory = useCallback(
    (category: string) => {
      const p = new URLSearchParams(searchParams.toString());
      if (category === "all") {
        p.delete("category");
      } else {
        p.set("category", category);
      }
      const qs = p.toString();
      router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    },
    [router, searchParams]
  );

  const categoryFilterActive = useCallback(
    (category: string) => {
      if (category === "all") return effectiveCategory === "all";
      return normalizeCategoryName(category) === normalizeCategoryName(effectiveCategory);
    },
    [effectiveCategory]
  );

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await fetchProducts({ activeOnly: true });
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getAllCategories();
        const categoryNames = data.map((category) => category.name);
        setCategories(["all", ...categoryNames]);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchCategory = categoryMatch(p.category, effectiveCategory);
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
    setFilteredProducts(filtered);
  }, [effectiveCategory, searchQuery, products]);

  const clearAllFilters = () => {
    setSearchQuery("");
    router.replace("/products", { scroll: false });
  };

  const displayCategoryLabel =
    effectiveCategory === "all"
      ? ""
      : effectiveCategory.charAt(0).toUpperCase() + effectiveCategory.slice(1);

  return (
    <div className="min-h-screen bg-white max-md:bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                All Products
              </h1>
              <p className="text-gray-600 mt-2">
                Discover our latest collection of premium clothing
              </p>
            </div>

            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div className="lg:hidden mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => applyCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors ${
                    categoryFilterActive(category)
                      ? "bg-black text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredProducts.length}</span> product
              {filteredProducts.length !== 1 ? "s" : ""}
              {effectiveCategory !== "all" && ` in ${displayCategoryLabel}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
            {(searchQuery || effectiveCategory !== "all") && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Categories
              </h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        categoryFilterActive(category)
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => applyCategory(category)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {category === "all"
                            ? products.length
                            : products.filter((p) => categoryMatch(p.category, category)).length}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {(effectiveCategory !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="w-full mt-6 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="px-4 py-6 md:px-0 md:py-0">
                <div className={STORE_PRODUCT_GRID_CLASS}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-sm h-80 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <Search className="h-10 w-10 md:h-12 md:w-12 text-gray-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? `No products match "${searchQuery}". Try a different search term.`
                    : effectiveCategory !== "all"
                    ? `No products found in ${displayCategoryLabel} category.`
                    : "No products available at the moment."}
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => applyCategory("all")}
                    className="px-5 py-2 text-sm md:text-base bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Show All Products
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="px-5 py-2 text-sm md:text-base border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-4 py-6 md:px-0 md:py-0">
                <div className={STORE_PRODUCT_GRID_CLASS}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
