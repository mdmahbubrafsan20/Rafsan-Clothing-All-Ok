"use client";

import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Settings, Save, Globe, Bell, Shield, CreditCard, Mail, Users, Database, Cloud, BellRing, Eye, EyeOff, Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "RafSan Clothing",
    storeEmail: "admin@rafsanclothing.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Fashion Street, New York, NY 10001",
    currency: "USD",
    timezone: "America/New_York",
    maintenanceMode: false,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    newUserNotifications: true,
    marketingEmails: false,
    pushNotifications: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    ipWhitelist: "",
    loginAttempts: 5,
    passwordExpiry: 90,
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    stripePublicKey: "pk_test_********",
    stripeSecretKey: "sk_test_********",
    paypalEnabled: true,
    paypalClientId: "********",
    cashOnDelivery: true,
    currency: "USD",
  });

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveMessage(null);
    
    try {
      // In a real app, you would save to Supabase or your backend
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      });
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.'
      });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "advanced", label: "Advanced", icon: Database },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={generalSettings.storeName}
            onChange={(e) => setGeneralSettings({...generalSettings, storeName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={generalSettings.storeEmail}
            onChange={(e) => setGeneralSettings({...generalSettings, storeEmail: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Phone</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={generalSettings.storePhone}
            onChange={(e) => setGeneralSettings({...generalSettings, storePhone: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={generalSettings.currency}
            onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="BDT">BDT (৳)</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          value={generalSettings.storeAddress}
          onChange={(e) => setGeneralSettings({...generalSettings, storeAddress: e.target.value})}
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="maintenanceMode"
          className="h-4 w-4 text-blue-600 rounded"
          checked={generalSettings.maintenanceMode}
          onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
        />
        <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-700">
          Enable Maintenance Mode
        </label>
        <span className="ml-2 text-xs text-gray-500">(Store will be temporarily unavailable to customers)</span>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Email Notifications</div>
              <div className="text-sm text-gray-500">Receive email alerts for important events</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <BellRing className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Order Notifications</div>
              <div className="text-sm text-gray-500">Get notified when new orders are placed</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notificationSettings.orderNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, orderNotifications: e.target.checked})}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Low Stock Alerts</div>
              <div className="text-sm text-gray-500">Receive alerts when product stock is low</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notificationSettings.lowStockAlerts}
              onChange={(e) => setNotificationSettings({...notificationSettings, lowStockAlerts: e.target.checked})}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <div className="font-medium text-gray-900">New User Notifications</div>
              <div className="text-sm text-gray-500">Get notified when new users register</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notificationSettings.newUserNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, newUserNotifications: e.target.checked})}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Two-Factor Authentication</div>
              <div className="text-sm text-gray-500">Require 2FA for admin login</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={securitySettings.twoFactorAuth}
              onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
            min="1"
            max="240"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Enter IP addresses separated by commas"
            value={securitySettings.ipWhitelist}
            onChange={(e) => setSecuritySettings({...securitySettings, ipWhitelist: e.target.value})}
          />
          <p className="text-sm text-gray-500 mt-1">Leave empty to allow access from any IP address</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={securitySettings.loginAttempts}
              onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: parseInt(e.target.value)})}
              min="1"
              max="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={securitySettings.passwordExpiry}
              onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
              min="0"
              max="365"
            />
            <p className="text-sm text-gray-500 mt-1">0 = never expire</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Stripe Payment Gateway</div>
              <div className="text-sm text-gray-500">Accept credit card payments via Stripe</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={paymentSettings.stripeEnabled}
              onChange={(e) => setPaymentSettings({...paymentSettings, stripeEnabled: e.target.checked})}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {paymentSettings.stripeEnabled && (
          <div className="space-y-4 ml-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Public Key</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  value={paymentSettings.stripePublicKey}
                  onChange={(e) => setPaymentSettings({...paymentSettings, stripePublicKey: e.target.value})}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Eye className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  value={paymentSettings.stripeSecretKey}
                  onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Eye className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <div className="font-medium text-gray-900">PayPal Payment Gateway</div>
              <div className="text-sm text-gray-500">Accept payments via PayPal</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={paymentSettings.paypalEnabled}
              onChange={(e) => setPaymentSettings({...paymentSettings, paypalEnabled: e.target.checked})}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Cash on Delivery</div>
              <div className="text-sm text-gray-500">Allow customers to pay when they receive the order</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={paymentSettings.cashOnDelivery}
              onChange={(e) => setPaymentSettings({...paymentSettings, cashOnDelivery: e.target.checked})}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderUsersSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <h4 className="font-medium text-blue-900">User Roles & Permissions</h4>
            <p className="text-sm text-blue-700 mt-1">Manage admin user roles and their permissions</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">Admin Users</h4>
          <div className="space-y-3">
            {[
              { name: "Admin User", email: "admin@example.com", role: "Super Admin", lastActive: "2 hours ago" },
              { name: "Manager", email: "manager@example.com", role: "Manager", lastActive: "1 day ago" },
              { name: "Support", email: "support@example.com", role: "Support", lastActive: "3 days ago" },
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold text-gray-700">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{user.role}</div>
                  <div className="text-sm text-gray-500">Active {user.lastActive}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Database className="h-5 w-5 text-yellow-600 mr-2" />
          <div>
            <h4 className="font-medium text-yellow-900">Advanced Settings</h4>
            <p className="text-sm text-yellow-700 mt-1">These settings affect system performance and behavior</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Database Backup</label>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium flex items-center">
              <Cloud className="h-4 w-4 mr-2" />
              Backup Now
            </button>
            <button className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium">
              Schedule Backup
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Clear Cache</label>
          <button className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium">
            Clear All Cache
          </button>
          <p className="text-sm text-gray-500 mt-2">This will clear all cached data and may temporarily slow down the system</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">System Logs</label>
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="text-sm font-mono space-y-1">
              <div className="text-green-600">[INFO] System started successfully - 2024-01-15 10:30:45</div>
              <div className="text-blue-600">[DEBUG] Database connection established - 2024-01-15 10:30:46</div>
              <div className="text-yellow-600">[WARN] Cache cleared by admin - 2024-01-15 09:15:22</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general": return renderGeneralSettings();
      case "notifications": return renderNotificationSettings();
      case "security": return renderSecuritySettings();
      case "payment": return renderPaymentSettings();
      case "users": return renderUsersSettings();
      case "advanced": return renderAdvancedSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Settings className="h-8 w-8 mr-3 text-gray-600" />
              System Settings
            </h1>
            <p className="text-gray-600 mt-2">Configure your store settings and preferences</p>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${saveMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center">
              <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-3 ${saveMessage.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {saveMessage.type === 'success' ? '✓' : '!'}
              </div>
              <span className={`font-medium ${saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {saveMessage.text}
              </span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-t-lg border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {renderTabContent()}
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
          <p className="text-red-700 mb-4">These actions are irreversible. Please proceed with caution.</p>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
              Reset All Settings
            </button>
            <button className="px-4 py-2.5 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50">
              Delete All Data
            </button>
            <button className="px-4 py-2.5 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50">
              Deactivate Store
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}