import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms &amp; Conditions</h1>
      <p className="text-gray-600 mb-4">
        This is a placeholder summary for checkout and legal links. Replace this copy with your store&apos;s
        real terms, refund policy, and privacy practices before going live.
      </p>
      <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-8">
        <li>Orders are subject to availability and confirmation.</li>
        <li>Delivery timelines are estimates and may vary by location.</li>
        <li>Returns and exchanges follow your published policy.</li>
      </ul>
      <Link href="/" className="text-gray-900 font-medium underline">
        Back to home
      </Link>
    </div>
  );
}
