import type { Metadata } from "next";
import HeroSlider from "@/components/HeroSlider";
import CategorySection from "@/components/CategorySection";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/products";
import { getActiveBanners } from "@/lib/banners";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";
import { OrganizationSchema } from "@/app/schema";

// ISR: revalidate every 60 seconds — dramatically faster for returning visitors
export const revalidate = 60;

export const metadata: Metadata = {
  title:
    "Rafsan Clothing | Premium Export Quality Fashion Bangladesh | রাফসান ক্লোথিং",
  description:
    "বাংলাদেশের সেরা প্রিমিয়াম ফ্যাশন ব্র্যান্ড Rafsan Clothing। Export Quality পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+, ক্যাশ অন ডেলিভারি। WhatsApp: 01610-735064",
  keywords: [
    "bd clothing",
    "bangladeshi fashion",
    "bd brand",
    "bd tshirt",
    "drop shoulder tshirt bd",
    "oversized tshirt bangladesh",
    "men clothing bd",
    "women clothing bangladesh",
    "premium tshirt bangladesh",
    "rafsan clothing bangladesh",
    "export quality clothes bangladesh",
    "online clothing store bd",
    "টি শার্ট বাংলাদেশ",
    "পোশাক অনলাইন",
  ],
  openGraph: {
    title:
      "Rafsan Clothing | Premium Export Quality Fashion Bangladesh",
    description:
      "বাংলাদেশের সেরা প্রিমিয়াম ফ্যাশন ব্র্যান্ড। Export Quality পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+।",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rafsan Clothing - Premium Fashion Bangladesh",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rafsan Clothing | Premium Fashion Bangladesh",
    description:
      "Export Quality পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+। WhatsApp: 01610-735064",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "/" },
};

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
      <OrganizationSchema />
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
      {/* SEO Content Section */}
      <section className="px-4 py-10 md:px-0 md:py-12 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-zinc-800 mb-4">
          বাংলাদেশের সেরা প্রিমিয়াম ফ্যাশন ব্র্যান্ড
        </h2>
        <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-4">
          Rafsan Clothing বাংলাদেশের একটি বিশ্বস্ত Export Quality পোশাকের ব্র্যান্ড। আমরা পুরুষ, মহিলা এবং শিশুদের জন্য প্রিমিয়াম মানের টি-শার্ট, ড্রপ শোল্ডার, ওভারসাইজড এবং স্পোর্টসওয়্যার সংগ্রহ অফার করি।
        </p>
        <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-4">
          নারায়ণগঞ্জ থেকে পরিচালিত আমাদের স্টোরে রয়েছে ১০০% অরিজিনাল ও উচ্চমানের পোশাক। ৳৯৯৯-এর উপরে অর্ডারে ফ্রি ডেলিভারি এবং ৭ দিনের মধ্যে সহজ Return &amp; Exchange সুবিধা।
        </p>
        <p className="text-zinc-500 text-sm md:text-base">
          Cash on Delivery · bKash · Nagad · Rocket — সকল পেমেন্ট পদ্ধতি গ্রহণযোগ্য।
        </p>
      </section>

      <BottomNav />
    </>
  );
}
