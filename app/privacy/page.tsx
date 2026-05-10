import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Rafsan Clothing",
  description: "Learn how Rafsan Clothing collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <div className="w-12 h-1 bg-black mb-4"></div>
      <p className="text-sm text-gray-400 mb-8">সর্বশেষ আপডেট: জানুয়ারি ২০২৫</p>

      <div className="space-y-8 text-gray-600 leading-relaxed text-sm">
        <section>
          <p className="text-base">
            Rafsan Clothing আপনার ব্যক্তিগত তথ্যের গোপনীয়তাকে অত্যন্ত গুরুত্ব দেয়। এই পলিসিতে আমরা
            কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি তা বিস্তারিত বলা হয়েছে।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">১. আমরা কোন তথ্য সংগ্রহ করি</h2>
          <div className="space-y-2">
            {[
              { label: "ব্যক্তিগত তথ্য", value: "নাম, ইমেইল, ফোন নম্বর, ডেলিভারি ঠিকানা" },
              { label: "পেমেন্ট তথ্য", value: "পেমেন্ট পদ্ধতি (সম্পূর্ণ কার্ড নম্বর সংরক্ষণ করা হয় না)" },
              { label: "ব্রাউজিং তথ্য", value: "IP ঠিকানা, ব্রাউজার ধরন, পেইজ ভিজিট" },
              { label: "অর্ডার তথ্য", value: "কেনা পণ্য, অর্ডার ইতিহাস" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 py-2 border-b border-gray-50">
                <span className="font-medium text-gray-900 min-w-[130px]">{item.label}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">২. তথ্য ব্যবহারের উদ্দেশ্য</h2>
          <ul className="space-y-2">
            {[
              "অর্ডার প্রক্রিয়া ও ডেলিভারি সম্পন্ন করতে",
              "কাস্টমার সার্ভিস প্রদান করতে",
              "নতুন পণ্য ও অফার সম্পর্কে জানাতে (আপনার সম্মতিতে)",
              "ওয়েবসাইটের অভিজ্ঞতা উন্নত করতে",
              "প্রতারণা প্রতিরোধ ও নিরাপত্তা নিশ্চিত করতে",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-black mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">৩. তথ্য শেয়ার করা</h2>
          <p>
            আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি করি না। শুধুমাত্র নিচের ক্ষেত্রে
            তথ্য শেয়ার করা হতে পারে:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              "ডেলিভারি পার্টনার (শুধু নাম ও ঠিকানা)",
              "পেমেন্ট গেটওয়ে (নিরাপদ লেনদেনের জন্য)",
              "আইনি প্রয়োজনে কর্তৃপক্ষের অনুরোধে",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-black mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">৪. তথ্য সুরক্ষা</h2>
          <p>
            আপনার তথ্য সুরক্ষায় আমরা SSL এনক্রিপশন এবং নিরাপদ সার্ভার ব্যবহার করি। পেমেন্ট তথ্য
            সরাসরি আমাদের সার্ভারে সংরক্ষিত হয় না — এটি সম্পূর্ণ এনক্রিপ্টেড গেটওয়ের মাধ্যমে
            প্রক্রিয়া করা হয়।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">৫. কুকিজ</h2>
          <p>
            আমরা ওয়েবসাইটের কার্যকারিতা ও অভিজ্ঞতা উন্নত করতে কুকিজ ব্যবহার করি। আপনি চাইলে
            ব্রাউজার সেটিংস থেকে কুকিজ বন্ধ করতে পারেন, তবে এতে কিছু ফিচার কাজ নাও করতে পারে।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">৬. আপনার অধিকার</h2>
          <p>আপনার নিচের অধিকারগুলো রয়েছে:</p>
          <ul className="mt-3 space-y-2">
            {[
              "আপনার সংরক্ষিত তথ্য দেখার অধিকার",
              "তথ্য সংশোধন করার অধিকার",
              "তথ্য মুছে ফেলার অনুরোধ করার অধিকার",
              "মার্কেটিং ইমেইল থেকে আনসাবস্ক্রাইব করার অধিকার",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-black mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-2">প্রশ্ন আছে?</h2>
          <p className="text-gray-500">
            এই প্রাইভেসি পলিসি সম্পর্কে যেকোনো প্রশ্নের জন্য আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন।
            রবিবার–বৃহস্পতিবার, সকাল ১০টা – রাত ৮টা।
          </p>
        </section>
      </div>
    </div>
  );
}
