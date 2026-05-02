"use client";

import { Home, LayoutGrid, ShoppingCart, MessageCircle, User } from "lucide-react";
import { useState } from "react";

export default function BottomNav() {
  const [activeItem, setActiveItem] = useState("Home");

  const navItems = [
    { id: "Home", icon: Home, label: "Home" },
    { id: "Category", icon: LayoutGrid, label: "Category" },
    { id: "Cart", icon: ShoppingCart, label: "Cart" },
    { id: "Chat", icon: MessageCircle, label: "Chat" },
    { id: "Login", icon: User, label: "Login" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-16 md:hidden">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full py-2 transition-colors ${
                isActive ? "text-black" : "text-gray-500"
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? "stroke-2" : ""}`} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}