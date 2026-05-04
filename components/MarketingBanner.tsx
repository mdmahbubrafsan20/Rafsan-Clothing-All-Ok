import Image from "next/image";
import Link from "next/link";

/**
 * Full-width promo strip above the footer — mobile-first, soft background, image + CTA.
 */
export default function MarketingBanner() {
  return (
    <section
      className="w-full border-y border-stone-200/80 bg-gradient-to-br from-[#f7f4f0] via-[#f3efe8] to-[#ebe6df] text-zinc-900"
      aria-labelledby="marketing-banner-heading"
    >
      <div className="max-w-screen-2xl mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:flex lg:items-center lg:gap-10 lg:py-12">
        <div className="max-w-xl lg:flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 mb-2">
            New season
          </p>
          <h2
            id="marketing-banner-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-tight"
          >
            Elevate your everyday look
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            Premium fabrics, tailored fits, and pieces designed to move with you — shop the latest
            drops before they are gone.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-900 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 active:scale-[0.98]"
          >
            Shop the collection
          </Link>
        </div>

        <div className="mt-8 lg:mt-0 lg:flex-1 lg:max-w-md xl:max-w-lg">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/60 shadow-inner ring-1 ring-stone-200/60">
            <Image
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 480px"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/25 to-transparent pointer-events-none" />
          </div>
          <p className="mt-2 text-center text-[11px] text-stone-500 sm:text-left">
            Placeholder image — swap for your campaign creative in this component.
          </p>
        </div>
      </div>
    </section>
  );
}
