"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    category: "অর্ডার ও ডেলিভারি",
    items: [
      {
        q: "অর্ডার করার পর ডেলিভারি পেতে কতদিন লাগে?",
        a: "ঢাকার ভেতরে সাধারণত ১–২ কার্যদিবস এবং ঢাকার বাইরে ৩–৫ কার্যদিবস সময় লাগে। বিশেষ পরিস্থিতিতে একটু বেশি সময় লাগতে পারে।",
      },
      {
        q: "অর্ডার ট্র্যাক করতে পারব?",
        a: "হ্যাঁ! অর্ডার কনফার্ম হলে আপনি আমাদের ওয়েবসাইটে লগইন করে 'My Orders' থেকে অর্ডারের স্ট্যাটাস ট্র্যাক করতে পারবেন।",
      },
      {
        q: "সারা বাংলাদেশে কি ডেলিভারি দেওয়া হয়?",
        a: "হ্যাঁ, আমরা সারা বাংলাদেশে ডেলিভারি দিই। ঢাকার ভেতরে ও বাইরে উভয় ক্ষেত্রেই আমাদের ডেলিভারি সেবা চালু আছে।",
      },
    ],
  },
  {
    category: "পেমেন্ট",
    items: [
      {
        q: "কোন কোন পেমেন্ট পদ্ধতি গ্রহণ করা হয়?",
        a: "আমরা bKash, Nagad, Rocket, VISA এবং Mastercard গ্রহণ করি। ক্যাশ অন ডেলিভারিও পাওয়া যায়।",
      },
      {
        q: "পেমেন্ট কি নিরাপদ?",
        a: "হ্যাঁ, আমরা SSLCommerz পেমেন্ট গেটওয়ে ব্যবহার করি যা সম্পূর্ণ নিরাপদ এবং এনক্রিপ্টেড।",
      },
    ],
  },
  {
    category: "পণ্য ও সাইজ",
    items: [
      {
        q: "সাইজ কীভাবে বুঝব?",
        a: "প্রতিটি পণ্যের পেইজে সাইজ চার্ট দেওয়া আছে। অর্ডার করার আগে সাইজ চার্ট দেখে নিন। কোনো সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।",
      },
      {
        q: "পণ্যের মান কেমন?",
        a: "আমরা ১০০% কটন এবং প্রিমিয়াম ফ্যাব্রিক ব্যবহার করি। প্রতিটি পণ্য মান নিয়ন্ত্রণ পরীক্ষার পর শিপমেন্ট করা হয়।",
      },
      {
        q: "স্টক শেষ হলে কি পাওয়া যাবে?",
        a: "স্টক শেষ হয়ে গেলে পণ্যের পেইজে 'Out of Stock' দেখাবে। আমাদের নিউজলেটার সাবস্ক্রাইব করলে নতুন স্টক আসলে জানানো হবে।",
      },
    ],
  },
  {
    category: "রিটার্ন ও এক্সচেঞ্জ",
    items: [
      {
        q: "পণ্য রিটার্ন করা যাবে?",
        a: "হ্যাঁ, পণ্য পাওয়ার ৭ দিনের মধ্যে রিটার্ন করা যাবে। পণ্য অবশ্যই অব্যবহৃত এবং অরিজিনাল প্যাকেজিংসহ থাকতে হবে।",
      },
      {
        q: "ভুল সাইজ পেলে কী করব?",
        a: "ভুল সাইজ বা ত্রুটিপূর্ণ পণ্য পেলে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন। আমরা বিনামূল্যে এক্সচেঞ্জ করে দেব।",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full text-left py-4 flex items-center justify-between gap-4 text-gray-900 font-medium hover:text-black transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        <span className={`text-xl leading-none transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <p className="pb-4 text-gray-500 text-sm leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function FaqsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">FAQs</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">সাধারণ জিজ্ঞাসা (FAQs)</h1>
      <div className="w-12 h-1 bg-black mb-8"></div>
      <p className="text-gray-500 mb-10">আমাদের সবচেয়ে বেশি জিজ্ঞেস করা প্রশ্নগুলোর উত্তর নিচে দেওয়া হলো।</p>

      <div className="space-y-8">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-base font-bold text-black uppercase tracking-wide mb-2 pb-2 border-b-2 border-black inline-block">
              {section.category}
            </h2>
            <div className="mt-2">
              {section.items.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
        <p className="text-gray-600 mb-3">আপনার প্রশ্নের উত্তর পাননি?</p>
        <p className="text-sm text-gray-400 mb-4">রবিবার–বৃহস্পতিবার, সকাল ১০টা – রাত ৮টা</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition"
        >
          হোমে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
