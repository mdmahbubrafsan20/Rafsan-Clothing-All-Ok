"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { MapPin, Plus, Edit, Trash2, Check, Home, Building, X } from "lucide-react";

type Address = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "Bangladesh",
    postal_code: "",
    is_default: false,
  });

  // Fetch addresses data
  useEffect(() => {
    async function fetchAddressesData() {
      try {
        setLoading(true);
        
        // Get current user - DashboardLayout already ensures user exists
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        // User should exist because DashboardLayout already authenticated
        if (!authUser) {
          console.error("AddressesPage: Unexpected - no user found but DashboardLayout should have redirected");
          setLoading(false);
          return;
        }
        setUser(authUser);
        
        // Fetch addresses
        const { data: addressesData, error: addressesError } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", authUser.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false });

        if (addressesError) {
          // If table doesn't exist, we'll show empty state
          if (addressesError.code === '42P01') {
            console.log("Addresses table doesn't exist yet");
            setAddresses([]);
            return;
          }
          throw addressesError;
        }

        if (addressesData) {
          setAddresses(addressesData);
        }
        
      } catch (err: any) {
        console.error("Error loading addresses:", err);
        setError(err.message || "Failed to load addresses. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchAddressesData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      full_name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "Bangladesh",
      postal_code: "",
      is_default: false,
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.full_name || !formData.phone || !formData.address_line1 || !formData.city || !formData.postal_code) {
        setError("Please fill in all required fields.");
        return;
      }

      // If setting as default, first unset any existing default
      if (formData.is_default) {
        // Find current default address
        const currentDefault = addresses.find(addr => addr.is_default);
        if (currentDefault) {
          await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("id", currentDefault.id);
        }
      }

      if (editingAddress) {
        // Update existing address
        const { data, error: updateError } = await supabase
          .from("addresses")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingAddress.id)
          .select();

        if (updateError) throw updateError;

        // Update local state
        setAddresses(prev =>
          prev.map(addr =>
            addr.id === editingAddress.id ? { ...data[0] } : addr
          )
        );
      } else {
        // Add new address
        const { data, error: insertError } = await supabase
          .from("addresses")
          .insert([
            {
              ...formData,
              user_id: user.id,
            }
          ])
          .select();

        if (insertError) throw insertError;

        // Add to local state
        setAddresses(prev => [data[0], ...prev]);
      }

      resetForm();
    } catch (err: any) {
      console.error("Error saving address:", err);
      setError(err.message || "Failed to save address. Please try again.");
    }
  };

  // Handle edit address
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      state: address.state || "",
      country: address.country,
      postal_code: address.postal_code,
      is_default: address.is_default,
    });
    setShowAddForm(true);
  };

  // Handle delete address
  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressId);

      if (error) throw error;

      // Remove from local state
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    } catch (err: any) {
      console.error("Error deleting address:", err);
      setError("Failed to delete address. Please try again.");
    }
  };

  // Handle set as default
  const handleSetDefault = async (addressId: string) => {
    try {
      // First, unset all defaults
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      // Then set the selected address as default
      const { error } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", addressId);

      if (error) throw error;

      // Update local state
      setAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          is_default: addr.id === addressId
        }))
      );
    } catch (err: any) {
      console.error("Error setting default address:", err);
      setError("Failed to set default address. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your addresses...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
              <p className="text-gray-600 mt-2">Manage your delivery addresses</p>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Add/Edit Address Form */}
          {showAddForm && (
            <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="+880 1XXX XXXXXX"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="House No, Road No, Area"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Apartment, Suite, Landmark"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Dhaka"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Division (Optional)
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Dhaka Division"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      required
                    >
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="1200"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_default"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                    Set as default shipping address
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {editingAddress ? "Update Address" : "Save Address"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Addresses List */}
          {addresses.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Addresses</h3>
              <p className="text-gray-500 mb-6">
                You haven't saved any addresses yet. Add your first address to get started.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`bg-white rounded-xl border shadow-sm p-6 ${
                    address.is_default
                      ? "border-gray-900 border-2"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {address.is_default ? (
                        <Home className="h-5 w-5 text-gray-900" />
                      ) : (
                        <Building className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {address.full_name}
                        </h3>
                        {address.is_default && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded mt-1">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900">{address.address_line1}</p>
                        {address.address_line2 && (
                          <p className="text-gray-900">{address.address_line2}</p>
                        )}
                        <p className="text-gray-600">
                          {address.city}, {address.state && `${address.state}, `}
                          {address.country} - {address.postal_code}
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-600">
                      <p className="text-sm">Phone: {address.phone}</p>
                      <p className="text-sm mt-1">Added: {formatDate(address.created_at)}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      {!address.is_default ? (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
                        >
                          <Check className="h-4 w-4" />
                          Set as Default
                        </button>
                      ) : (
                        <p className="text-sm text-gray-900 font-medium">
                          ✓ Default shipping address
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Your default address will be used for all future orders unless you choose a different address at checkout.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}