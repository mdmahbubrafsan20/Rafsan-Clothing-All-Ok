import HeroSlider from "@/components/HeroSlider";
import CategorySection from "@/components/CategorySection";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/products";
import { getActiveBanners } from "@/lib/banners";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";

// ISR: revalidate every 60 seconds — dramatically faster for returning visitors
export const revalidate = 60;

export default async function Home() {
  const [products, banners] = await Promise.all([
    fetchProducts({ activeOnly: true }),
    getActiveBanners(),
  ]);

  const sliderBanners = banners.filter(
    (b) => (b.placement || "homepage_slider") === "homepage_slider"
  );

  return (
    <>
      <HeroSlider banners={sliderBanners} />
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
