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
    "পুরুষের টি শার্ট | Oversized, Drop Shoulder, Polo Shirt BD | Rafsan Clothing",
  description:
    "পুরুষের টি শার্ট কিনুন সেরা দামে — Oversized T-Shirt, Drop Shoulder T-Shirt BD, Polo Shirt, Graphic T-Shirt, Streetwear Bangladesh। Export quality, কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery। Rafsan Clothing — therafsan.com",
  keywords: [
    "পুরুষের টি শার্ট",
    "ছেলেদের গেঞ্জি দাম",
    "oversized tshirt bangladesh",
    "drop shoulder tshirt bd",
    "polo shirt bd",
    "graphic tshirt bangladesh",
    "men clothing bangladesh",
    "mens tshirt bd",
    "streetwear bangladesh",
    "unisex tshirt bd",
    "black tshirt bangladesh",
    "white tshirt bangladesh",
    "cotton tshirt bd",
    "half sleeve tshirt bangladesh",
    "full sleeve tshirt bd",
    "buy tshirt online bangladesh",
    "premium mens fashion bd",
    "export quality tshirt bd",
    "কম দামে গেঞ্জি",
    "কম দামে টি শার্ট",
    "টি শার্ট দাম বাংলাদেশ",
    "rafsan clothing",
    "bd brand",
    "free delivery clothing bd",
    "cash on delivery tshirt bd",
  ],
  openGraph: {
    title:
      "পুরুষের টি শার্ট | Oversized, Drop Shoulder, Polo Shirt Bangladesh | Rafsan Clothing",
    description:
      "Oversized T-Shirt, Drop Shoulder T-Shirt BD, Polo Shirt — পুরুষের টি শার্ট কম দামে। Export quality, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery।",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Men's T-Shirt Collection — Rafsan Clothing Bangladesh",
      },
    ],
    type: "website",
    url: `${SITE_URL}/category/men`,
    siteName: "Rafsan Clothing",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "পুরুষের টি শার্ট | Oversized, Drop Shoulder Bangladesh",
    description:
      "Oversized, Drop Shoulder, Polo, Graphic T-Shirt — কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+।",
    images: ["/og-image.png"],
  },
  alternates: { canonical: `${SITE_URL}/category/men` },
};

export default async function MenCategoryPage() {
  const products = await getProductsByCategory("men");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "পুরুষের কালেকশন", url: `${SITE_URL}/category/men` },
        ]}
      />
      <AggregateOfferSchema products={products} categoryName="Men's T-Shirt" />

      <div className="min-h-screen bg-white pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              পুরুষের কালেকশন — Men's T-Shirt BD
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Oversized T-Shirt · Drop Shoulder T-Shirt · Polo Shirt · Graphic T-Shirt · Streetwear Bangladesh
              — কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+
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
              বাংলাদেশে সেরা দামে পুরুষের টি শার্ট — Rafsan Clothing
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Rafsan Clothing (therafsan.com) — বাংলাদেশের অন্যতম সেরা BD Brand।
              আমাদের Men's Collection-এ রয়েছে Oversized T-Shirt Bangladesh, Drop Shoulder T-Shirt BD,
              Polo Shirt BD, Graphic T-Shirt, Unisex T-Shirt, Black T-Shirt, White T-Shirt,
              Cotton T-Shirt, Half Sleeve ও Full Sleeve সব ধরনের পোশাক।
              Export Quality নিশ্চিত, কম দামে গেঞ্জি পাওয়ার সেরা জায়গা।
              Wholesale T-Shirt Bangladesh ও Bulk Order এর জন্য WhatsApp করুন।
            </p>
          </section>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
