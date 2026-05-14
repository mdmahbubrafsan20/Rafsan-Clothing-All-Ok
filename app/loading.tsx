export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-[210px] sm:h-[220px] md:h-[280px] lg:h-[600px] bg-gray-200 mb-4 md:mb-6" />

      {/* Marketing banner skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
        <div className="h-48 md:h-64 bg-gray-100 rounded-2xl" />
      </div>

      {/* Product grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div className="h-7 bg-gray-200 rounded w-48 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-5 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}