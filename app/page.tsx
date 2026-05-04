import HeroSlider from "@/components/HeroSlider";
import CategorySection from "@/components/CategorySection";
import BottomNav from "@/components/BottomNav";
import { fetchActiveProductsRange } from "@/lib/products";
import HomeProductGrid from "@/components/HomeProductGrid";

const HOME_PAGE_SIZE = 12;

export default async function Home() {
  const batch = await fetchActiveProductsRange(0, HOME_PAGE_SIZE + 1);
  const hasMore = batch.length > HOME_PAGE_SIZE;
  const initialProducts = hasMore ? batch.slice(0, HOME_PAGE_SIZE) : batch;

  return (
    <>
      <HeroSlider />
      <div className="mb-1 md:mb-3">
        <CategorySection />
      </div>
      <div className="pt-1 pb-20 md:pb-6">
        {initialProducts.length === 0 ? (
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
          <HomeProductGrid initialProducts={initialProducts} initialHasMore={hasMore} />
        )}
      </div>
      <BottomNav />
    </>
  );
}
