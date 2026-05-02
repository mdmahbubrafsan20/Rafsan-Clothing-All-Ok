"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Image,
  Users,
  TicketPercent,
  Star,
  BarChart3,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Product Management", href: "/admin/products", icon: Package },
  { label: "Category Management", href: "/admin/categories", icon: Tag },
  { label: "Orders Management", href: "/admin/orders", icon: ShoppingBag },
  { label: "Banner Management", href: "/admin/banners", icon: Image },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons / Discounts", href: "/admin/coupons", icon: TicketPercent },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Reports / Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      console.log("AdminDashboardLayout: Checking authentication...");
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      
      console.log("AdminDashboardLayout: USER:", authUser);
      console.log("AdminDashboardLayout: ERROR:", error);
      
      if (error || !authUser) {
        console.log("AdminDashboardLayout: No user found, redirecting to /login");
        router.push("/login");
        return;
      }

      // Check if user has admin role
      const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser.id)
        .single();

      if (roleError || !userData) {
        console.log("AdminDashboardLayout: Error fetching user role or user not found in users table");
        router.push("/login");
        return;
      }

      if (userData.role !== 'admin') {
        console.log("AdminDashboardLayout: User is not admin, redirecting to home");
        router.push("/");
        return;
      }

      setUser(authUser);
      setLoading(false);
    }
    checkAuth();
  }, []);

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
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Top Bar */}
      <header className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-white border-b border-gray-200 transition-all duration-300 ease-in-out lg:ml-0">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left side - Brand */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RafSan Clothing</h1>
              <p className="text-sm text-gray-500">Production control panel</p>
            </div>
          </div>

          {/* Right side - Search, Icons, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-64">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-600" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Admin profile */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarCollapsed ? "lg:w-20" : "lg:w-64"}
            ${sidebarCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}
            fixed lg:static inset-y-0 left-0 z-40
            w-64 bg-gray-50 border-r border-gray-200
            transition-all duration-300 ease-in-out
            lg:block
          `}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar header */}
            <div className="p-6 border-b border-gray-200 hidden lg:block">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-200 hidden lg:block"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {adminNavItems.map((item) => {
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
                            : "text-gray-700 hover:bg-gray-200"
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
        <main className={`
          flex-1
          ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}
          transition-all duration-300 ease-in-out
        `}>
          {/* Overlay for mobile sidebar */}
          {!sidebarCollapsed && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setSidebarCollapsed(true)}
            />
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
}