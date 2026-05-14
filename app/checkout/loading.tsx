export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 animate-pulse">
      <div className="pt-6 pb-20 px-4 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto">
        {/* Back link skeleton */}
        <div className="h-4 bg-gray-200 rounded w-32 mb-6" />

        {/* Empty cart or form skeleton */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6" />

          {/* Form fields skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-20" />
                <div className="h-12 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>

          {/* Order summary skeleton */}
          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50">
                <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="h-5 bg-gray-200 rounded w-16" />
              <div className="h-6 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-14 bg-gray-300 rounded-xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}