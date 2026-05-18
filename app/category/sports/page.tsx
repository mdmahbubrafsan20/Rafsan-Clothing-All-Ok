import type { Metadata } from "next";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory } from "@/lib/products";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";
import { BreadcrumbSchema, AggregateOfferSchema } from "@/app/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

export const metadata: Metadata = {
  title:
    "Sports Jersey & Gym Wear Bangladesh | Sportswear BD | Rafsan Clothing",
  description:
    "Sports Jersey Bangladesh, Gym Wear BD, Sports T-Shirt, Athleisure — Export Quality Sportswear। কম দামে স্পোর্টস পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery। Rafsan Clothing — therafsan.com",
  keywords: [
    "sports jersey bangladesh",
    "gym wear bangladesh",
    "sports tshirt bd",
    "sportswear bangladesh",
    "athleisure bangladesh",
    "performance clothing bangladesh",
    "খেলাধুলার পোশাক বাংলাদেশ",
    "export quality tshirt bd",
    "streetwear bangladesh",
    "buy tshirt online bangladesh",
    "free delivery clothing bd",
    "cash on delivery tshirt bd",
    "rafsan clothing",
    "bd brand",
    "wholesale tshirt bangladesh",
    "bulk order tshirt bd",
    "unisex tshirt bd",
    "cotton tshirt bd",
  ],
  openGraph: {
    title:
      "Sports Jersey & Gym Wear Bangladesh | Rafsan Clothing",
    description:
      "Sports Jersey, Gym Wear BD, Athleisure — Export Quality Sportswear, কম দামে পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+।",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sports & Gym Wear — Rafsan Clothing Bangladesh",
      },
    ],
    type: "website",
    url: `${SITE_URL}/category/sports`,
    siteName: "Rafsan Clothing",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sports Jersey & Gym Wear Bangladesh | Rafsan Clothing",
    description:
      "Sports Jersey, Gym Wear — Export Quality, ফ্রি ডেলিভারি ৳৯৯৯+।",
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
          { name: "Sports Collection", url: `${SITE_URL}/category/sports` },
        ]}
      />
      <AggregateOfferSchema products={products} categoryName="Sports & Gym Wear" />

      <div className="min-h-screen bg-white pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Sports Collection — Gym Wear & Jersey BD
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Sports Jersey · Gym Wear Bangladesh · Athleisure · Streetwear
              — Export Quality, ফ্রি ডেলিভারি ৳৯৯৯+
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

          <section className="mt-12 pt-8 border-t border-gray-100 max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Sports Jersey & Gym Wear Bangladesh — Rafsan Clothing
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Rafsan Clothing-এ পাবেন Bangladesh-এর সেরা Sports Jersey, Gym Wear, Athleisure Wear।
              Export Quality Performance Fabric — Wholesale T-Shirt Bangladesh ও Bulk Order-এও পাওয়া যায়।
              Streetwear Bangladesh collection-এ রয়েছে Unisex Design।
              কম দামে স্পোর্টস পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery।
            </p>
          </section>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
