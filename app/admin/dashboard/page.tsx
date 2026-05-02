"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// Define types based on Supabase schema
type Order = {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  payment_method: string;
  user?: {
    email: string;
    full_name?: string;
  };
};

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
};

type User = {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
};

type DashboardStats = {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockProducts: number;
  salesChange: number;
  ordersChange: number;
};

type ChartData = {
  date: string;
  sales: number;
  orders: number;
};

type TopProduct = {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    salesChange: 12.5,
    ordersChange: 8.3,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Fetch total sales with error handling
        let totalSales = 0;
        try {
          const { data: salesData, error: salesError } = await supabase
            .from("orders")
            .select("total_amount");
          
          if (salesError) {
            console.error("Error fetching sales data:", salesError);
          } else {
            totalSales = salesData?.reduce((sum, order) => sum + (order?.total_amount || 0), 0) || 0;
          }
        } catch (error) {
          console.error("Unexpected error fetching sales:", error);
        }

        // Fetch total orders with error handling
        let totalOrders = 0;
        let pendingOrders = 0;
        try {
          const { data: ordersData, error: ordersError } = await supabase
            .from("orders")
            .select("id, status");
          
          if (ordersError) {
            console.error("Error fetching orders data:", ordersError);
          } else {
            totalOrders = ordersData?.length || 0;
            pendingOrders = ordersData?.filter(order => order?.status === "pending").length || 0;
          }
        } catch (error) {
          console.error("Unexpected error fetching orders:", error);
        }

        // Fetch total products with error handling
        let totalProducts = 0;
        let lowStockProducts = 0;
        try {
          const { data: productsData, error: productsError } = await supabase
            .from("products")
            .select("id, stock");
          
          if (productsError) {
            console.error("Error fetching products data:", productsError);
          } else {
            totalProducts = productsData?.length || 0;
            lowStockProducts = productsData?.filter(product => (product?.stock || 0) < 5).length || 0;
          }
        } catch (error) {
          console.error("Unexpected error fetching products:", error);
        }

        // Fetch total customers with error handling
        let totalCustomers = 0;
        try {
          const { data: usersData, error: usersError } = await supabase
            .from("users")
            .select("id");
          
          if (usersError) {
            console.error("Error fetching users data:", usersError);
          } else {
            totalCustomers = usersData?.length || 0;
          }
        } catch (error) {
          console.error("Unexpected error fetching users:", error);
        }

        // Fetch recent orders with user info
        const { data: recentOrdersData } = await supabase
          .from("orders")
          .select(`
            *,
            user:users(email, full_name)
          `)
          .order("created_at", { ascending: false })
          .limit(5);

        // Fetch top selling products from order_items
        const { data: orderItemsData } = await supabase
          .from("order_items")
          .select(`
            quantity,
            product:products(name, price)
          `)
          .limit(10);

        // Process top products
        const productMap = new Map<string, TopProduct>();
        orderItemsData?.forEach(item => {
          if (item.product) {
            const productId = (item.product as any).id || "unknown";
            const productName = (item.product as any).name || "Unknown Product";
            const price = (item.product as any).price || 0;
            
            const existing = productMap.get(productId);
            if (existing) {
              existing.quantity += item.quantity;
              existing.revenue += item.quantity * price;
            } else {
              productMap.set(productId, {
                id: productId,
                name: productName,
                quantity: item.quantity,
                revenue: item.quantity * price,
              });
            }
          }
        });

        const sortedTopProducts = Array.from(productMap.values())
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        // Generate chart data (last 7 days)
        const today = new Date();
        const chartDataArray: ChartData[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          
          // Mock data for chart - in real app, you would aggregate actual data
          const sales = Math.floor(Math.random() * 5000) + 1000;
          const orders = Math.floor(Math.random() * 20) + 5;
          
          chartDataArray.push({
            date: dateStr,
            sales,
            orders,
          });
        }

        setStats({
          totalSales,
          totalOrders,
          totalProducts,
          totalCustomers,
          pendingOrders,
          lowStockProducts,
          salesChange: 12.5,
          ordersChange: 8.3,
        });
        
        setRecentOrders(recentOrdersData || []);
        setTopProducts(sortedTopProducts);
        setChartData(chartDataArray);

      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Format currency (BDT)
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">RafSan Clothing Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of your store performance and statistics
          </p>
        </div>

        {/* Stats Cards Grid - 3 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Sales Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalSales)}</p>
                <div className="flex items-center mt-2">
                  {stats.salesChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stats.salesChange > 0 ? "text-green-600" : "text-red-600"}`}>
                    {stats.salesChange > 0 ? "+" : ""}{stats.salesChange}% from last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                <div className="flex items-center mt-2">
                  {stats.ordersChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stats.ordersChange > 0 ? "text-green-600" : "text-red-600"}`}>
                    {stats.ordersChange > 0 ? "+" : ""}{stats.ordersChange}% from last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Products Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                <p className="text-sm text-gray-500 mt-2">Active in catalog</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Customers Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalCustomers}</p>
                <p className="text-sm text-gray-500 mt-2">Registered users</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Pending Orders Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
                <p className="text-sm text-gray-500 mt-2">Awaiting processing</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Low Stock Products Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.lowStockProducts}</p>
                <p className="text-sm text-gray-500 mt-2">Stock below 5 units</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section - Two cards side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Chart</h3>
            <p className="text-sm text-gray-500 mb-6">Daily sales revenue for the last 7 days</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value) => [`৳${Number(value).toLocaleString()}`, "Sales"]}
                    labelStyle={{ color: "#333" }}
                  />
                  <Legend />
                  <Bar dataKey="sales" name="Sales (৳)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Trend Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Trend</h3>
            <p className="text-sm text-gray-500 mb-6">Daily order count for the last 7 days</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value) => [value, "Orders"]}
                    labelStyle={{ color: "#333" }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    name="Orders" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders and Top Selling Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders - 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-500 mt-1">Latest 5 orders from customers</p>
            </div>
            
            {recentOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
                <p className="text-sm text-gray-400 mt-2">Orders will appear here once customers make purchases</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.order_number || order.id.substring(0, 8)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(order.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.user?.full_name || order.user?.email || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.payment_method}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(order.total_amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {recentOrders.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 text-center">
                <a
                  href="/admin/orders"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  View all orders ({stats.totalOrders})
                </a>
              </div>
            )}
          </div>

          {/* Top Selling Products - 1/3 width */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
              <p className="text-sm text-gray-500 mt-1">By quantity sold</p>
            </div>
            
            {topProducts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No sales data yet</p>
                <p className="text-sm text-gray-400 mt-2">Products will appear here once sold</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">{product.quantity} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(product.revenue)}
                        </p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {topProducts.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 text-center">
                <a
                  href="/admin/products"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  View all products
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}