import Link from "next/link";
import { productsCategoryHref } from "@/lib/category-nav";

/**
 * Homepage promo blocks (original layout): two image banners + Custom Apparel strip.
 * Banners link to `/products?category=…` for filtering. No pill category row here.
 */
export default function CategorySection() {
  return (
    <section className="px-3 py-4 md:py-8">
      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        <Link
          href={productsCategoryHref("Women")}
          className="relative block w-full h-[190px] md:h-[260px] rounded-xl overflow-hidden group order-1"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <h3 className="text-[22px] font-bold mb-1">Women&apos;s New Arrivals</h3>
            <p className="text-sm opacity-90">Elegant styles for everyday comfort</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Link>

        <Link
          href={productsCategoryHref("Accessories")}
          className="relative block w-full h-[190px] md:h-[260px] rounded-xl overflow-hidden group order-2"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <h3 className="text-[22px] font-bold mb-1">Accessories Collection</h3>
            <p className="text-sm opacity-90">Belts, caps and lifestyle picks</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Link>

        <div className="bg-cyan-100 rounded-xl p-4 text-center order-3 md:order-2 md:col-span-2 max-md:text-left">
          <h3 className="text-base md:text-xl font-bold text-gray-900">Custom Apparel</h3>
          <p className="text-gray-700 mt-1 text-sm md:text-lg">
            We provide plain t-shirts and apparel for all your custom branding needs
          </p>
        </div>
      </div>
    </section>
  );
}
