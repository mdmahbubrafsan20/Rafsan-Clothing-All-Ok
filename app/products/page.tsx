import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchProducts, getAllCategories } from "@/lib/products";
import ProductsClient from "@/components/ProductsClient";

export const metadata: Metadata = {
  title: "All Products — Premium Clothing Bangladesh | Rafsan Clothing",
  description:
    "Browse our complete collection of premium export-quality clothing in Bangladesh. Men, Women, Kids & Sports — free delivery ৳999+, cash on delivery, 100% original guarantee.",
  keywords: [
    "buy clothes online bangladesh",
    "premium clothing bd",
    "online shopping bangladesh",
    "export quality tshirt bd",
    "rafsan clothing products",
    "bd fashion store",
    "পোশাক কেনাকাটা অনলাইন",
  ],
  openGraph: {
    title: "All Products — Premium Clothing Bangladesh | Rafsan Clothing",
    description:
      "Browse our complete collection of premium export-quality clothing. Free delivery ৳999+.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Products | Rafsan Clothing Bangladesh",
    description:
      "Premium export-quality clothing. Free delivery ৳999+, COD available.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "/products" },
};

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
