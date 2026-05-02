"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { Truck, Package, CheckCircle, Clock, MapPin, Home } from "lucide-react";

type Order = {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  payment_method: string;
  shipping_address?: string;
  estimated_delivery?: string;
  tracking_number?: string;
  carrier?: string;
};

type TrackingStep = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "pending";
  date?: string;
};

export default function TrackingPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);

  // Fetch orders with tracking data
  useEffect(() => {
    async function fetchTrackingData() {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        // User should exist because DashboardLayout already authenticated
        if (!authUser) {
          console.error("TrackingPage: Unexpected - no user found but DashboardLayout should have redirected");
          setLoading(false);
          return;
        }
        
        // Fetch orders that are not cancelled
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", authUser.id)
          .in("status", ["processing", "shipped", "delivered"])
          .order("created_at", { ascending: false });

        if (ordersError) {
          throw ordersError;
        }

        if (ordersData) {
          setOrders(ordersData);
          if (ordersData.length > 0) {
            setSelectedOrder(ordersData[0]);
            generateTrackingSteps(ordersData[0]);
          }
        }
        
      } catch (err: any) {
        console.error("Error loading tracking data:", err);
        setError(err.message || "Failed to load tracking data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchTrackingData();
  }, []);

  // Generate tracking steps based on order status
  const generateTrackingSteps = (order: Order) => {
    const steps: TrackingStep[] = [
      {
        id: 1,
        title: "Order Placed",
        description: "Your order has been received",
        icon: <Package className="h-5 w-5" />,
        status: "completed",
        date: order.created_at,
      },
      {
        id: 2,
        title: "Order Confirmed",
        description: "We've confirmed your order",
        icon: <CheckCircle className="h-5 w-5" />,
        status: order.status === "pending" ? "pending" : 
                order.status === "processing" ? "current" : "completed",
      },
      {
        id: 3,
        title: "Processing",
        description: "Your order is being prepared",
        icon: <Clock className="h-5 w-5" />,
        status: order.status === "processing" ? "current" : 
                order.status === "shipped" || order.status === "delivered" ? "completed" : "pending",
      },
      {
        id: 4,
        title: "Shipped",
        description: "Your order is on the way",
        icon: <Truck className="h-5 w-5" />,
        status: order.status === "shipped" ? "current" : 
                order.status === "delivered" ? "completed" : "pending",
      },
      {
        id: 5,
        title: "Out for Delivery",
        description: "Your order is out for delivery",
        icon: <MapPin className="h-5 w-5" />,
        status: order.status === "delivered" ? "completed" : "pending",
      },
      {
        id: 6,
        title: "Delivered",
        description: "Your order has been delivered",
        icon: <Home className="h-5 w-5" />,
        status: order.status === "delivered" ? "completed" : "pending",
      },
    ];
    
    setTrackingSteps(steps);
  };

  // Handle order selection
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    generateTrackingSteps(order);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency (BDT)
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString("en-BD")}`;
  };

  // Get status color
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
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tracking information...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
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
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
            <p className="text-gray-600 mt-2">Track your orders in real-time</p>
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active orders to track</h3>
              <p className="text-gray-500 mb-6">
                You don't have any orders that are currently being processed or shipped.
              </p>
              <button
                onClick={() => router.push("/products")}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column: Order selection */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Orders</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Select an order to track its delivery progress
                  </p>
                  
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <button
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedOrder?.id === order.id
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">
                              Order #{order.order_number || order.id.substring(0, 8)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {formatDate(order.created_at)}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(order.total_amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.payment_method || "N/A"}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right column: Tracking details */}
              <div className="lg:col-span-2">
                {selectedOrder && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Tracking Order #{selectedOrder.order_number || selectedOrder.id.substring(0, 8)}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            Estimated delivery: {selectedOrder.estimated_delivery 
                              ? formatDate(selectedOrder.estimated_delivery) 
                              : "Calculating..."}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Tracking #</div>
                          <div className="font-mono font-medium text-gray-900">
                            {selectedOrder.tracking_number || "TRK-" + selectedOrder.id.substring(0, 8).toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Carrier: {selectedOrder.carrier || "Standard Shipping"}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {/* Tracking progress bar */}
                      <div className="mb-8">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Delivery Progress</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedOrder.status === "delivered" ? "100%" : 
                             selectedOrder.status === "shipped" ? "75%" :
                             selectedOrder.status === "processing" ? "50%" : "25%"}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              selectedOrder.status === "delivered" ? "bg-green-600" :
                              selectedOrder.status === "shipped" ? "bg-purple-600" :
                              selectedOrder.status === "processing" ? "bg-blue-600" : "bg-yellow-600"
                            }`}
                            style={{
                              width: selectedOrder.status === "delivered" ? "100%" : 
                                     selectedOrder.status === "shipped" ? "75%" :
                                     selectedOrder.status === "processing" ? "50%" : "25%"
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Tracking steps */}
                      <div className="space-y-6">
                        {trackingSteps.map((step, index) => (
                          <div key={step.id} className="flex">
                            <div className="flex flex-col items-center mr-4">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                step.status === "completed" ? "bg-green-100 text-green-600" :
                                step.status === "current" ? "bg-blue-100 text-blue-600" :
                                "bg-gray-100 text-gray-400"
                              }`}>
                                {step.icon}
                              </div>
                              {index < trackingSteps.length - 1 && (
                                <div className={`flex-1 w-0.5 mt-2 ${
                                  step.status === "completed" ? "bg-green-300" : "bg-gray-200"
                                }`}></div>
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <div className="flex justify-between">
                                <h3 className={`font-medium ${
                                  step.status === "completed" ? "text-green-800" :
                                  step.status === "current" ? "text-blue-800" :
                                  "text-gray-500"
                                }`}>
                                  {step.title}
                                </h3>
                                {step.date && (
                                  <span className="text-sm text-gray-500">{formatDate(step.date)}</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                              {step.status === "current" && (
                                <div className="mt-2 text-sm text-blue-600">
                                  • Currently at this step
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Shipping address */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">
                            {selectedOrder.shipping_address || "123 Main Street, Dhaka 1212, Bangladesh"}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Contact: +880 1XXX-XXXXXX
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
