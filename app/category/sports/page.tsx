import type { Metadata } from "next";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory } from "@/lib/products";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";
import { BreadcrumbSchema } from "@/app/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

export const metadata: Metadata = {
  title: "Sports Collection — Premium Sportswear Bangladesh | Rafsan Clothing",
  description:
    "Shop premium sportswear & athleisure in Bangladesh. Performance fabrics, comfortable fits — free delivery ৳999+, COD available. WhatsApp: 01610-735064",
  keywords: [
    "sports clothing bangladesh",
    "sportswear bd",
    "athleisure bangladesh",
    "gym wear bd",
    "performance clothing bangladesh",
    "খেলাধুলার পোশাক বাংলাদেশ",
  ],
  openGraph: {
    title:
      "Sports Collection — Premium Sportswear Bangladesh | Rafsan Clothing",
    description:
      "Shop premium sportswear & athleisure in Bangladesh. Performance fabrics, free delivery ৳999+.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sports Collection | Rafsan Clothing Bangladesh",
    description:
      "Premium sportswear — performance fabrics, free delivery ৳999+.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: `${SITE_URL}/category/sports` },
};

export default async function SportsCategoryPage() {
  const products = await getProductsByCategory("sports");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Sports", url: `${SITE_URL}/category/sports` },
        ]}
      />
      <div className="min-h-screen bg-white max-md:bg-white pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Sports Collection
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Premium sportswear & athleisure — performance fabrics, free
              delivery ৳999+
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
