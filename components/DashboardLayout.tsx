"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Package,
  Truck,
  User,
  MapPin,
  Heart,
  Bell,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/account/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Order Tracking", href: "/account/tracking", icon: Truck },
  { label: "My Profile", href: "/account/profile", icon: User },
  { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Security", href: "/account/security", icon: Shield },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) setSidebarCollapsed(true);
  }, []);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();

      if (error || !authUser) {
        if (pathname === "/login") {
          setLoading(false);
          return;
        }
        router.push("/login");
        return;
      }
      setUser(authUser);
      setLoading(false);
    }
    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">My Account</h1>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarCollapsed ? "lg:w-20" : "lg:w-64"}
            ${sidebarCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}
            fixed lg:static inset-y-0 left-0 z-40
            w-64 bg-white border-r border-gray-200
            transition-all duration-300 ease-in-out
            lg:block
          `}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar header */}
            <div className="p-6 border-b border-gray-200 hidden lg:block">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <h2 className="text-lg font-semibold text-gray-900">My Account</h2>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100 hidden lg:block"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* User info */}
            <div className="p-6 border-b border-gray-200">
              <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "space-x-3"}`}>
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center ${sidebarCollapsed ? "justify-center" : "space-x-3"} px-3 py-3
                          rounded-lg transition-colors
                          ${isActive
                            ? "bg-gray-900 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                          }
                        `}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className={`
                  flex items-center ${sidebarCollapsed ? "justify-center" : "justify-center space-x-3"} 
                  w-full px-3 py-3 rounded-lg
                  text-red-600 hover:bg-red-50 transition-colors
                `}
              >
                <LogOut className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <span className="font-medium">Logout</span>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main
          className={`
          flex-1 min-w-0 relative
          ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}
          transition-all duration-300 ease-in-out
        `}
        >
          {!sidebarCollapsed && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setSidebarCollapsed(true)}
            />
          )}
          <div className="relative z-0 p-4 sm:p-6 lg:p-8 max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}