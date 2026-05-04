import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy policy</h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        This placeholder describes how you collect, use, and protect customer data. Replace with your
        legal privacy policy before launch.
      </p>
      <Link href="/" className="text-gray-900 font-medium underline">
        Back to home
      </Link>
    </div>
  );
}
