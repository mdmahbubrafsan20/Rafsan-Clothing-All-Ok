"use client";

import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { ShoppingBag, Search, Filter, Eye, Truck, CheckCircle, XCircle, Clock, DollarSign, ChevronLeft, ChevronRight, Loader2, Package, User, Calendar } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Order, OrderStatus, getAllOrders, updateOrderStatus, updateOrderTracking, getOrderStats } from "@/lib/orders";

const statusOptions: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    trackingNumber: "",
    carrier: "",
    estimatedDelivery: "",
  });

  const itemsPerPage = 10;

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const [ordersData, statsData] = await Promise.all([
        getAllOrders(),
        getOrderStats(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch {
      setErrorMessage("Orders could not be loaded. Please make sure you are signed in and have permission to view orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  const filteredOrders = orders.filter(order => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch = 
      (order.order_number || "").toLowerCase().includes(searchValue) ||
      (order.user?.email || "").toLowerCase().includes(searchValue) ||
      (order.user?.full_name || order.customer_name || "").toLowerCase().includes(searchValue) ||
      (order.id || "").toLowerCase().includes(searchValue);
    
    const matchesStatus =
      statusFilter === "all" ||
      order.status === statusFilter ||
      (statusFilter === "confirmed" && order.status === "processing");
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    const previousOrders = orders;
    const nextOrders = orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order);

    setOrders(nextOrders);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    setStats(calculateStats(nextOrders));

    const updatedOrder = await updateOrderStatus(orderId, newStatus);
    if (updatedOrder) {
      setOrders(orders.map(order => order.id === orderId ? updatedOrder : order));
      const newStats = await getOrderStats();
      setStats(newStats);
      return;
    }

    setOrders(previousOrders);
    setStats(calculateStats(previousOrders));
    setErrorMessage("Status could not be updated. Please check your order update permission.");
  };

  const handleTrackingUpdate = async (orderId: string) => {
    if (!trackingForm.trackingNumber || !trackingForm.carrier) {
      alert("Please fill in tracking number and carrier");
      return;
    }

    const updatedOrder = await updateOrderTracking(
      orderId,
      trackingForm.trackingNumber,
      trackingForm.carrier,
      trackingForm.estimatedDelivery || undefined
    );
    
    if (updatedOrder) {
      setOrders(orders.map(order => order.id === orderId ? updatedOrder : order));
      setShowOrderModal(false);
      setSelectedOrder(null);
      setTrackingForm({ trackingNumber: "", carrier: "", estimatedDelivery: "" });
    } else {
      setErrorMessage("Tracking could not be updated. Please check your order update permission.");
    }
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setTrackingForm({
      trackingNumber: order.tracking_number || "",
      carrier: order.carrier || "",
      estimatedDelivery: order.estimated_delivery || "",
    });
    setShowOrderModal(true);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <Package className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusLabel = (status: OrderStatus) => {
    if (status === "processing") return "Confirmed";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getItemPrice = (item: NonNullable<Order["items"]>[number]) => {
    return item.price_at_time ?? item.price ?? 0;
  };

  function calculateStats(nextOrders: Order[]) {
    return nextOrders.reduce(
      (result, order) => {
        result.total += 1;
        result.totalRevenue += Number(order.total_amount) || 0;

        if (order.status === "pending") result.pending += 1;
        if (order.status === "confirmed") result.confirmed += 1;
        if (order.status === "processing") result.processing += 1;
        if (order.status === "shipped") result.shipped += 1;
        if (order.status === "delivered") result.delivered += 1;
        if (order.status === "cancelled") result.cancelled += 1;

        return result;
      },
      {
        total: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
      }
    );
  }

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-900 mx-auto" />
            <p className="mt-2 text-gray-600">Loading orders...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-gray-600 mt-2">
                View, manage, and update customer orders
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shipped}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-2">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by order number, customer email, or name..."
                className="bg-transparent border-none outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  className="bg-gray-100 rounded-lg px-4 py-2 text-sm border-none outline-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {errorMessage && (
            <div className="border-b border-yellow-200 bg-yellow-50 px-6 py-3 text-sm text-yellow-800">
              {errorMessage}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Order</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{order.order_number || `ORD-${order.id.substring(0, 8).toUpperCase()}`}</p>
                        <p className="text-sm text-gray-500">ID: {order.id.substring(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{order.user?.full_name || order.customer_name || "N/A"}</p>
                          <p className="text-sm text-gray-500">{order.user?.email || order.phone || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900">{formatCurrency(order.total_amount)}</p>
                      <p className="text-sm text-gray-500">{order.payment_method}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusLabel(order.status)}</span>
                        </span>
                        <select
                          className="bg-gray-100 rounded-lg px-3 py-1 text-xs border-none outline-none"
                          value={order.status === "processing" ? "confirmed" : order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>
                              {getStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-gray-700">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openOrderModal(order)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 px-6 text-center">
                      <p className="font-medium text-gray-900">No orders found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm || statusFilter !== "all"
                          ? "Try changing the search or status filter."
                          : "Orders will appear here once customers place them."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-gray-600">{selectedOrder.order_number}</p>
                </div>
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedOrder(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Order Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Order Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{selectedOrder.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-gray-900">{formatCurrency(selectedOrder.total_amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedOrder.user?.full_name || selectedOrder.customer_name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedOrder.user?.email || selectedOrder.phone || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping Address:</span>
                      <span className="font-medium text-right">{selectedOrder.shipping_address || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing Address:</span>
                      <span className="font-medium text-right">{selectedOrder.billing_address || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Shipping & Tracking</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={trackingForm.trackingNumber}
                      onChange={(e) => setTrackingForm({...trackingForm, trackingNumber: e.target.value})}
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carrier
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={trackingForm.carrier}
                      onChange={(e) => setTrackingForm({...trackingForm, carrier: e.target.value})}
                      placeholder="e.g., Sundarban, SA Paribahan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Delivery
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={trackingForm.estimatedDelivery}
                      onChange={(e) => setTrackingForm({...trackingForm, estimatedDelivery: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleTrackingUpdate(selectedOrder.id)}
                  className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Update Tracking
                </button>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Product</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Quantity</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Price</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {item.product?.image_url && (
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 mr-3">
                                  <img 
                                    src={item.product.image_url} 
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{item.product?.name || "Unknown Product"}</p>
                                <p className="text-sm text-gray-500">Product ID: {item.product_id.substring(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-900">{item.quantity}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-900">{formatCurrency(getItemPrice(item))}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-gray-900">{formatCurrency(getItemPrice(item) * item.quantity)}</p>
                          </td>
                        </tr>
                      ))}
                      {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                        <tr>
                          <td colSpan={4} className="py-6 px-4 text-center text-sm text-gray-500">
                            No order items found for this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
