import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Rafsan Clothing",
  description: "Read the terms and conditions for using Rafsan Clothing website and services.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Terms & Conditions</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
      <div className="w-12 h-1 bg-black mb-4"></div>
      <p className="text-sm text-gray-400 mb-8">সর্বশেষ আপডেট: জানুয়ারি ২০২৫</p>

      <div className="space-y-8 text-gray-600 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">১. সাধারণ শর্তাবলী</h2>
          <p>
            Rafsan Clothing-এর ওয়েবসাইট ব্যবহার করে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন। এই শর্তাবলী না মানলে
            অনুগ্রহ করে আমাদের সেবা ব্যবহার থেকে বিরত থাকুন। আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার
            অধিকার রাখি।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">২. অ্যাকাউন্ট তৈরি ও ব্যবহার</h2>
          <p>
            আমাদের ওয়েবসাইটে অ্যাকাউন্ট তৈরি করতে আপনাকে সঠিক ও সম্পূর্ণ তথ্য প্রদান করতে হবে। আপনার
            অ্যাকাউন্টের নিরাপত্তা রক্ষার দায়িত্ব আপনার নিজের। অ্যাকাউন্ট অপব্যবহার হলে আমরা তা বন্ধ করার
            অধিকার রাখি।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">৩. পণ্য ও মূল্য</h2>
          <p>
            আমাদের সমস্ত পণ্যের মূল্য বাংলাদেশি টাকায় (BDT) উল্লেখ করা হয়। মূল্যে ভ্যাট অন্তর্ভুক্ত থাকতে পারে।
            ডেলিভারি চার্জ আলাদাভাবে প্রযোজ্য হবে। আমরা যেকোনো সময় মূল্য পরিবর্তনের অধিকার রাখি, তবে
            অর্ডার কনফার্মের পর মূল্য পরিবর্তন হবে না।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">৪. অর্ডার ও পেমেন্ট</h2>
          <p>
            অর্ডার করার পর আমরা ইমেইল বা SMS-এর মাধ্যমে কনফার্মেশন পাঠাবো। পেমেন্ট সম্পন্ন না হলে অর্ডার
            প্রক্রিয়া শুরু হবে না। আমরা bKash, Nagad, Rocket, VISA ও Mastercard গ্রহণ করি।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">৫. ডেলিভারি নীতি</h2>
          <p>
            আমরা সারা বাংলাদেশে ডেলিভারি দিই। ঢাকার ভেতরে ১–২ কার্যদিবস এবং বাইরে ৩–৫ কার্যদিবস সময় লাগে।
            প্রাকৃতিক দুর্যোগ বা অন্যান্য অনিবার্য কারণে ডেলিভারিতে বিলম্ব হতে পারে।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">৬. মেধাস্বত্ব</h2>
          <p>
            এই ওয়েবসাইটের সমস্ত কন্টেন্ট, ছবি, লোগো এবং ডিজাইন Rafsan Clothing-এর মেধাস্বত্বের অন্তর্গত।
            পূর্ব অনুমতি ছাড়া এগুলো ব্যবহার বা পুনরুৎপাদন করা যাবে না।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">৭. দায়বদ্ধতার সীমা</h2>
          <p>
            Rafsan Clothing কোনো পরোক্ষ ক্ষতি বা ক্ষয়ের জন্য দায়বদ্ধ নয়। আমাদের সর্বোচ্চ দায়বদ্ধতা আপনার
            অর্ডারের মোট মূল্যের মধ্যে সীমিত।
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">৮. আইনি এখতিয়ার</h2>
          <p>
            এই শর্তাবলী বাংলাদেশের আইন অনুযায়ী পরিচালিত হবে। যেকোনো বিরোধ বাংলাদেশের আদালতে নিষ্পত্তি হবে।
          </p>
        </section>

        <section className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <p className="text-gray-500">
            এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।
          </p>
        </section>
      </div>
    </div>
  );
}
