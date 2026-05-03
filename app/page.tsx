import HeroSlider from "@/components/HeroSlider";
import CategorySection from "@/components/CategorySection";
import BottomNav from "@/components/BottomNav";
import { fetchProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default async function Home() {
  const products = await fetchProducts();

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
                Make sure you have set up your Supabase environment variables and have products in your database.
              </p>
            </div>
          </div>
        ) : (
          <div className="px-4 py-6 md:px-0 md:py-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-3 lg:gap-4">
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
