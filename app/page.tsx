import HeroSlider from "@/components/HeroSlider";
import CategorySection from "@/components/CategorySection";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/products";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await fetchProducts({ activeOnly: true });

  return (
    <>
      <HeroSlider />
      <div className="mb-1 md:mb-3">
        <CategorySection />
      </div>
      <div className="pt-1 pb-20 md:pb-6">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">No products found.</p>
              <p className="mt-2">
                Add active products in Supabase, or check that{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">is_active</code> is true.
              </p>
            </div>
          </div>
        ) : (
          <div className="px-4 py-6 md:px-0 md:py-0">
            <div className={STORE_PRODUCT_GRID_CLASS}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
