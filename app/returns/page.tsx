import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

export const metadata: Metadata = {
  title: "Return & Exchange Policy | Rafsan Clothing",
  description:
    "Understand Rafsan Clothing's easy return and exchange policy. 7-day return guarantee, free exchanges for defective products. Hassle-free shopping in Bangladesh.",
  alternates: { canonical: `${SITE_URL}/returns` },
  openGraph: {
    title: "Return & Exchange Policy | Rafsan Clothing",
    description:
      "7-day easy return & exchange policy at Rafsan Clothing. Hassle-free shopping experience in Bangladesh.",
    url: `${SITE_URL}/returns`,
    siteName: "Rafsan Clothing",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Return & Exchange Policy | Rafsan Clothing",
    description: "7-day easy return & exchange policy. Hassle-free shopping in Bangladesh.",
  },
};

const steps = [
  { step: "০১", title: "যোগাযোগ করুন", desc: "পণ্য পাওয়ার ৭ দিনের মধ্যে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন এবং রিটার্নের কারণ জানান।" },
  { step: "০২", title: "প্যাকেজিং করুন", desc: "পণ্যটি অরিজিনাল প্যাকেজিং ও ট্যাগসহ সুরক্ষিতভাবে প্যাক করুন।" },
  { step: "০৩", title: "পাঠিয়ে দিন", desc: "আমাদের দেওয়া ঠিকানায় পণ্যটি কুরিয়ারে পাঠান এবং ট্র্যাকিং নম্বর আমাদের জানান।" },
  { step: "০৪", title: "রিফান্ড / এক্সচেঞ্জ", desc: "পণ্য পাওয়ার পর যাচাই করে ৩–৫ কার্যদিবসের মধ্যে রিফান্ড বা নতুন পণ্য পাঠানো হবে।" },
];

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Return & Exchange Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Return & Exchange Policy</h1>
      <div className="w-12 h-1 bg-black mb-8"></div>

      <div className="space-y-8 text-gray-600 leading-relaxed text-sm">
        <section>
          <p className="text-base">
            আমরা চাই আপনি আমাদের প্রতিটি পণ্যে সন্তুষ্ট থাকুন। কোনো কারণে পণ্য পছন্দ না হলে বা সমস্যা
            হলে আমাদের সহজ রিটার্ন ও এক্সচেঞ্জ পলিসি অনুযায়ী সমাধান পাবেন।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">রিটার্নের শর্তাবলী</h2>
          <div className="space-y-3">
            {[
              "পণ্য পাওয়ার ৭ দিনের মধ্যে রিটার্ন করতে হবে",
              "পণ্য অবশ্যই অব্যবহৃত ও অরিজিনাল ট্যাগসহ থাকতে হবে",
              "অরিজিনাল প্যাকেজিংয়ে ফেরত পাঠাতে হবে",
              "সেল বা ডিসকাউন্টে কেনা পণ্য রিটার্নযোগ্য নয়",
              "ব্যবহৃত, ধোয়া বা ক্ষতিগ্রস্ত পণ্য রিটার্ন গ্রহণযোগ্য নয়",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5 text-base">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">রিটার্ন প্রক্রিয়া</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((s) => (
              <div key={s.step} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-2xl font-bold text-gray-200 mb-1">{s.step}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">রিফান্ড পদ্ধতি</h2>
          <p>
            রিফান্ড আপনার মূল পেমেন্ট পদ্ধতিতে (bKash, Nagad, Rocket বা কার্ড) ফেরত দেওয়া হবে। ব্যাংক
            ট্রান্সফারের ক্ষেত্রে ৩–৭ কার্যদিবস সময় লাগতে পারে।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">ত্রুটিপূর্ণ বা ভুল পণ্য</h2>
          <p>
            আমাদের ভুলে ত্রুটিপূর্ণ বা ভুল পণ্য পাঠানো হলে সম্পূর্ণ বিনামূল্যে রিটার্ন বা এক্সচেঞ্জ করা হবে।
            এক্ষেত্রে রিটার্ন শিপিং চার্জও আমরা বহন করব।
          </p>
        </section>

        <div className="bg-zinc-900 text-white rounded-2xl p-6 text-center">
          <p className="font-semibold text-lg mb-1">রিটার্ন করতে চান?</p>
          <p className="text-zinc-400 text-sm mb-4">আমাদের কাস্টমার সার্ভিস টিম আপনাকে সাহায্য করতে প্রস্তুত।</p>
          <p className="text-zinc-300 text-sm">রবিবার – বৃহস্পতিবার | সকাল ১০টা – রাত ৮টা</p>
        </div>
      </div>
    </div>
  );
}
