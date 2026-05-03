"use client";

import { Home, LayoutGrid, ShoppingCart, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { id: "home", icon: Home, label: "Home", href: "/" },
    { id: "category", icon: LayoutGrid, label: "Category", href: "/category" },
    { id: "cart", icon: ShoppingCart, label: "Cart", href: "/cart" },
    { id: "chat", icon: MessageCircle, label: "Chat", href: "#" }, // Placeholder for chat
    { id: "login", icon: User, label: "Login", href: "/login" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-16 md:hidden">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full py-2 transition-colors ${
                active ? "text-black" : "text-gray-500"
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${active ? "stroke-2" : ""}`} />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
                )}
              </div>
              <span className={`text-xs mt-1 ${active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}