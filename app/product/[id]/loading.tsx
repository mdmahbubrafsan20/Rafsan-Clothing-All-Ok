export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Mobile skeleton */}
      <div className="md:hidden">
        <div className="w-full aspect-square bg-gray-200" />
        <div className="px-4 py-5 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-7 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="flex gap-2 mt-4">
            <div className="h-12 w-12 bg-gray-200 rounded-xl" />
            <div className="h-12 w-12 bg-gray-200 rounded-xl" />
            <div className="h-12 w-12 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-12 bg-gray-200 rounded-2xl mt-4" />
          <div className="h-12 bg-gray-200 rounded-2xl" />
        </div>
      </div>

      {/* Desktop skeleton */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-8">
        <div className="h-4 bg-gray-200 rounded w-64 mb-6" />
        <div className="grid grid-cols-2 gap-12">
          <div className="aspect-square rounded-2xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="flex gap-3 mt-4">
              <div className="h-14 w-14 bg-gray-200 rounded-xl" />
              <div className="h-14 w-14 bg-gray-200 rounded-xl" />
              <div className="h-14 w-14 bg-gray-200 rounded-xl" />
            </div>
            <div className="h-14 bg-gray-200 rounded-xl mt-6" />
            <div className="h-14 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}