"use client";

import { useState } from "react";

const categories = [
  { id: 1, name: "Men", count: 42 },
  { id: 2, name: "Women", count: 38 },
  { id: 3, name: "Kids", count: 25 },
  { id: 4, name: "T-Shirts", count: 18 },
  { id: 5, name: "Polo", count: 12 },
  { id: 6, name: "Hoodies", count: 15 },
];

export default function Sidebar() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat.name
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-sm text-gray-500">{cat.count}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {/* Price filter placeholder */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-black mr-2" />
              <span className="text-gray-700">Under ৳500</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-black mr-2" />
              <span className="text-gray-700">৳500 - ৳1000</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-black mr-2" />
              <span className="text-gray-700">৳1000 - ৳2000</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-black mr-2" />
              <span className="text-gray-700">Over ৳2000</span>
            </label>
          </div>
        </div>

        {/* Brand filter placeholder */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
          <div className="space-y-2">
            {["Nike", "Adidas", "Puma", "Levi's", "H&M"].map((brand) => (
              <label key={brand} className="flex items-center">
                <input type="checkbox" className="rounded text-black mr-2" />
                <span className="text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}