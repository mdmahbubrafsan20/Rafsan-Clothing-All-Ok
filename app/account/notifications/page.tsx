"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { Bell, Check, Trash2, ShoppingBag, Package, Tag, AlertCircle } from "lucide-react";

type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "order" | "promotion" | "system" | "security";
  read: boolean;
  metadata?: any;
  created_at: string;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  // Fetch notifications data
  useEffect(() => {
    async function fetchNotificationsData() {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        // User should exist because DashboardLayout already authenticated
        if (!authUser) {
          console.error("NotificationsPage: Unexpected - no user found but DashboardLayout should have redirected");
          setLoading(false);
          return;
        }
        setUser(authUser);
        
        // Fetch notifications
        let query = supabase
          .from("notifications")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false });

        // Apply filter if needed
        if (filter === "read") {
          query = query.eq("read", true);
        } else if (filter === "unread") {
          query = query.eq("read", false);
        }

        const { data: notificationsData, error: notificationsError } = await query;

        if (notificationsError) {
          // If table doesn't exist, we'll show empty state
          if (notificationsError.code === '42P01') {
            console.log("Notifications table doesn't exist yet");
            setNotifications([]);
            return;
          }
          throw notificationsError;
        }

        if (notificationsData) {
          setNotifications(notificationsData);
        }
        
      } catch (err: any) {
        console.error("Error loading notifications:", err);
        setError(err.message || "Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchNotificationsData();
  }, [filter]);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) {
        throw error;
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
      setError("Failed to update notification. Please try again.");
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .in("id", unreadIds);

      if (error) {
        throw error;
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (err: any) {
      console.error("Error marking all as read:", err);
      setError("Failed to update notifications. Please try again.");
    }
  };

  // Delete notification
  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) {
        throw error;
      }

      // Remove from local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (err: any) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification. Please try again.");
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setNotifications([]);
    } catch (err: any) {
      console.error("Error clearing notifications:", err);
      setError("Failed to clear notifications. Please try again.");
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "promotion":
        return <Tag className="h-5 w-5 text-green-500" />;
      case "security":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get notification type label
  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "order":
        return "Order Update";
      case "promotion":
        return "Promotion";
      case "security":
        return "Security Alert";
      default:
        return "System Notification";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
      });
    }
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true;
    if (filter === "read") return notif.read;
    if (filter === "unread") return !notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Your account notifications</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="animate-pulse">
                <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Your account notifications</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-2">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1 text-sm rounded-md transition ${filter === "all" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("unread")}
                    className={`px-3 py-1 text-sm rounded-md transition ${filter === "unread" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => setFilter("read")}
                    className={`px-3 py-1 text-sm rounded-md transition ${filter === "read" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    Read
                  </button>
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition flex items-center"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark all as read
                  </button>
                )}
                
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === "unread" 
                  ? "You're all caught up! Check back later for new updates."
                  : "You'll see important updates about your orders, promotions, and account security here."}
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  View all notifications
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl border ${notification.read ? 'border-gray-200' : 'border-gray-300 border-l-4 border-l-blue-500'} shadow-sm overflow-hidden hover:shadow-md transition`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {getNotificationTypeLabel(notification.type)}
                            </span>
                            {!notification.read && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-green-600 transition"
                            aria-label="Mark as read"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition"
                          aria-label="Delete notification"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {notification.metadata && notification.type === "order" && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-600">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          <span>Order #{notification.metadata.order_number}</span>
                          {notification.metadata.status && (
                            <span className={`ml-2 px-2 py-1 text-xs rounded ${notification.metadata.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {notification.metadata.status}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
