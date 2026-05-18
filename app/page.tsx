import type { Metadata } from "next";
import HeroSlider from "@/components/HeroSlider";
import CategorySection from "@/components/CategorySection";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/products";
import { getActiveBanners } from "@/lib/banners";
import { STORE_PRODUCT_GRID_CLASS } from "@/lib/product-grid";
import { OrganizationSchema } from "@/app/schema";

// ISR: revalidate every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title:
    "Rafsan Clothing | Oversized T-Shirt, Drop Shoulder, Polo Shirt Bangladesh | কম দামে গেঞ্জি",
  description:
    "Rafsan Clothing — বাংলাদেশের সেরা BD Brand therafsan.com। Oversized tshirt, Drop shoulder tshirt bd, Polo shirt, Graphic tshirt, Couple tshirt, কাস্টমাইজ টি-শার্ট। কম দামে গেঞ্জি, Export quality, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery। WhatsApp: 01610-735064",
  keywords: [
    "oversized tshirt bangladesh",
    "drop shoulder tshirt bd",
    "buy tshirt online bangladesh",
    "polo shirt bd",
    "graphic tshirt bangladesh",
    "export quality tshirt bd",
    "কাপল টি শার্ট বাংলাদেশ",
    "টি শার্ট দাম বাংলাদেশ",
    "কম দামে গেঞ্জি",
    "কম দামে টি শার্ট",
    "কাস্টমাইজ টি-শার্ট",
    "free delivery clothing bd",
    "cash on delivery tshirt bd",
    "ফ্রি ডেলিভারি পোশাক",
    "rafsan clothing",
    "therafsan",
    "the rafsan",
    "bd brand",
    "bangladeshi brand",
    "streetwear bangladesh",
    "unisex tshirt bd",
    "eid collection 2025 bangladesh",
    "online shopping bd tshirt",
    "টি শার্ট বাংলাদেশ",
    "পোশাক অনলাইন",
    "অনলাইনে কাপড় কেনা",
    "wholesale tshirt bangladesh",
    "bulk order tshirt bd",
    "black tshirt bangladesh",
    "printed tshirt bd",
    "cotton tshirt bd",
  ],
  openGraph: {
    title:
      "Rafsan Clothing | Oversized, Drop Shoulder, Polo T-Shirt Bangladesh — therafsan.com",
    description:
      "বাংলাদেশের সেরা BD Brand — Oversized, Drop Shoulder, Couple, Graphic tshirt। কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery।",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rafsan Clothing — Best T-Shirt Brand Bangladesh | therafsan.com",
      },
    ],
    type: "website",
    url: "https://therafsan.com",
    siteName: "Rafsan Clothing",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rafsan Clothing | Best T-Shirt Brand Bangladesh",
    description:
      "Oversized, Drop Shoulder, Polo, Graphic tshirt bd — কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+। WhatsApp: 01610-735064",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://therafsan.com" },
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

      {/* SEO Content Section — visible text helps Google rank */}
      <section className="px-4 py-10 md:px-0 md:py-12 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-zinc-800 mb-4">
          বাংলাদেশের সেরা T-Shirt Brand — Rafsan Clothing
        </h2>
        <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-4">
          <strong>Rafsan Clothing (therafsan.com)</strong> — বাংলাদেশের একটি বিশ্বস্ত Bangladeshi Brand।
          আমরা Oversized T-Shirt, Drop Shoulder T-Shirt, Polo Shirt, Graphic T-Shirt, Couple T-Shirt,
          Unisex T-Shirt এবং কাস্টমাইজ টি-শার্ট অফার করি। সম্পূর্ণ Export Quality পোশাক — কম দামে গেঞ্জি,
          সর্বোচ্চ মান নিশ্চিত।
        </p>
        <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-4">
          Black T-Shirt, White T-Shirt, Printed T-Shirt, Cotton T-Shirt, Streetwear Bangladesh —
          সব ধরনের পোশাক পাবেন এখানে। Wholesale T-Shirt Bangladesh ও Bulk Order এর জন্যও যোগাযোগ করুন।
          Gym Wear, Sports Jersey, Hoodie Bangladesh — সব কিছু এক জায়গায়।
        </p>
        <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-4">
          পুরুষের টি শার্ট, মেয়েদের পোশাক অনলাইন, বাচ্চাদের টি শার্ট — পরিবারের সবার জন্য পোশাক।
          টি শার্ট দাম বাংলাদেশে সবচেয়ে কম। Eid Collection 2025 Bangladesh — এখনই দেখুন।
        </p>
        <p className="text-zinc-500 text-sm md:text-base">
          ফ্রি ডেলিভারি ৳৯৯৯+ · Cash on Delivery · bKash · Nagad · Rocket · ৭ দিনের Return গ্যারান্টি
        </p>
      </section>

      <BottomNav />
    </>
  );
}
