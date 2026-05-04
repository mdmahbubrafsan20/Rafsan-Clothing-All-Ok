import Link from "next/link";

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Return policy</h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        Outline your return window, condition of items, refund method, and who pays return shipping.
        This page is a placeholder until your policy is finalized.
      </p>
      <Link href="/" className="text-gray-900 font-medium underline">
        Back to home
      </Link>
    </div>
  );
}
