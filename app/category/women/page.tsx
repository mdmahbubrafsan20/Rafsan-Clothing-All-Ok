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
    "মেয়েদের পোশাক অনলাইন | Women's T-Shirt & Clothing Bangladesh | Rafsan Clothing",
  description:
    "মেয়েদের পোশাক অনলাইনে কিনুন — মেয়েদের টি শার্ট, Oversized T-Shirt, Couple T-Shirt, Graphic T-Shirt Bangladesh। Export quality, কম দামে পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery। Rafsan Clothing — therafsan.com",
  keywords: [
    "মেয়েদের পোশাক অনলাইন",
    "মেয়েদের টি শার্ট",
    "women clothing bangladesh",
    "womens tshirt bangladesh",
    "oversized tshirt bangladesh",
    "কাপল টি শার্ট বাংলাদেশ",
    "couple matching tshirt bd",
    "graphic tshirt bangladesh",
    "unisex tshirt bd",
    "ladies clothing bd",
    "buy womens clothes online bangladesh",
    "export quality tshirt bd",
    "streetwear bangladesh",
    "কম দামে পোশাক",
    "টি শার্ট দাম বাংলাদেশ",
    "free delivery clothing bd",
    "cash on delivery tshirt bd",
    "ফ্রি ডেলিভারি পোশাক",
    "অনলাইনে কাপড় কেনা",
    "rafsan clothing",
    "bd brand",
    "bangladeshi brand",
  ],
  openGraph: {
    title:
      "মেয়েদের পোশাক অনলাইন | Women's T-Shirt, Couple Tshirt Bangladesh | Rafsan Clothing",
    description:
      "মেয়েদের টি শার্ট, Couple T-Shirt, Oversized T-Shirt — কম দামে পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery।",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Women's Clothing Collection — Rafsan Clothing Bangladesh",
      },
    ],
    type: "website",
    url: `${SITE_URL}/category/women`,
    siteName: "Rafsan Clothing",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "মেয়েদের পোশাক | Women's T-Shirt & Clothing Bangladesh",
    description:
      "মেয়েদের টি শার্ট, Couple Tshirt — কম দামে পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+।",
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
          { name: "মেয়েদের কালেকশন", url: `${SITE_URL}/category/women` },
        ]}
      />
      <AggregateOfferSchema products={products} categoryName="Women's Clothing" />

      <div className="min-h-screen bg-white pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              মেয়েদের কালেকশন — Women's Clothing BD
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              মেয়েদের টি শার্ট · Couple T-Shirt · Oversized T-Shirt · Graphic T-Shirt
              — কম দামে পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+
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

          {/* SEO text block */}
          <section className="mt-12 pt-8 border-t border-gray-100 max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              মেয়েদের পোশাক অনলাইনে সেরা দামে — Rafsan Clothing
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Rafsan Clothing-এ পাবেন মেয়েদের সেরা পোশাক সংগ্রহ।
              কাপল টি শার্ট বাংলাদেশ, Oversized T-Shirt, Graphic T-Shirt, Unisex T-Shirt —
              সব Export Quality। অনলাইনে কাপড় কেনার সবচেয়ে ভরসার জায়গা therafsan.com।
              ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery, ৭ দিনের Return গ্যারান্টি।
            </p>
          </section>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
