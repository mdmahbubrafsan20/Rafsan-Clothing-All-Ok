import type { Metadata } from "next";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory } from "@/lib/products";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";
import { BreadcrumbSchema } from "@/app/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const title =
    decoded.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${title} — Shop Online Bangladesh | Rafsan Clothing`,
    description: `Buy premium ${title.toLowerCase()} from Rafsan Clothing. Export quality, affordable prices, free delivery ৳999+, 100% original guarantee. Order on WhatsApp: 01610-735064`,
    keywords: [
      `${title.toLowerCase()} bangladesh`,
      `buy ${title.toLowerCase()} online bd`,
      `${title.toLowerCase()} clothing bd`,
      "rafsan clothing",
      "premium fashion bangladesh",
      "export quality clothes bd",
    ],
    openGraph: {
      title: `${title} — Shop Online Bangladesh | Rafsan Clothing`,
      description: `Buy premium ${title.toLowerCase()} from Rafsan Clothing. Export quality, free delivery ৳999+.`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Rafsan Clothing Bangladesh`,
      description: `Premium ${title.toLowerCase()} — export quality, free delivery ৳999+.`,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `${SITE_URL}/category/${encodeURIComponent(slug)}`,
    },
  };
}

export default async function CategorySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  let products = await getProductsByCategory(decoded);
  if (products.length === 0 && decoded !== slug) {
    products = await getProductsByCategory(slug);
  }

  const title = decoded.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: title, url: `${SITE_URL}/category/${encodeURIComponent(slug)}` },
        ]}
      />
      <div className="min-h-screen bg-white max-md:bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Browse premium {title.toLowerCase()} — export quality, free delivery ৳999+
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-gray-200 bg-gray-50/80">
              <p className="text-gray-600 mb-4">No products in this category yet.</p>
              <Link href="/products" className="text-gray-900 font-medium underline">
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
