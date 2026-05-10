"use client";

import { useState } from "react";

const messages = [
  "🚚 ৳999 এর উপরে অর্ডারে ফ্রি ডেলিভারি!",
  "✅ ১০০% অরিজিনাল ও Export Quality পণ্য",
  "🔄 ৭ দিনের মধ্যে সহজ Return & Exchange",
  "📞 WhatsApp এ অর্ডার করুন: +880 1610-735064",
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative w-full bg-zinc-900 text-white overflow-hidden">
      <div className="flex items-center justify-center px-8 py-2">
        {/* Scrolling ticker */}
        <div className="overflow-hidden w-full max-w-3xl">
          <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap gap-16">
            {[...messages, ...messages].map((msg, i) => (
              <span key={i} className="text-xs sm:text-sm font-medium shrink-0">
                {msg}
              </span>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          aria-label="Close announcement"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
