import HeroSlider from "@/components/HeroSlider";
import CategorySection from "@/components/CategorySection";
import BottomNav from "@/components/BottomNav";
import { fetchProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default async function Home() {
  const products = await fetchProducts();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <HeroSlider />
      <div className="mb-2 md:mb-3">
        <CategorySection />
      </div>
      <main className="pt-2 pb-6 px-4 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-zinc-400">
              <p className="text-lg">No products found.</p>
              <p className="mt-2">
                Make sure you have set up your Supabase environment variables and have products in your database.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
