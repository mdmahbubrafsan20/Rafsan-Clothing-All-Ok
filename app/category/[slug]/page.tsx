import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory } from "@/lib/products";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";

interface PageProps {
  params: Promise<{ slug: string }>;
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
      <div className="min-h-screen bg-white max-md:bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Browse products in this category
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
