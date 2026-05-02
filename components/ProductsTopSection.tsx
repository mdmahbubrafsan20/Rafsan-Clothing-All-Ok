"use client";

import { Search } from "lucide-react";
import { useState } from "react";

const filterButtons = [
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
  { id: "new", label: "New Arrival" },
  { id: "discount", label: "Discount" },
  { id: "popular", label: "Popular" },
];

export default function ProductsTopSection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="mb-8">
      {/* Search bar */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === "all"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
          onClick={() => setActiveFilter("all")}
        >
          All Products
        </button>
        {filterButtons.map((btn) => (
          <button
            key={btn.id}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === btn.id
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter(btn.id)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Results and sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold">48</span> products
        </p>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Sort by:</span>
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black">
            <option>Popularity</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
            <option>Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
}