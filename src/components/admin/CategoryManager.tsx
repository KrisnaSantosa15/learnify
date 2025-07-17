"use client";

import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiTag,
  FiCheck,
  FiAlertCircle,
  FiGrid,
  FiList,
  FiSearch,
} from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    quizzes: number;
  };
}

const EMOJI_ICONS = [
  "💻",
  "🌐",
  "📊",
  "🗄️",
  "⚙️",
  "📱",
  "🎨",
  "🚀",
  "🐍",
  "⚛️",
  "🔧",
  "☁️",
  "🤖",
  "📚",
  "🎯",
  "🔥",
  "⭐",
  "💡",
  "🎮",
  "📈",
  "🔒",
  "🌟",
  "🏆",
  "🎪",
  "🎭",
  "🎵",
  "🎸",
  "🎹",
  "🎤",
  "⚡",
];

const COLOR_PALETTE = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
  "#F59E0B",
  "#DC2626",
  "#7C3AED",
  "#059669",
  "#D97706",
  "#BE185D",
  "#4338CA",
];

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Create/Edit form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "💻",
    color: "#3B82F6",
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCategories();
        setShowCreateModal(false);
        setFormData({
          name: "",
          description: "",
          icon: "💻",
          color: "#3B82F6",
        });
        showSuccessMessage("🎉 Category created successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
          icon: category.icon,
          color: category.color,
        }),
      });

      if (response.ok) {
        await fetchCategories();
        setEditingCategory(null);
        showSuccessMessage("✨ Category updated successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete "${categoryName}"? This will affect all quizzes in this category.`
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCategories();
        showSuccessMessage("🗑️ Category deleted successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const saveEdit = () => {
    if (editingCategory) {
      handleUpdateCategory(editingCategory);
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    fetchCategories(); // Reset changes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-xl border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎨 Category Manager
              </h1>
              <p className="text-gray-600 mt-2">
                Organize your content with beautiful, customizable categories
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                Create Category
              </button>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="flex items-center justify-between mt-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 text-gray-900 placeholder-gray-500 bg-white"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length}
                </p>
                <p className="text-sm text-gray-500">Total Categories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {categories.reduce(
                    (sum, cat) => sum + (cat._count?.quizzes || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-gray-500">Total Quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Content */}
      <div className="px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`
                  bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden
                  hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                  ${viewMode === "list" ? "flex items-center p-6" : ""}
                `}
                style={{
                  borderLeft: `4px solid ${category.color}`,
                }}
              >
                {viewMode === "grid" ? (
                  // Grid View
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          {editingCategory?.id === category.id ? (
                            <select
                              value={editingCategory.icon}
                              onChange={(e) =>
                                setEditingCategory({
                                  ...editingCategory,
                                  icon: e.target.value,
                                })
                              }
                              className="text-2xl bg-transparent border-none outline-none cursor-pointer"
                            >
                              {EMOJI_ICONS.map((emoji, index) => (
                                <option key={`${emoji}-${index}`} value={emoji}>
                                  {emoji}
                                </option>
                              ))}
                            </select>
                          ) : (
                            category.icon
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {editingCategory?.id === category.id ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(category)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteCategory(category.id, category.name)
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {editingCategory?.id === category.id ? (
                        <>
                          <input
                            value={editingCategory.name}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                name: e.target.value,
                              })
                            }
                            className="text-xl font-bold text-gray-900 bg-white border-b-2 border-blue-200 focus:border-blue-500 outline-none w-full px-2 py-1"
                          />
                          <textarea
                            value={editingCategory.description || ""}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                description: e.target.value,
                              })
                            }
                            className="text-gray-900 bg-white border border-gray-200 rounded-lg p-2 w-full resize-none placeholder-gray-500"
                            rows={2}
                            placeholder="Category description..."
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Color:
                            </span>
                            <div className="flex gap-1">
                              {COLOR_PALETTE.slice(0, 6).map((color, index) => (
                                <button
                                  key={`${color}-${index}`}
                                  onClick={() =>
                                    setEditingCategory({
                                      ...editingCategory,
                                      color,
                                    })
                                  }
                                  className={`w-6 h-6 rounded-full border-2 ${
                                    editingCategory.color === color
                                      ? "border-gray-800"
                                      : "border-gray-300"
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold text-gray-900">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {category.description || "No description"}
                          </p>
                        </>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <FiTag className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {category._count?.quizzes || 0} quizzes
                          </span>
                        </div>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <>
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {category.description || "No description"}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">
                            {category._count?.quizzes || 0}
                          </p>
                          <p className="text-xs text-gray-500">quizzes</p>
                        </div>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCategory(category.id, category.name)
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredCategories.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "No categories match your search."
                : "Get started by creating your first category."}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Category
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  🎨 Create New Category
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    📝 Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                    placeholder="e.g. Advanced JavaScript"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    📄 Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 bg-white"
                    rows={3}
                    placeholder="Brief description of this category..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    🎭 Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {EMOJI_ICONS.map((emoji, index) => (
                      <button
                        key={`${emoji}-${index}`}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, icon: emoji })
                        }
                        className={`p-3 rounded-lg text-2xl transition-all ${
                          formData.icon === emoji
                            ? "bg-blue-100 border-2 border-blue-500 scale-110"
                            : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    🎨 Color Theme
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {COLOR_PALETTE.map((color, index) => (
                      <button
                        key={`${color}-${index}`}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-12 h-12 rounded-xl border-4 transition-all ${
                          formData.color === color
                            ? "border-gray-800 scale-110"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Preview:
                  </p>
                  <div
                    className="bg-white p-4 rounded-lg border-l-4 flex items-center gap-3"
                    style={{ borderLeftColor: formData.color }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${formData.color}20` }}
                    >
                      {formData.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {formData.name || "Category Name"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formData.description || "Category description"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.name.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
