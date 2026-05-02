"use client";

import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Package, Star, Calendar, Download, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    conversionRate: 0,
  });
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; sales: number; revenue: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  async function loadAnalytics() {
    setLoading(true);
    try {
      // Mock data for demonstration
      // In a real app, you would fetch from Supabase with proper queries
      const mockRevenueData = [
        { date: "Jan 1", revenue: 1200 },
        { date: "Jan 2", revenue: 1800 },
        { date: "Jan 3", revenue: 1500 },
        { date: "Jan 4", revenue: 2200 },
        { date: "Jan 5", revenue: 1900 },
        { date: "Jan 6", revenue: 2400 },
        { date: "Jan 7", revenue: 2100 },
      ];

      const mockTopProducts = [
        { name: "Classic T-Shirt", sales: 156, revenue: 3120 },
        { name: "Denim Jacket", sales: 89, revenue: 7120 },
        { name: "Sports Shoes", sales: 67, revenue: 4020 },
        { name: "Winter Hoodie", sales: 45, revenue: 3150 },
        { name: "Casual Pants", sales: 38, revenue: 2280 },
      ];

      const mockCategoryData = [
        { name: "Men", count: 45 },
        { name: "Women", count: 38 },
        { name: "Kids", count: 22 },
        { name: "Sports", count: 15 },
      ];

      // Fetch actual stats from Supabase
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount, status')
        .eq('status', 'delivered');

      const { data: customersData } = await supabase
        .from('users')
        .select('id');

      const { data: productsData } = await supabase
        .from('products')
        .select('id');

      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const totalOrders = ordersData?.length || 0;
      const totalCustomers = customersData?.length || 0;
      const totalProducts = productsData?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        averageOrderValue,
        conversionRate: 2.5, // Mock conversion rate
      });

      setRevenueData(mockRevenueData);
      setTopProducts(mockTopProducts);
      setCategoryData(mockCategoryData);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into your store performance</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Filter className="h-4 w-4 text-gray-500 ml-3" />
              <select
                className="border-none bg-transparent px-3 py-2.5 focus:ring-0 focus:outline-none"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <button className="flex items-center px-4 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12.5%</span>
                  <span className="text-gray-500 text-sm ml-2">vs last period</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+8.2%</span>
                  <span className="text-gray-500 text-sm ml-2">vs last period</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCustomers}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+5.7%</span>
                  <span className="text-gray-500 text-sm ml-2">vs last period</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg. Order Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.averageOrderValue)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+3.4%</span>
                  <span className="text-gray-500 text-sm ml-2">vs last period</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                <p className="text-gray-500 text-sm">Daily revenue for the selected period</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-green-600 text-sm font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last period
                </p>
              </div>
            </div>
            <div className="h-64">
              {/* Simple bar chart visualization */}
              <div className="flex items-end h-48 space-x-2 mt-4">
                {revenueData.map((item, index) => {
                  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
                  const height = (item.revenue / maxRevenue) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                      />
                      <div className="text-xs text-gray-500 mt-2">{item.date}</div>
                      <div className="text-xs font-medium mt-1">{formatCurrency(item.revenue)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Top Selling Products</h3>
                <p className="text-gray-500 text-sm">By revenue in the selected period</p>
              </div>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="font-bold text-gray-700">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sales} units sold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{formatCurrency(product.revenue)}</div>
                    <div className="text-sm text-green-600">+{Math.floor(Math.random() * 20) + 5}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Category Distribution</h3>
            <div className="space-y-4">
              {categoryData.map((category, index) => {
                const total = categoryData.reduce((sum, c) => sum + c.count, 0);
                const percentage = total > 0 ? (category.count / total) * 100 : 0;
                const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"];
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${colors[index % colors.length]} mr-2`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-gray-900 font-bold">{category.count} products</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-right text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Conversion Rate</h3>
            <div className="flex items-center justify-center h-40">
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{stats.conversionRate}%</div>
                    <div className="text-gray-500 text-sm">Conversion Rate</div>
                  </div>
                </div>
                <div 
                  className="absolute top-0 left-0 h-32 w-32 rounded-full border-8 border-blue-500 border-r-transparent border-b-transparent"
                  style={{ transform: 'rotate(45deg)' }}
                />
              </div>
            </div>
            <div className="text-center text-gray-500 text-sm mt-4">
              <TrendingUp className="h-4 w-4 inline mr-1 text-green-500" />
              +2.1% from last month
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: "New order placed", amount: "$245.99", time: "2 min ago" },
                { action: "Customer registered", amount: "", time: "15 min ago" },
                { action: "Product review added", amount: "4.5 stars", time: "1 hour ago" },
                { action: "Coupon code used", amount: "SUMMER25", time: "2 hours ago" },
                { action: "Inventory updated", amount: "15 items", time: "3 hours ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                  {activity.amount && (
                    <div className="font-medium text-blue-600">{activity.amount}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 flex flex-col items-center">
              <BarChart3 className="h-12 w-12 text-blue-600 animate-pulse mb-4" />
              <div className="text-lg font-medium text-gray-900">Loading analytics...</div>
              <div className="text-gray-500 mt-2">Please wait while we fetch your data</div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}