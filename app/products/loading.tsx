export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-48 mb-6" />

        {/* Filter bar skeleton */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-100 rounded-full shrink-0" />
          ))}
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
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