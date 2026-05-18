import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "@/app/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

export const metadata: Metadata = {
  title:
    "Fashion Blog BD | Oversized T-Shirt, Drop Shoulder Style Guide | Rafsan Clothing",
  description:
    "Rafsan Clothing Fashion Blog — Oversized T-Shirt style tips, Drop Shoulder T-Shirt BD guide, Polo Shirt trend, কম দামে গেঞ্জি কেনার টিপস, Streetwear Bangladesh, Eid Collection 2025 Bangladesh। বাংলাদেশের সেরা ফ্যাশন ব্লগ।",
  keywords: [
    "fashion blog bangladesh",
    "oversized tshirt style guide",
    "drop shoulder tshirt bd",
    "polo shirt bd style tips",
    "graphic tshirt bangladesh",
    "streetwear bangladesh",
    "eid collection 2025 bangladesh",
    "কম দামে গেঞ্জি কেনার টিপস",
    "টি শার্ট দাম বাংলাদেশ",
    "bd brand fashion",
    "bangladeshi brand style",
    "rafsan clothing blog",
    "therafsan",
    "কাপল টি শার্ট বাংলাদেশ",
    "কাস্টমাইজ টি-শার্ট",
    "wholesale tshirt bangladesh tips",
    "ফ্যাশন ব্লগ বাংলাদেশ",
    "স্টাইল টিপস বাংলাদেশ",
  ],
  openGraph: {
    title:
      "Fashion Blog | Oversized T-Shirt Style, Drop Shoulder Guide BD | Rafsan Clothing",
    description:
      "Rafsan Clothing Blog — Style tips, trend guide, Eid Collection 2025, Streetwear Bangladesh, কম দামে গেঞ্জি কেনার পরামর্শ।",
    type: "website",
    url: `${SITE_URL}/blog`,
    siteName: "Rafsan Clothing",
    locale: "bn_BD",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rafsan Clothing Fashion Blog Bangladesh" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fashion Blog Bangladesh | Rafsan Clothing",
    description:
      "Style tips, trend updates, Eid Collection 2025 — বাংলাদেশের সেরা ফ্যাশন ব্লগ।",
    images: ["/og-image.png"],
  },
  alternates: { canonical: `${SITE_URL}/blog` },
};

const blogPosts = [
  {
    slug: "oversized-tshirt-style-guide-bangladesh",
    title: "Oversized T-Shirt Style Guide — Bangladesh 2025",
    excerpt:
      "Oversized T-Shirt Bangladesh-এ এখন সবচেয়ে জনপ্রিয় ট্রেন্ড। কীভাবে পরবেন, কী সাথে মেলাবেন — সম্পূর্ণ স্টাইল গাইড।",
    date: "Coming Soon",
    category: "Style Guide",
  },
  {
    slug: "drop-shoulder-tshirt-bd",
    title: "Drop Shoulder T-Shirt BD — কেন এত জনপ্রিয়?",
    excerpt:
      "Drop Shoulder T-Shirt BD তে Gen-Z ও Millennial সবার পছন্দ। Streetwear Bangladesh-এর এই ট্রেন্ড কেন এত চাহিদাময় — জানুন বিস্তারিত।",
    date: "Coming Soon",
    category: "Trend",
  },
  {
    slug: "couple-tshirt-bangladesh",
    title: "কাপল টি শার্ট বাংলাদেশ — Best Couple T-Shirt Ideas 2025",
    excerpt:
      "Couple Matching T-Shirt BD — ঈদ, বিশেষ দিন বা প্রতিদিনের জন্য সেরা Couple T-Shirt design ideas। কাস্টমাইজ অপশনও আছে!",
    date: "Coming Soon",
    category: "Couple",
  },
  {
    slug: "eid-collection-2025-bangladesh",
    title: "Eid Collection 2025 Bangladesh — Rafsan Clothing",
    excerpt:
      "Eid Collection 2025 Bangladesh নিয়ে Rafsan Clothing আনছে বিশেষ সংগ্রহ। Polo Shirt, Graphic T-Shirt, Oversized সব কিছু এক জায়গায়।",
    date: "Coming Soon",
    category: "Eid Special",
  },
  {
    slug: "kom-dame-genji-kena-tips",
    title: "কম দামে গেঞ্জি কেনার সেরা উপায় — Bangladesh 2025",
    excerpt:
      "টি শার্ট দাম বাংলাদেশে কীভাবে সবচেয়ে কম রাখবেন? Export Quality নিশ্চিত রেখে কম দামে টি শার্ট কেনার সম্পূর্ণ গাইড।",
    date: "Coming Soon",
    category: "Buying Guide",
  },
  {
    slug: "wholesale-tshirt-bangladesh",
    title: "Wholesale T-Shirt Bangladesh — Bulk Order Guide",
    excerpt:
      "Wholesale T-Shirt Bangladesh ও Bulk Order T-Shirt BD — ব্যবসার জন্য বা দলের জন্য পোশাক কীভাবে অর্ডার করবেন সম্পূর্ণ তথ্য।",
    date: "Coming Soon",
    category: "Business",
  },
];

export default function BlogPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Blog</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Rafsan Clothing Fashion Blog
        </h1>
        <p className="text-gray-500 mb-10 max-w-2xl">
          Oversized T-Shirt, Drop Shoulder, Polo Shirt, Streetwear Bangladesh স্টাইল গাইড।
          কম দামে গেঞ্জি কেনার টিপস, Eid Collection 2025, Couple T-Shirt ideas —
          বাংলাদেশের সেরা ফ্যাশন ব্লগ।
        </p>

        <div className="grid gap-8 sm:grid-cols-2">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>

        {/* SEO Keywords Section */}
        <section className="mt-16 pt-8 border-t border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            বাংলাদেশের সেরা T-Shirt ট্রেন্ড ২০২৫
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            Rafsan Clothing (therafsan.com) বাংলাদেশের একটি বিশ্বস্ত BD Brand।
            Oversized T-Shirt Bangladesh, Drop Shoulder T-Shirt BD, Polo Shirt BD,
            Graphic T-Shirt, Couple T-Shirt, Unisex T-Shirt, Streetwear Bangladesh —
            সব trending style আমাদের কাছে পাবেন।
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            কম দামে গেঞ্জি কিনতে চান? Wholesale T-Shirt Bangladesh বা Bulk Order BD-এর
            জন্য WhatsApp করুন। Eid Collection 2025 Bangladesh — এখনই অর্ডার করুন।
            ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery, ৭ দিনের Return গ্যারান্টি।
          </p>
        </section>

        {/* CTA */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Shop Our Latest Collection
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            নতুন Oversized, Drop Shoulder, Polo, Graphic T-Shirt দেখুন।
            কম দামে গেঞ্জি, Export Quality নিশ্চিত।
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            সব পোশাক দেখুন →
          </Link>
        </div>
      </div>
    </>
  );
}
