import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

export const metadata: Metadata = {
  title: "About Us | Rafsan Clothing — Bangladesh Fashion Brand",
  description:
    "Learn about Rafsan Clothing — Bangladesh's premium fashion brand. Our story, mission, commitment to export-quality clothing, and dedication to Bangladeshi fashion innovation.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Rafsan Clothing — Bangladesh's Premium Fashion Brand",
    description:
      "Discover the story behind Rafsan Clothing. Export-quality Bangladeshi fashion, crafted with passion in Narayanganj.",
    url: `${SITE_URL}/about`,
    siteName: "Rafsan Clothing",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Rafsan Clothing — Bangladesh Fashion Brand",
    description:
      "Discover the story behind Rafsan Clothing. Export-quality Bangladeshi fashion, crafted with passion.",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">About Us</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">About Us</h1>
      <div className="w-12 h-1 bg-black mb-8"></div>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">আমাদের গল্প</h2>
          <p>
            Rafsan Clothing একটি বাংলাদেশি ফ্যাশন ব্র্যান্ড যা মানসম্পন্ন পোশাক সাশ্রয়ী মূল্যে
            সকলের কাছে পৌঁছে দেওয়ার লক্ষ্য নিয়ে যাত্রা শুরু করেছে। আমরা বিশ্বাস করি, ভালো
            পোশাক পরা মানুষের আত্মবিশ্বাস বাড়ায় — এবং সেই আত্মবিশ্বাস সবার জন্যই সমানভাবে
            প্রাপ্য।
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">আমাদের লক্ষ্য</h2>
          <p>
            আমাদের লক্ষ্য হলো প্রতিটি কাস্টমারকে সেরা মানের পোশাক সরবরাহ করা — পুরুষ, নারী
            এবং শিশু সবার জন্য। আমরা ব্যবহার করি উচ্চমানের কটন এবং টেকসই ফ্যাব্রিক, যা
            পরতে আরামদায়ক এবং দীর্ঘস্থায়ী।
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">কেন Rafsan Clothing?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              { icon: "✅", title: "উন্নত মান", desc: "১০০% কটন এবং প্রিমিয়াম ফ্যাব্রিক ব্যবহার করা হয়" },
              { icon: "🚚", title: "দ্রুত ডেলিভারি", desc: "সারা বাংলাদেশে নির্ভরযোগ্য ডেলিভারি সেবা" },
              { icon: "💰", title: "সাশ্রয়ী মূল্য", desc: "সেরা মানের পোশাক সর্বোচ্চ সাশ্রয়ী মূল্যে" },
              { icon: "🔄", title: "সহজ রিটার্ন", desc: "ঝামেলামুক্ত রিটার্ন ও এক্সচেঞ্জ পলিসি" },
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
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Custom Apparel সেবা</h2>
          <p>
            আমরা ব্যক্তিগত ও কর্পোরেট কাস্টম ব্র্যান্ডিং এর জন্য প্লেইন টি-শার্ট এবং অ্যাপারেল
            সরবরাহ করি। আপনার ব্র্যান্ডের লোগো বা ডিজাইন প্রিন্ট করার জন্য আমাদের সাথে যোগাযোগ
            করুন।
          </p>
        </section>

        <section className="border-t border-gray-100 pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">যোগাযোগ করুন</h2>
          <p>
            যেকোনো প্রশ্ন বা সহায়তার জন্য আমাদের কাস্টমার সার্ভিস টিম সবসময় প্রস্তুত।
            রবিবার থেকে বৃহস্পতিবার সকাল ১০টা থেকে রাত ৮টার মধ্যে আমাদের সাথে যোগাযোগ করুন।
          </p>
        </section>
      </div>

      <div className="mt-10">
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800"
        >
          আমাদের কালেকশন দেখুন
        </Link>
      </div>
    </div>
  );
}
