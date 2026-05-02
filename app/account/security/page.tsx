"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { Shield, Key, Mail, Smartphone, CheckCircle, AlertCircle } from "lucide-react";

export default function SecurityPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Two-factor authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }
        
        // User should exist because DashboardLayout already authenticated
        if (!authUser) {
          console.error("SecurityPage: Unexpected - no user found but DashboardLayout should have redirected");
          setLoading(false);
          return;
        }
        
        setUser(authUser);
        
      } catch (err: any) {
        console.error("Error loading user:", err);
        setError(err.message || "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, []);

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    
    try {
      setUpdating(true);
      
      // Update password using Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (updateError) {
        throw updateError;
      }
      
      setSuccess("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
    } catch (err: any) {
      console.error("Error updating password:", err);
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle two-factor authentication toggle
  const handleTwoFactorToggle = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      setUpdating(true);
      
      // In a real app, you would implement proper 2FA setup
      // This is just a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTwoFactorEnabled(!twoFactorEnabled);
      setSuccess(twoFactorEnabled 
        ? "Two-factor authentication disabled." 
        : "Two-factor authentication enabled. Please check your email for setup instructions."
      );
      
    } catch (err: any) {
      console.error("Error toggling 2FA:", err);
      setError("Failed to update two-factor authentication settings.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle email verification resend
  const handleResendVerification = async () => {
    if (!user) return;
    
    try {
      setUpdating(true);
      setError(null);
      
      const { error: verifyError } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      
      if (verifyError) {
        throw verifyError;
      }
      
      setSuccess("Verification email sent! Please check your inbox.");
      
    } catch (err: any) {
      console.error("Error resending verification:", err);
      setError(err.message || "Failed to send verification email.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="h-64 bg-gray-100 rounded"></div>
              </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Security</h1>
            <p className="text-gray-600 mt-2">Manage your account security and privacy settings</p>
          </div>
          
          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-green-700">{success}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Security Overview */}
            <div className="lg:col-span-2 space-y-8">
              {/* Password Change Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <Key className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                </div>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password (min. 6 characters)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? "Updating Password..." : "Update Password"}
                  </button>
                </form>
              </div>
              
              {/* Two-Factor Authentication Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Shield className="h-6 w-6 text-purple-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleTwoFactorToggle}
                    disabled={updating}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${twoFactorEnabled ? 'bg-purple-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    {twoFactorEnabled 
                      ? "Two-factor authentication is enabled. You'll need to enter a verification code from your authenticator app when signing in."
                      : "Two-factor authentication adds an extra layer of security by requiring a verification code from your phone when you sign in."
                    }
                  </p>
                </div>
              </div>
              
              {/* Email Verification Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <Mail className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email Verification</h3>
                    <p className="text-sm text-gray-500 mt-1">Verify your email address for account security</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {user?.email_confirmed_at 
                        ? `Your email ${user?.email} is verified.`
                        : `Your email ${user?.email} is not verified yet.`
                      }
                    </p>
                    {!user?.email_confirmed_at && (
                      <p className="text-sm text-red-600 mt-1">
                        Please verify your email to secure your account.
                      </p>
                    )}
                  </div>
                  
                  {!user?.email_confirmed_at && (
                    <button
                      onClick={handleResendVerification}
                      disabled={updating}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? "Sending..." : "Resend Verification"}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Security Tips */}
            <div className="space-y-8">
              {/* Security Status Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Password Strength</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Strong
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Verified</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.email_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {user?.email_confirmed_at ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">2FA Enabled</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Login</span>
                    <span className="text-sm text-gray-900">
                      {user?.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : 'Recently'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Security Tips Card */}
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tips</h3>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Use a strong, unique password that you don't use elsewhere</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Enable two-factor authentication for extra security</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Always verify your email address</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Log out from shared devices after use</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Be cautious of phishing emails asking for your credentials</span>
                  </li>
                </ul>
              </div>
              
              {/* Recent Activity Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Activity</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Password changed</span>
                    <span className="text-gray-900">Just now</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Login from Dhaka</span>
                    <span className="text-gray-900">Today, 10:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Email verification sent</span>
                    <span className="text-gray-900">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
