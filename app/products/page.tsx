import { Suspense } from "react";
import { fetchProducts, getAllCategories } from "@/lib/products";
import ProductsClient from "@/components/ProductsClient";

// Server component — Supabase call হবে server এ, user loading দেখবে না
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const categoryParam = params.category || "";
  const searchParam = params.search || "";

  // Server এ data fetch
  const [products, categoriesData] = await Promise.all([
    fetchProducts({ activeOnly: true }),
    getAllCategories(),
  ]);

  const categoryNames = categoriesData.map((c) => c.name);

  return (
    <Suspense fallback={null}>
      <ProductsClient
        initialProducts={products}
        categories={categoryNames}
        initialCategory={categoryParam}
        initialSearch={searchParam}
      />
    </Suspense>
  );
}
