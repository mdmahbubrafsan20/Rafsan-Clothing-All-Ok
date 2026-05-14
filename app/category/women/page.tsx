import type { Metadata } from "next";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory } from "@/lib/products";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";
import { BreadcrumbSchema } from "@/app/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

export const metadata: Metadata = {
  title: "Women's Collection — Premium Women's Clothing Bangladesh | Rafsan Clothing",
  description:
    "Shop premium women's clothing in Bangladesh. Export quality fashion, trendy styles — free delivery ৳999+, COD available. WhatsApp: 01610-735064",
  keywords: [
    "women clothing bangladesh",
    "womens fashion bd",
    "buy womens clothes online bd",
    "premium womens fashion bangladesh",
    "ladies clothing bd",
    "মেয়েদের পোশাক বাংলাদেশ",
  ],
  openGraph: {
    title:
      "Women's Collection — Premium Women's Clothing Bangladesh | Rafsan Clothing",
    description:
      "Shop premium women's clothing in Bangladesh. Export quality, free delivery ৳999+.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Women's Collection | Rafsan Clothing Bangladesh",
    description:
      "Premium women's clothing — export quality, free delivery ৳999+.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: `${SITE_URL}/category/women` },
};

export default async function WomenCategoryPage() {
  const products = await getProductsByCategory("women");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Women", url: `${SITE_URL}/category/women` },
        ]}
      />
      <div className="min-h-screen bg-white max-md:bg-white pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Women's Collection
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Premium women's clothing — export quality, free delivery
              ৳999+
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-gray-200 bg-gray-50/80">
              <p className="text-gray-600 mb-4">
                No products in this category yet.
              </p>
              <Link
                href="/products"
                className="text-gray-900 font-medium underline"
              >
                View all products
              </Link>
            </div>
          ) : (
            <div className={STORE_PRODUCT_GRID_CLASS}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
