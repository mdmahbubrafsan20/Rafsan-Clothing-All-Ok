import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Fashion Tips, Trends & Style Guide | Rafsan Clothing Bangladesh",
  description:
    "বাংলাদেশের ফ্যাশন ব্লগ — স্টাইল টিপস, ট্রেন্ড আপডেট, পোশাক গাইড এবং Rafsan Clothing এর লেটেস্ট কালেকশন নিয়ে আর্টিকেল।",
  keywords: [
    "fashion blog bangladesh",
    "style tips bd",
    "clothing guide bangladesh",
    "fashion trends bangladesh",
    "rafsan clothing blog",
    "ফ্যাশন ব্লগ বাংলাদেশ",
    "স্টাইল টিপস",
  ],
  openGraph: {
    title: "Fashion Blog — Tips, Trends & Style Guide | Rafsan Clothing",
    description:
      "বাংলাদেশের ফ্যাশন ব্লগ — স্টাইল টিপস, ট্রেন্ড আপডেট, পোশাক গাইড।",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/blog" },
};

const blogPosts = [
  {
    slug: "coming-soon",
    title: "Fashion Tips & Style Guide Coming Soon",
    excerpt:
      "আমাদের ফ্যাশন ব্লগ শীঘ্রই আসছে! স্টাইল টিপস, ট্রেন্ড আপডেট এবং এক্সক্লুসিভ কালেকশন নিয়ে নিয়মিত আর্টিকেল পেতে সাথেই থাকুন।",
    date: "Coming Soon",
    category: "Announcement",
  },
];

export default function BlogPage() {
  return (
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
        Rafsan Clothing Blog
      </h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        বাংলাদেশের ফ্যাশন, স্টাইল টিপস, ট্রেন্ড আপডেট এবং Rafsan Clothing এর
        লেটেস্ট কালেকশন নিয়ে নিয়মিত আর্টিকেল পড়ুন।
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

      {/* Newsletter CTA */}
      <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Stay Updated
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          নতুন কালেকশন, এক্সক্লুসিভ অফার এবং ফ্যাশন টিপস সবার আগে পেতে আমাদের
          সাথেই থাকুন।
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Explore Our Collection
        </Link>
      </div>
    </div>
  );
}