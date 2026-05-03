export default function CategorySection() {
  const categories = [
    {
      id: 1,
      title: "Women's New Arrivals",
      subtitle: "Discover the latest trends",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Accessories Collection",
      subtitle: "Complete your look",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="px-3 py-6 md:py-8 max-md:px-3">
      {/* Single container for all screen sizes with order control */}
      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        {/* Banner 1 - Mobile: order-1, Desktop: first column */}
        <div className="relative w-full h-[220px] md:h-[260px] rounded-xl overflow-hidden group order-1">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${categories[0].image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-1">{categories[0].title}</h3>
            <p className="text-sm opacity-90">{categories[0].subtitle}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>

        {/* Banner 2 - Mobile: order-2, Desktop: second column */}
        <div className="relative w-full h-[220px] md:h-[260px] rounded-xl overflow-hidden group order-2">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${categories[1].image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-1">{categories[1].title}</h3>
            <p className="text-sm opacity-90">{categories[1].subtitle}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>

        {/* Custom Apparel text block */}
        {/* Mobile: order-3 (below both banners), Desktop: order-2 (between banners) with col-span-2 */}
        <div className="bg-teal-100 dark:bg-teal-900/30 rounded-xl p-4 text-center order-3 md:order-2 md:col-span-2 max-md:bg-teal-100 max-md:text-left">
          <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white max-md:text-gray-900">Custom Apparel</h3>
          <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm md:text-lg max-md:text-gray-700">
            We provide plain t-shirts and apparel for all your custom branding needs
          </p>
        </div>
      </div>
    </section>
  );
}