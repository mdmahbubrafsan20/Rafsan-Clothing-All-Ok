"use client";

import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import ImageUploader from "@/components/ImageUploader";
import { Package, Plus, Search, Filter, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Loader2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Product, Category, fetchProducts, deleteProduct, getProductStats, getAllCategories, createProduct, updateProduct } from "@/lib/products";
import { uploadProductImages } from "@/lib/upload";
import { supabase } from "@/lib/supabase";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({ total: 0, outOfStock: 0, lowStock: 0, categories: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    original_price: 0,
    category_id: "",
    stock: 0,
    sku: "",
    is_active: true,
    show_on_homepage: true,
    // Brand-quality fields
    fabric: "",
    sizes: [] as string[],
    colors: [] as Array<{ name: string; value: string }>,
    size_chart: { description: "", unit: "inches", headers: ["Size", "Chest", "Waist", "Length"], rows: [] as string[][] },
    product_details: { overview: "", fabric_care: "", size_fit: "", shipping_returns: "" },
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [productsData, categoriesData, statsData] = await Promise.all([
        fetchProducts(),
        getAllCategories(),
        getProductStats(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const success = await deleteProduct(id);
    if (success) {
      setProducts(products.filter(p => p.id !== id));
      // Refresh stats
      const newStats = await getProductStats();
      setStats(newStats);
    }
  };

  const handleAddProduct = async () => {
    if (!formData.name || formData.price <= 0) {
      alert("Please fill in required fields (name and price)");
      return;
    }
    if (selectedFiles.length === 0) {
      alert("Please upload at least 1 product image.");
      return;
    }

    setUploading(true);
    try {
      // Upload images if any
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadProductImages(selectedFiles);
        if (imageUrls.length === 0) {
          alert("Failed to upload images. Please try again.");
          setUploading(false);
          return;
        }
      }

      // Create product with images array
      const productData = {
        ...formData,
        images: imageUrls,
        // Keep image_url for backward compatibility (use first image if available)
        image_url: imageUrls[0],
      };

      const newProduct = await createProduct(productData);
      if (newProduct) {
        setProducts([newProduct, ...products]);
        setShowAddModal(false);
        resetForm();
        // Refresh stats
        const newStats = await getProductStats();
        setStats(newStats);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct || !formData.name || formData.price <= 0) return;

    setUploading(true);
    try {
      // Upload new images if any
      let newImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        newImageUrls = await uploadProductImages(selectedFiles);
        // Continue even if some uploads fail, but warn user
        if (newImageUrls.length === 0 && selectedFiles.length > 0) {
          alert("Warning: No new images were uploaded. Continuing with existing images.");
        }
      }

      // Combine existing images with new ones
      const allImages = [...existingImages, ...newImageUrls];

      // Update product with images array
      const updateData = {
        ...formData,
        images: allImages,
        // Keep image_url for backward compatibility (use first image if available)
        image_url: allImages.length > 0 ? allImages[0] : undefined,
      };

      const updatedProduct = await updateProduct(editingProduct.id, updateData);
      if (updatedProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
        setShowEditModal(false);
        setEditingProduct(null);
        resetForm();
        // Refresh stats
        const newStats = await getProductStats();
        setStats(newStats);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      original_price: 0,
      category_id: "",
      stock: 0,
      sku: "",
      is_active: true,
      show_on_homepage: true,
      // Brand-quality fields
      fabric: "",
      sizes: [],
      colors: [],
      size_chart: { description: "", unit: "inches", headers: ["Size", "Chest", "Waist", "Length"], rows: [] },
      product_details: { overview: "", fabric_care: "", size_fit: "", shipping_returns: "" },
    });
    setSelectedFiles([]);
    setExistingImages([]);
    setUploading(false);
  };

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      original_price: product.original_price || 0,
      category_id: product.category_id || "",
      stock: product.stock || 0,
      sku: product.sku || "",
      is_active: product.is_active ?? true,
      show_on_homepage: product.show_on_homepage !== false,
      // Brand-quality fields
      fabric: product.fabric || "",
      sizes: product.sizes || [],
      colors: product.colors || [],
      size_chart: product.size_chart || { description: "", unit: "inches", headers: ["Size", "Chest", "Waist", "Length"], rows: [] },
      product_details: product.product_details || { overview: "", fabric_care: "", size_fit: "", shipping_returns: "" },
    });
    // Set existing images from product.images or fallback to image_url
    const existing = product.images || (product.image_url ? [product.image_url] : []);
    setExistingImages(existing);
    setSelectedFiles([]);
    setShowEditModal(true);
  };

  const getStatusColor = (stock: number) => {
    if (stock === 0) return "bg-red-100 text-red-800";
    if (stock <= 10) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-900 mx-auto" />
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 break-words">Product Management</h1>
              <p className="text-gray-600 mt-2">
                Manage your product catalog, inventory, and pricing
              </p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-2">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or description..."
                className="bg-transparent border-none outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.outOfStock}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Package className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.lowStock}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.categories}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Products</h3>
            <p className="text-sm text-gray-500 mt-1">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProducts.map((product) => {
                  const category = categories.find(c => c.id === product.category_id);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              SKU: {product.sku || `PROD-${product.id.slice(0, 8)}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {category?.name || "Uncategorized"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ৳{product.price.toLocaleString()}
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-xs text-gray-500 line-through ml-2">
                              ৳{product.original_price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.stock || 0)}`}>
                          {getStatusText(product.stock || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === pageNum
                          ? "bg-gray-900 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Product</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳) *</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (৳)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={formData.original_price}
                        onChange={(e) => setFormData({...formData, original_price: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                    <ImageUploader
                      onFilesChange={handleFilesChange}
                      existingImages={[]}
                      maxFiles={10}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload multiple images for product gallery. First image will be used as main product image.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      className="h-4 w-4 text-gray-900 rounded"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                      Product is active
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="show_on_homepage"
                      className="h-4 w-4 text-gray-900 rounded"
                      checked={formData.show_on_homepage}
                      onChange={(e) =>
                        setFormData({ ...formData, show_on_homepage: e.target.checked })
                      }
                    />
                    <label htmlFor="show_on_homepage" className="ml-2 text-sm text-gray-700">
                      Show on homepage grids
                    </label>
                  </div>

                  {/* Brand-quality: Fabric */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fabric Material</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g. Premium Cotton Blend"
                      value={formData.fabric}
                      onChange={(e) => setFormData({...formData, fabric: e.target.value})}
                    />
                  </div>

                  {/* Brand-quality: Sizes Tag Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.sizes.map((size, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm flex items-center gap-1">
                          {size}
                          <button type="button" onClick={() => {
                            const newSizes = formData.sizes.filter((_, i) => i !== idx);
                            setFormData({...formData, sizes: newSizes});
                          }} className="ml-1 hover:text-gray-300">×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Type size (e.g. S, M, L, XL)"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val && !formData.sizes.includes(val)) {
                              setFormData({...formData, sizes: [...formData.sizes, val]});
                            }
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <button type="button" onClick={(e) => {
                        const input = (e.target as HTMLButtonElement).parentElement?.querySelector('input') as HTMLInputElement;
                        if (input) {
                          const val = input.value.trim();
                          if (val && !formData.sizes.includes(val)) {
                            setFormData({...formData, sizes: [...formData.sizes, val]});
                            input.value = '';
                          }
                        }
                      }} className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm">Add</button>
                    </div>
                  </div>

                  {/* Brand-quality: Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Colors</label>
                    <div className="space-y-2 mb-2">
                      {formData.colors.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input type="color" value={color.value} onChange={(e) => {
                            const newColors = [...formData.colors];
                            newColors[idx] = { ...color, value: e.target.value };
                            setFormData({...formData, colors: newColors});
                          }} className="w-10 h-10 rounded cursor-pointer border" />
                          <input type="text" value={color.name} onChange={(e) => {
                            const newColors = [...formData.colors];
                            newColors[idx] = { ...color, name: e.target.value };
                            setFormData({...formData, colors: newColors});
                          }} placeholder="Color name" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          <button type="button" onClick={() => {
                            setFormData({...formData, colors: formData.colors.filter((_, i) => i !== idx)});
                          }} className="text-red-500 hover:text-red-700 px-2">✕</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => {
                      setFormData({...formData, colors: [...formData.colors, { name: "", value: "#000000" }]});
                    }} className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm">
                      + Add Color
                    </button>
                  </div>

                  {/* Brand-quality: Size Chart */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size Chart</label>
                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Fit Description</label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Asian fit, order one size up"
                            value={formData.size_chart.description}
                            onChange={(e) => setFormData({...formData, size_chart: { ...formData.size_chart, description: e.target.value }})} />
                        </div>
                        <div className="w-32">
                          <label className="text-xs text-gray-500">Unit</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            value={formData.size_chart.unit}
                            onChange={(e) => setFormData({...formData, size_chart: { ...formData.size_chart, unit: e.target.value }})}>
                            <option value="inches">inches</option>
                            <option value="cm">cm</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Column Headers (comma separated)</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Size, Chest, Waist, Length"
                          defaultValue={formData.size_chart.headers.join(", ")}
                          onBlur={(e) => {
                            const headers = e.target.value.split(",").map(h => h.trim()).filter(Boolean);
                            setFormData({...formData, size_chart: { ...formData.size_chart, headers }});
                            e.target.value = headers.join(", ");
                          }} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Measurement Rows (one per line: Size,Val1,Val2,Val3...)</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={4}
                          placeholder={'S,36,28,26\nM,38,30,27\nL,40,32,28\nXL,42,34,29'}
                          defaultValue={formData.size_chart.rows.map(r => r.join(",")).join("\n")}
                          onBlur={(e) => {
                            const rows = e.target.value.split("\n").map(line =>
                              line.split(",").map(v => v.trim()).filter(Boolean)
                            ).filter(row => row.length > 0);
                            setFormData({...formData, size_chart: { ...formData.size_chart, rows }});
                          }} />
                      </div>
                    </div>
                  </div>

                  {/* Brand-quality: Product Details (4 sections) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Details</label>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">Overview</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2}
                          placeholder="General product description..."
                          value={formData.product_details.overview}
                          onChange={(e) => setFormData({...formData, product_details: { ...formData.product_details, overview: e.target.value }})} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Fabric & Care</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2}
                          placeholder="Machine wash cold. Tumble dry low. Do not bleach..."
                          value={formData.product_details.fabric_care}
                          onChange={(e) => setFormData({...formData, product_details: { ...formData.product_details, fabric_care: e.target.value }})} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Size & Fit</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2}
                          placeholder="Model is 5&apos;10&apos;&apos; (178cm) wearing size M. Asian fit - order one size up for loose fit."
                          value={formData.product_details.size_fit}
                          onChange={(e) => setFormData({...formData, product_details: { ...formData.product_details, size_fit: e.target.value }})} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Shipping & Returns</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2}
                          placeholder="Free delivery on orders over ৳1000. 7-day easy returns..."
                          value={formData.product_details.shipping_returns}
                          onChange={(e) => setFormData({...formData, product_details: { ...formData.product_details, shipping_returns: e.target.value }})} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddProduct}
                    disabled={uploading}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      'Add Product'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Product</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳) *</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (৳)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={formData.original_price}
                        onChange={(e) => setFormData({...formData, original_price: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                    <ImageUploader
                      onFilesChange={handleFilesChange}
                      existingImages={existingImages}
                      onRemoveExistingImage={handleRemoveExistingImage}
                      maxFiles={10}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit_is_active"
                      className="h-4 w-4 text-gray-900 rounded"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    />
                    <label htmlFor="edit_is_active" className="ml-2 text-sm text-gray-700">
                      Product is active
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit_show_on_homepage"
                      className="h-4 w-4 text-gray-900 rounded"
                      checked={formData.show_on_homepage}
                      onChange={(e) =>
                        setFormData({ ...formData, show_on_homepage: e.target.checked })
                      }
                    />
                    <label htmlFor="edit_show_on_homepage" className="ml-2 text-sm text-gray-700">
                      Show on homepage grids
                    </label>
                  </div>

                  {/* Brand-quality: Fabric */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fabric Material</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g. Premium Cotton Blend"
                      value={formData.fabric}
                      onChange={(e) => setFormData({...formData, fabric: e.target.value})}
                    />
                  </div>

                  {/* Brand-quality: Sizes Tag Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.sizes.map((size, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm flex items-center gap-1">
                          {size}
                          <button type="button" onClick={() => {
                            const newSizes = formData.sizes.filter((_, i) => i !== idx);
                            setFormData({...formData, sizes: newSizes});
                          }} className="ml-1 hover:text-gray-300">x</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Type size (e.g. S, M, L, XL)"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val && !formData.sizes.includes(val)) {
                              setFormData({...formData, sizes: [...formData.sizes, val]});
                            }
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <button type="button" onClick={(e) => {
                        const input = (e.target as HTMLButtonElement).parentElement?.querySelector('input') as HTMLInputElement;
                        if (input) {
                          const val = input.value.trim();
                          if (val && !formData.sizes.includes(val)) {
                            setFormData({...formData, sizes: [...formData.sizes, val]});
                            input.value = '';
                          }
                        }
                      }} className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm">Add</button>
                    </div>
                  </div>

                  {/* Brand-quality: Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Colors</label>
                    <div className="space-y-2 mb-2">
                      {formData.colors.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input type="color" value={color.value} onChange={(e) => {
                            const newColors = [...formData.colors];
                            newColors[idx] = { ...color, value: e.target.value };
                            setFormData({...formData, colors: newColors});
                          }} className="w-10 h-10 rounded cursor-pointer border" />
                          <input type="text" value={color.name} onChange={(e) => {
                            const newColors = [...formData.colors];
                            newColors[idx] = { ...color, name: e.target.value };
                            setFormData({...formData, colors: newColors});
                          }} placeholder="Color name" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          <button type="button" onClick={() => {
                            setFormData({...formData, colors: formData.colors.filter((_, i) => i !== idx)});
                          }} className="text-red-500 hover:text-red-700 px-2">x</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => {
                      setFormData({...formData, colors: [...formData.colors, { name: "", value: "#000000" }]});
                    }} className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm">
                      + Add Color
                    </button>
                  </div>

                  {/* Brand-quality: Size Chart */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size Chart</label>
                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Fit Description</label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Asian fit, order one size up"
                            value={formData.size_chart.description}
                            onChange={(e) => setFormData({...formData, size_chart: { ...formData.size_chart, description: e.target.value }})} />
                        </div>
                        <div className="w-32">
                          <label className="text-xs text-gray-500">Unit</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            value={formData.size_chart.unit}
                            onChange={(e) => setFormData({...formData, size_chart: { ...formData.size_chart, unit: e.target.value }})}>
                            <option value="inches">inches</option>
                            <option value="cm">cm</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Column Headers (comma separated)</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Size, Chest, Waist, Length"
                          defaultValue={formData.size_chart.headers.join(", ")}
                          onBlur={(e) => {
                            const headers = e.target.value.split(",").map(h => h.trim()).filter(Boolean);
                            setFormData({...formData, size_chart: { ...formData.size_chart, headers }});
                            e.target.value = headers.join(", ");
                          }} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Measurement Rows (one per line: Size,Val1,Val2,Val3...)</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={4}
                          placeholder={"S,36,28,26\nM,38,30,27\nL,40,32,28\nXL,42,34,29"}
                          defaultValue={formData.size_chart.rows.map(r => r.join(",")).join("\n")}
                          onBlur={(e) => {
                            const rows = e.target.value.split("\n").map(line =>
                              line.split(",").map(v => v.trim()).filter(Boolean)
                            ).filter(row => row.length > 0);
                            setFormData({...formData, size_chart: { ...formData.size_chart, rows }});
                          }} />
                      </div>
                    </div>
                  </div>

                  {/* Brand-quality: Product Details (4 sections) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Details</label>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">Overview</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2}
                          placeholder="General product description..."
                          value={formData.product_details.overview}
                          onChange={(e) => setFormData({...formData, product_details: { ...formData.product_details, overview: e.target.value }})} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Fabric and Care</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2}
                          placeholder="Machine wash cold. Tumble dry low. Do not bleach..."
                          value={formData.product_details.fabric_care}
                          onChange={(e) => setFormData({...formData, product_details: { ...formData.product_details, fabric_care: e.target.value }})} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Size and Fit</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2}
                          placeholder="Model is 5&apos;10&apos;&apos; (178cm) wearing size M. Asian fit..."
                          value={formData.product_details.size_fit}
                          onChange={(e) => setFormData({...formData, product_details: { ...formData.product_details, size_fit: e.target.value }})} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Shipping and Returns</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2}
                          placeholder="Free delivery on orders over 1000 BDT. 7-day easy returns..."
                          value={formData.product_details.shipping_returns}
                          onChange={(e) => setFormData({...formData, product_details: { ...formData.product_details, shipping_returns: e.target.value }})} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditProduct}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center justify-center min-w-[120px]"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Product'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}