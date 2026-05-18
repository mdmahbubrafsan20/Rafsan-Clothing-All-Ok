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
    "বাচ্চাদের টি শার্ট | Kids Clothing Bangladesh | Rafsan Clothing",
  description:
    "বাচ্চাদের টি শার্ট ও পোশাক কিনুন সেরা দামে। Kids T-Shirt Bangladesh, Children Clothing BD — Export Quality, কম দামে বাচ্চাদের পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery। Rafsan Clothing — therafsan.com",
  keywords: [
    "বাচ্চাদের টি শার্ট",
    "kids clothing bangladesh",
    "children tshirt bd",
    "buy kids clothes online bangladesh",
    "kids tshirt bangladesh",
    "baby clothing bd",
    "export quality kids clothing",
    "কম দামে বাচ্চাদের পোশাক",
    "টি শার্ট দাম বাংলাদেশ",
    "free delivery clothing bd",
    "cash on delivery tshirt bd",
    "rafsan clothing",
    "bd brand",
    "bangladeshi brand",
    "printed tshirt bd",
    "cotton tshirt bd",
    "eid collection 2025 bangladesh",
  ],
  openGraph: {
    title:
      "বাচ্চাদের টি শার্ট | Kids T-Shirt & Clothing Bangladesh | Rafsan Clothing",
    description:
      "বাচ্চাদের টি শার্ট, Kids Clothing BD — Export Quality, কম দামে পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+।",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kids Clothing — Rafsan Clothing Bangladesh",
      },
    ],
    type: "website",
    url: `${SITE_URL}/category/kids`,
    siteName: "Rafsan Clothing",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "বাচ্চাদের টি শার্ট | Kids Clothing Bangladesh",
    description:
      "বাচ্চাদের টি শার্ট — Export Quality, কম দামে পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+।",
    images: ["/og-image.png"],
  },
  alternates: { canonical: `${SITE_URL}/category/kids` },
};

export default async function KidsCategoryPage() {
  const products = await getProductsByCategory("kids");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "বাচ্চাদের কালেকশন", url: `${SITE_URL}/category/kids` },
        ]}
      />
      <AggregateOfferSchema products={products} categoryName="Kids Clothing" />

      <div className="min-h-screen bg-white pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              বাচ্চাদের কালেকশন — Kids Clothing BD
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              বাচ্চাদের টি শার্ট · Kids T-Shirt · Printed T-Shirt
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

          <section className="mt-12 pt-8 border-t border-gray-100 max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              বাচ্চাদের টি শার্ট সেরা দামে — Rafsan Clothing
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Rafsan Clothing (therafsan.com)-এ বাচ্চাদের জন্য রয়েছে সেরা মানের পোশাক।
              Export Quality Kids T-Shirt, Printed T-Shirt, Cotton T-Shirt —
              কম দামে বাচ্চাদের পোশাক পাওয়ার সেরা জায়গা।
              ঈদ কালেকশন ২০২৫-এও বাচ্চাদের জন্য রয়েছে বিশেষ সংগ্রহ।
              Cash on Delivery ও ফ্রি ডেলিভারি ৳৯৯৯+ সুবিধা উপলব্ধ।
            </p>
          </section>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
