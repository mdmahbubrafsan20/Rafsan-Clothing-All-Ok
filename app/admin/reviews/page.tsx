"use client";

import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Star, Search, Filter, ThumbsUp, ThumbsDown, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, User, Package, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  product?: {
    name: string;
    image_url: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editComment, setEditComment] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          product:products(name, image_url),
          user:users(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "approved" && review.is_approved) ||
      (filterStatus === "pending" && !review.is_approved);
    
    const matchesRating = filterRating === "all" || 
      filterRating === review.rating.toString();

    return matchesSearch && matchesStatus && matchesRating;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  const handleApproveReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;
      loadReviews();
    } catch (error) {
      console.error("Failed to approve review:", error);
    }
  };

  const handleRejectReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: false })
        .eq('id', id);

      if (error) throw error;
      loadReviews();
    } catch (error) {
      console.error("Failed to reject review:", error);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const handleEditReview = async () => {
    if (!editingReview) return;
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ comment: editComment })
        .eq('id', editingReview.id);

      if (error) throw error;
      setShowEditModal(false);
      loadReviews();
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.is_approved).length,
    pending: reviews.filter(r => !r.is_approved).length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0",
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}.0</span>
      </div>
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Star className="h-8 w-8 mr-3 text-yellow-500" />
              Customer Reviews
            </h1>
            <p className="text-gray-600 mt-2">Manage and moderate customer product reviews</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Star className="h-10 w-10 text-yellow-100 bg-yellow-500 p-2 rounded-lg" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approved Reviews</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.approved}</p>
              </div>
              <ThumbsUp className="h-10 w-10 text-green-100 bg-green-500 p-2 rounded-lg" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Reviews</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.pending}</p>
              </div>
              <ThumbsDown className="h-10 w-10 text-orange-100 bg-orange-500 p-2 rounded-lg" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Average Rating</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.averageRating}</p>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${star <= parseFloat(stats.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <Star className="h-10 w-10 text-blue-100 bg-blue-500 p-2 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews by product, customer, or comment..."
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
              <select
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
              <span className="ml-3 text-gray-600">Loading reviews...</span>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No reviews found</h3>
              <p className="text-gray-500 mt-1">No reviews match your search criteria</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product & Customer</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedReviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                              {review.product?.image_url ? (
                                <img 
                                  src={review.product.image_url} 
                                  alt={review.product.name}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{review.product?.name || "Unknown Product"}</div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <User className="h-3 w-3 mr-1" />
                                {review.user?.name || review.user?.email || "Anonymous"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {renderStars(review.rating)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="max-w-xs">
                            <p className="text-gray-800 line-clamp-2">{review.comment}</p>
                            {review.comment.length > 100 && (
                              <button 
                                className="text-yellow-600 text-sm mt-1"
                                onClick={() => {
                                  setEditingReview(review);
                                  setEditComment(review.comment);
                                  setShowEditModal(true);
                                }}
                              >
                                Read more
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="font-medium">{new Date(review.created_at).toLocaleDateString()}</div>
                            <div className="text-gray-500">{new Date(review.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            review.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {review.is_approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {!review.is_approved && (
                              <button
                                onClick={() => handleApproveReview(review.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Approve"
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </button>
                            )}
                            {review.is_approved && (
                              <button
                                onClick={() => handleRejectReview(review.id)}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                                title="Reject"
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setEditingReview(review);
                                setEditComment(review.comment);
                                setShowEditModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredReviews.length)}</span> of{" "}
                    <span className="font-medium">{filteredReviews.length}</span> reviews
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-lg ${currentPage === page ? 'bg-yellow-600 text-white' : 'border border-gray-300'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Review Modal */}
      {showEditModal && editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Review</h3>
            <div className="space-y-6">
              {/* Review Info */}
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  {editingReview.product?.image_url ? (
                    <img 
                      src={editingReview.product.image_url} 
                      alt={editingReview.product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{editingReview.product?.name || "Unknown Product"}</h4>
                  <div className="flex items-center mt-1">
                    {renderStars(editingReview.rating)}
                    <span className="ml-4 text-sm text-gray-500">
                      by {editingReview.user?.name || editingReview.user?.email || "Anonymous"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {new Date(editingReview.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Edit Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Comment</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-32"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Enter review comment..."
                />
                <div className="text-sm text-gray-500 mt-2">
                  {editComment.length} characters
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-4">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    editingReview.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {editingReview.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {!editingReview.is_approved && (
                    <button
                      onClick={() => {
                        handleApproveReview(editingReview.id);
                        setShowEditModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm"
                    >
                      Approve
                    </button>
                  )}
                  {editingReview.is_approved && (
                    <button
                      onClick={() => {
                        handleRejectReview(editingReview.id);
                        setShowEditModal(false);
                      }}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium text-sm"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditReview}
                className="px-4 py-2.5 bg-yellow-600 text-white rounded-lg font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}