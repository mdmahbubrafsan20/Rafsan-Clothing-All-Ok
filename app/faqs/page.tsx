import Link from "next/link";

export default function FaqsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">FAQs</h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        Add common questions about sizing, delivery, payments, and exchanges. This is a starter page
        linked from the site footer.
      </p>
      <Link href="/" className="text-gray-900 font-medium underline">
        Back to home
      </Link>
    </div>
  );
}
