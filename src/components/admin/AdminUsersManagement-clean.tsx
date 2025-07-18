"use client";

import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiZap,
  FiTarget,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
  FiBookOpen,
  FiEye,
  FiFilter,
  FiBarChart,
  FiDownload,
  FiTrendingUp,
  FiActivity,
  FiX,
} from "react-icons/fi";

type ViewMode = "dashboard" | "analytics" | "export";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  xp: number;
  createdAt: string;
  enrollments?: number;
}

export const AdminUsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");

  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          setFilteredUsers(data);
        } else {
          console.error("Failed to fetch users");
          // Fallback to sample data for development
          const sampleUsers: User[] = [
            {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              role: "USER",
              xp: 250,
              enrollments: 5,
              createdAt: new Date("2024-01-15").toISOString(),
            },
            {
              id: "2",
              name: "Admin User",
              email: "admin@example.com",
              role: "ADMIN",
              xp: 1500,
              enrollments: 20,
              createdAt: new Date("2023-10-05").toISOString(),
            },
            {
              id: "3",
              name: "Emily Johnson",
              email: "emily@example.com",
              role: "USER",
              xp: 420,
              enrollments: 8,
              createdAt: new Date("2024-02-20").toISOString(),
            },
          ];
          setUsers(sampleUsers);
          setFilteredUsers(sampleUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and search logic
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !filterRole || user.role === filterRole;
      return matchesSearch && matchesRole;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof User] as string | number;
      let bValue: string | number = b[sortBy as keyof User] as string | number;

      // Handle null/undefined values
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      // Convert to lowercase for string comparison
      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchTerm, filterRole, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const viewUser = (user: User) => {
    alert(
      `Viewing: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nXP: ${user.xp}`
    );
  };

  const editUser = (user: User) => {
    alert(`Editing user: ${user.name}`);
  };

  const deleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/users?id=${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setUsers(users.filter((u) => u.id !== userId));
        } else {
          alert("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user");
      }
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "User" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-xl border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  User Manager
                </h1>
                <p className="text-gray-600 mt-1">
                  AI-Powered User Management System with Advanced Analytics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Tabs */}
              <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode("dashboard")}
                  className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === "dashboard"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiUsers className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => setViewMode("analytics")}
                  className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === "analytics"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiBarChart className="w-4 h-4" />
                  Analytics
                </button>
                <button
                  onClick={() => setViewMode("export")}
                  className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === "export"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiDownload className="w-4 h-4" />
                  Export
                </button>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Dashboard View */}
        {viewMode === "dashboard" && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading users...</span>
              </div>
            ) : (
              <div>
                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users with AI-powered suggestions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900 min-w-[200px]"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* User Table */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          User Management
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Showing {startIndex + 1}-
                          {Math.min(
                            startIndex + itemsPerPage,
                            filteredUsers.length
                          )}{" "}
                          of {filteredUsers.length} users
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                            <button
                              onClick={() => handleSort("name")}
                              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                              User Info
                              {sortBy === "name" &&
                                (sortOrder === "asc" ? (
                                  <FiChevronUp className="w-4 h-4" />
                                ) : (
                                  <FiChevronDown className="w-4 h-4" />
                                ))}
                            </button>
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                            <button
                              onClick={() => handleSort("role")}
                              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                              Role
                              {sortBy === "role" &&
                                (sortOrder === "asc" ? (
                                  <FiChevronUp className="w-4 h-4" />
                                ) : (
                                  <FiChevronDown className="w-4 h-4" />
                                ))}
                            </button>
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                            <button
                              onClick={() => handleSort("xp")}
                              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                              XP
                              {sortBy === "xp" &&
                                (sortOrder === "asc" ? (
                                  <FiChevronUp className="w-4 h-4" />
                                ) : (
                                  <FiChevronDown className="w-4 h-4" />
                                ))}
                            </button>
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                            <button
                              onClick={() => handleSort("enrollments")}
                              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                              Enrollments
                              {sortBy === "enrollments" &&
                                (sortOrder === "asc" ? (
                                  <FiChevronUp className="w-4 h-4" />
                                ) : (
                                  <FiChevronDown className="w-4 h-4" />
                                ))}
                            </button>
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                            <button
                              onClick={() => handleSort("createdAt")}
                              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                              Created
                              {sortBy === "createdAt" &&
                                (sortOrder === "asc" ? (
                                  <FiChevronUp className="w-4 h-4" />
                                ) : (
                                  <FiChevronDown className="w-4 h-4" />
                                ))}
                            </button>
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginatedUsers.map((user, index) => (
                          <tr
                            key={user.id}
                            className="hover:bg-blue-50 transition-colors group"
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                  {startIndex + index + 1}
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-gray-900">
                                    {user.name || user.email.split("@")[0]}
                                  </h4>
                                  <p className="text-gray-600 mt-1">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                                  user.role === "ADMIN"
                                    ? "bg-red-100 text-red-800 border border-red-200"
                                    : "bg-green-100 text-green-800 border border-green-200"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                  {user.xp}
                                </span>
                                <span className="text-sm text-gray-500 uppercase tracking-wide">
                                  XP
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                  {user.enrollments || 0}
                                </span>
                                <span className="text-sm text-gray-500">
                                  courses
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-gray-600 font-medium">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => viewUser(user)}
                                  className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all shadow-sm hover:shadow-md"
                                  title="View User"
                                >
                                  <FiEye className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => editUser(user)}
                                  className="p-3 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all shadow-sm hover:shadow-md"
                                  title="Edit User"
                                >
                                  <FiEdit2 className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all shadow-sm hover:shadow-md"
                                  title="Delete User"
                                >
                                  <FiTrash2 className="w-5 h-5" />
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
                    <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 font-medium">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(
                            startIndex + itemsPerPage,
                            filteredUsers.length
                          )}{" "}
                          of {filteredUsers.length} results
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Previous
                          </button>

                          <div className="flex items-center gap-2">
                            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                              const pageNum = i + 1;
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    currentPage === pageNum
                                      ? "bg-blue-600 text-white shadow-md"
                                      : "border border-gray-300 hover:bg-white"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics View */}
        {viewMode === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                User Growth Trends
              </h3>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <FiTrendingUp className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">
                    Advanced Analytics Chart
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export View */}
        {viewMode === "export" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiDownload className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Export User Data
              </h3>
              <p className="text-gray-600">
                Generate comprehensive reports and export user data.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Add New User
                </h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-6 py-3 text-gray-600 font-bold hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Create User
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
