import Link from "next/link";
import type { Metadata } from "next";
import { BreadcrumbSchema, LocalBusinessSchema } from "@/app/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

export const metadata: Metadata = {
  title:
    "আমাদের সম্পর্কে | Rafsan Clothing — BD Brand Bangladesh | therafsan.com",
  description:
    "Rafsan Clothing (therafsan.com) সম্পর্কে জানুন — বাংলাদেশের সেরা BD Brand। Oversized T-Shirt, Drop Shoulder, Polo Shirt, কাস্টমাইজ টি-শার্ট, Wholesale T-Shirt Bangladesh। Narayanganj-ভিত্তিক Export Quality Bangladeshi Brand।",
  keywords: [
    "rafsan clothing",
    "therafsan",
    "the rafsan",
    "bd brand",
    "bangladeshi brand",
    "rafsan clothing bangladesh",
    "narayanganj clothing brand",
    "export quality tshirt bd",
    "কাস্টমাইজ টি-শার্ট",
    "wholesale tshirt bangladesh",
    "bulk order tshirt bd",
    "best clothing brand bd",
    "original tshirt bd",
    "oversized tshirt bangladesh",
    "drop shoulder tshirt bd",
    "polo shirt bd",
    "streetwear bangladesh",
    "about rafsan clothing",
  ],
  openGraph: {
    title: "আমাদের সম্পর্কে | Rafsan Clothing — BD Brand Bangladesh",
    description:
      "Rafsan Clothing — বাংলাদেশের সেরা BD Brand। Narayanganj-ভিত্তিক Export Quality T-Shirt Brand। কাস্টমাইজ ও Wholesale অর্ডার সুবিধা।",
    url: `${SITE_URL}/about`,
    siteName: "Rafsan Clothing",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About Rafsan Clothing Bangladesh" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Rafsan Clothing — Bangladesh's Best BD Brand",
    description:
      "Narayanganj-based Export Quality T-Shirt Brand। Wholesale ও Customize অর্ডার সুবিধা।",
    images: ["/og-image.png"],
  },
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "আমাদের সম্পর্কে", url: `${SITE_URL}/about` },
        ]}
      />
      <LocalBusinessSchema />

      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <nav className="text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">আমাদের সম্পর্কে</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Rafsan Clothing — Bangladesh's Best BD Brand
        </h1>
        <div className="w-12 h-1 bg-black mb-8"></div>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">আমাদের গল্প</h2>
            <p>
              <strong>Rafsan Clothing (therafsan.com)</strong> একটি বিশ্বস্ত Bangladeshi Brand
              যা Export Quality পোশাক সাশ্রয়ী মূল্যে — কম দামে গেঞ্জি — সকলের কাছে পৌঁছে দেওয়ার
              লক্ষ্য নিয়ে কাজ করছে। Narayanganj থেকে পরিচালিত এই BD Brand বিশ্বাস করে,
              ভালো পোশাক পরা সবার অধিকার।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">আমাদের পণ্য সংগ্রহ</h2>
            <p>
              Rafsan Clothing-এ পাবেন Oversized T-Shirt Bangladesh, Drop Shoulder T-Shirt BD,
              Polo Shirt BD, Graphic T-Shirt, Couple T-Shirt, Unisex T-Shirt,
              Black T-Shirt, White T-Shirt, Printed T-Shirt, Cotton T-Shirt,
              Half Sleeve, Full Sleeve, Streetwear Bangladesh, Gym Wear, Sports Jersey,
              Hoodie Bangladesh — এক ছাদের নিচে সব ধরনের পোশাক।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">কেন Rafsan Clothing?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {[
                { icon: "✅", title: "Export Quality নিশ্চিত", desc: "১০০% Cotton ও প্রিমিয়াম ফ্যাব্রিক — Original T-Shirt BD" },
                { icon: "🚚", title: "ফ্রি ডেলিভারি ৳৯৯৯+", desc: "সারা বাংলাদেশে Cash on Delivery সুবিধা" },
                { icon: "💰", title: "কম দামে গেঞ্জি", desc: "টি শার্ট দাম বাংলাদেশে সবচেয়ে সাশ্রয়ী" },
                { icon: "🔄", title: "৭ দিনের Return", desc: "ঝামেলামুক্ত Return ও Exchange পলিসি" },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              কাস্টমাইজ টি-শার্ট ও Wholesale সেবা
            </h2>
            <p>
              Rafsan Clothing-এ রয়েছে <strong>কাস্টমাইজ টি-শার্ট</strong> সেবা — আপনার ব্র্যান্ড লোগো,
              ডিজাইন বা টেক্সট প্রিন্ট করুন। <strong>Wholesale T-Shirt Bangladesh</strong> ও{" "}
              <strong>Bulk Order T-Shirt BD</strong> — ব্যবসায়িক প্রতিষ্ঠান, স্কুল, কলেজ,
              কর্পোরেট ইভেন্টের জন্য বিশেষ ছাড়ে পোশাক পাওয়া যায়।
              Couple Matching T-Shirt BD-ও কাস্টমাইজ করা যায়।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Eid Collection 2025</h2>
            <p>
              <strong>Eid Collection 2025 Bangladesh</strong> — Rafsan Clothing এনেছে বিশেষ Eid সংগ্রহ।
              Polo Shirt, Oversized T-Shirt, Graphic T-Shirt, Couple T-Shirt — সব কিছুতে Eid Special Design।
              এখনই অর্ডার করুন, দ্রুত ডেলিভারি নিশ্চিত।
            </p>
          </section>

          <section className="border-t border-gray-100 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">যোগাযোগ করুন</h2>
            <p>
              যেকোনো প্রশ্ন, Wholesale Order বা Customize T-Shirt-এর জন্য
              WhatsApp করুন: <strong>01610-735064</strong>।
              রবিবার–বৃহস্পতিবার সকাল ১০টা–রাত ৮টা, শুক্রবার বিকাল ২টা–রাত ৮টা।
            </p>
            <p className="mt-3 text-sm text-gray-400">
              📍 Narayanganj, Dhaka Division, Bangladesh · 🌐 therafsan.com
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800"
          >
            সব পোশাক দেখুন →
          </Link>
        </div>
      </div>
    </>
  );
}
