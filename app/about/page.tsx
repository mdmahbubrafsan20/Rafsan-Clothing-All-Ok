import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">About us</h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        Rafsan Clothing is a modern fashion destination focused on quality fabrics, fair pricing, and
        reliable delivery. Replace this copy with your brand story, mission, and team highlights.
      </p>
      <Link href="/" className="text-gray-900 font-medium underline">
        Back to home
      </Link>
    </div>
  );
}
