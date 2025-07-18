"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiBarChart,
  FiDownload,
  FiTrendingUp,
  FiX,
  FiActivity,
  FiStar,
  FiBookOpen,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type ViewMode = "dashboard" | "analytics" | "export";

interface User {
  id: string;
  name: string | null;
  email: string;
  username?: string;
  role: string;
  level?: number;
  xp: number;
  streak?: number;
  plan?: string;
  enrollments?: number;
  submissions?: number;
  quizAttempts?: number;
  achievements?: number;
  lastActive?: string;
  createdAt: string;
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
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "USER",
    plan: "FREE",
  });
  const [resetPassword, setResetPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");

  // Analytics data generation
  const generateAnalyticsData = () => {
    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    // User growth data
    const userGrowthData = last30Days.map((date, index) => ({
      date: date.toISOString().split("T")[0],
      users: Math.floor(users.length * ((index + 1) / 30)) + Math.random() * 10,
      activeUsers:
        Math.floor(users.length * ((index + 1) / 30) * 0.7) + Math.random() * 5,
    }));

    // Plan distribution
    const planCounts = users.reduce((acc, user) => {
      acc[user.plan || "FREE"] = (acc[user.plan || "FREE"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const planDistribution = Object.entries(planCounts).map(
      ([plan, count]) => ({
        name: plan,
        value: count,
        percentage: Math.round((count / users.length) * 100),
      })
    );

    // Role distribution
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const roleDistribution = Object.entries(roleCounts).map(
      ([role, count]) => ({
        name: role,
        value: count,
        percentage: Math.round((count / users.length) * 100),
      })
    );

    // XP distribution
    const xpRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-500", min: 101, max: 500 },
      { range: "501-1000", min: 501, max: 1000 },
      { range: "1001-2000", min: 1001, max: 2000 },
      { range: "2000+", min: 2001, max: Infinity },
    ];

    const xpDistribution = xpRanges.map(({ range, min, max }) => ({
      range,
      count: users.filter(
        (user) => (user.xp || 0) >= min && (user.xp || 0) <= max
      ).length,
    }));

    return {
      userGrowthData,
      planDistribution,
      roleDistribution,
      xpDistribution,
    };
  };

  // Export functions
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Username",
      "Role",
      "Plan",
      "XP",
      "Level",
      "Created At",
    ];
    const csvData = users.map((user) => [
      user.id,
      user.name || "",
      user.email,
      user.username || "",
      user.role,
      user.plan || "FREE",
      user.xp || 0,
      user.level || 1,
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    const analyticsElement = document.getElementById("analytics-dashboard");
    if (!analyticsElement) return;

    try {
      const canvas = await html2canvas(analyticsElement, {
        height: analyticsElement.scrollHeight,
        width: analyticsElement.scrollWidth,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`user-analytics-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

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
    setSelectedUser(user);
    setShowViewUserModal(true);
  };

  const editUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      username: user.username || "",
      password: "", // Don't populate password for security
      role: user.role,
      plan: user.plan || "FREE",
    });
    setResetPassword(false); // Reset password checkbox
    setShowEditUserModal(true);
  };

  const deleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setUsers(users.filter((u) => u.id !== userId));
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user");
      }
    }
  };

  // Debounced username availability checker
  const checkUsernameAvailability = useCallback(
    async (username: string) => {
      if (!username || username.trim() === "") {
        setUsernameAvailable(null);
        return;
      }

      setCheckingUsername(true);
      try {
        // Check if username exists in current users list
        const existsInCurrentList = users.some(
          (user) =>
            user.username &&
            user.username.toLowerCase() === username.toLowerCase()
        );

        if (existsInCurrentList) {
          setUsernameAvailable(false);
        } else {
          setUsernameAvailable(true);
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    },
    [users]
  );

  // Debounce username checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(formData.username);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username, users, checkUsernameAvailability]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Refetch users to get updated list
        const fetchResponse = await fetch("/api/users");
        if (fetchResponse.ok) {
          const usersData = await fetchResponse.json();
          setUsers(usersData);
        }
        setShowAddUserModal(false);
        setFormData({
          name: "",
          email: "",
          username: "",
          password: "",
          role: "USER",
          plan: "FREE",
        });
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user");
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const updateData: {
        name: string;
        email: string;
        username: string;
        role: string;
        plan: string;
        password?: string;
      } = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        role: formData.role,
        plan: formData.plan,
      };

      // Only include password if resetPassword is checked and password is provided
      if (resetPassword && formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the user in the local state
        setUsers(
          users.map((user) => (user.id === selectedUser.id ? data.user : user))
        );
        setShowEditUserModal(false);
        setSelectedUser(null);
        setResetPassword(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user");
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
          <div id="analytics-dashboard" className="space-y-8">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {users.length}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <FiUsers className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">
                    +12.5%
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    vs last month
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {
                        users.filter(
                          (u) =>
                            u.lastActive &&
                            new Date(u.lastActive) >
                              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length
                      }
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <FiActivity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">
                    +8.2%
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    vs last week
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total XP
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {users
                        .reduce((sum, user) => sum + (user.xp || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <FiStar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">
                    +15.3%
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    vs last month
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Avg. Enrollments
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {users.length > 0
                        ? (
                            users.reduce(
                              (sum, user) => sum + (user.enrollments || 0),
                              0
                            ) / users.length
                          ).toFixed(1)
                        : 0}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <FiBookOpen className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">
                    +5.8%
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    vs last month
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth Chart */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  User Growth Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={generateAnalyticsData().userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Total Users"
                    />
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Active Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Plan Distribution Chart */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Plan Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={generateAnalyticsData().planDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {generateAnalyticsData().planDistribution.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={["#3b82f6", "#10b981", "#f59e0b"][index % 3]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Role Distribution Chart */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Role Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generateAnalyticsData().roleDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* XP Distribution Chart */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  XP Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generateAnalyticsData().xpDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="range" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Top Performers
              </h3>
              <div className="space-y-4">
                {users
                  .filter((u) => u.xp > 0)
                  .sort((a, b) => (b.xp || 0) - (a.xp || 0))
                  .slice(0, 5)
                  .map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">
                          {user.name || user.email.split("@")[0]}
                        </h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{user.xp} XP</p>
                        <p className="text-sm text-gray-600">
                          {user.enrollments} courses
                        </p>
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((user.xp || 0) / 1000) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Export View */}
        {viewMode === "export" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FiDownload className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Export User Data
                </h3>
                <p className="text-gray-600">
                  Generate comprehensive reports and export user data in various
                  formats.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
                  <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-green-600 font-bold text-lg">
                      CSV
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Export to CSV
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Download user data in CSV format for spreadsheet analysis.
                  </p>
                  <button
                    onClick={exportToCSV}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Download CSV
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
                  <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-red-600 font-bold text-lg">PDF</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Export to PDF
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Create a comprehensive PDF report with analytics and
                    visualizations.
                  </p>
                  <button
                    onClick={exportToPDF}
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Generate PDF
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold text-lg">
                      JSON
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Export to JSON
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Download structured data in JSON format for API integration.
                  </p>
                  <button
                    onClick={() => {
                      const jsonData = JSON.stringify(users, null, 2);
                      const blob = new Blob([jsonData], {
                        type: "application/json",
                      });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `users-export-${
                        new Date().toISOString().split("T")[0]
                      }.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    }}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download JSON
                  </button>
                </div>
              </div>

              {/* Export Statistics */}
              <div className="mt-12 bg-gray-50 rounded-2xl p-8">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Export Statistics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {users.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {users.filter((u) => u.role === "USER").length}
                    </div>
                    <div className="text-sm text-gray-600">Regular Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {users.filter((u) => u.role === "ADMIN").length}
                    </div>
                    <div className="text-sm text-gray-600">Admins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {users
                        .reduce((sum, user) => sum + (user.xp || 0), 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total XP</div>
                  </div>
                </div>
              </div>
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

              <form onSubmit={handleAddUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                          formData.username && usernameAvailable === false
                            ? "border-red-300 bg-red-50"
                            : formData.username && usernameAvailable === true
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter username (optional)"
                      />
                      {formData.username && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          {checkingUsername ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          ) : usernameAvailable === true ? (
                            <span className="text-green-600 text-sm">✓</span>
                          ) : usernameAvailable === false ? (
                            <span className="text-red-600 text-sm">✗</span>
                          ) : null}
                        </div>
                      )}
                    </div>
                    {formData.username && usernameAvailable === false && (
                      <p className="text-red-600 text-xs mt-1">
                        Username already taken. System will make it unique
                        automatically.
                      </p>
                    )}
                    {formData.username && usernameAvailable === true && (
                      <p className="text-green-600 text-xs mt-1">
                        Username is available!
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Plan
                    </label>
                    <select
                      value={formData.plan}
                      onChange={(e) =>
                        setFormData({ ...formData, plan: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="FREE">Free</option>
                      <option value="PRO">Pro</option>
                      <option value="PREMIUM">Premium</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setFormData({
                        name: "",
                        email: "",
                        username: "",
                        password: "",
                        role: "USER",
                        plan: "FREE",
                      });
                    }}
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

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit User</h3>
                <button
                  onClick={() => {
                    setShowEditUserModal(false);
                    setSelectedUser(null);
                    setResetPassword(false);
                    setFormData({
                      name: "",
                      email: "",
                      username: "",
                      password: "",
                      role: "USER",
                      plan: "FREE",
                    });
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Enter username (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Plan
                    </label>
                    <select
                      value={formData.plan}
                      onChange={(e) =>
                        setFormData({ ...formData, plan: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="FREE">Free</option>
                      <option value="PRO">Pro</option>
                      <option value="PREMIUM">Premium</option>
                    </select>
                  </div>
                </div>

                {/* Password Reset Section */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="resetPassword"
                      checked={resetPassword}
                      onChange={(e) => setResetPassword(e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="resetPassword"
                      className="text-sm font-bold text-gray-700"
                    >
                      Reset User Password
                    </label>
                  </div>
                  {resetPassword && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder="Enter new password"
                        required={resetPassword}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Leave empty to keep current password unchanged
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditUserModal(false);
                      setSelectedUser(null);
                      setResetPassword(false);
                      setFormData({
                        name: "",
                        email: "",
                        username: "",
                        password: "",
                        role: "USER",
                        plan: "FREE",
                      });
                    }}
                    className="px-6 py-3 text-gray-600 font-bold hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  User Details
                </h3>
                <button
                  onClick={() => {
                    setShowViewUserModal(false);
                    setSelectedUser(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Header */}
                <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    {selectedUser.name
                      ? selectedUser.name.charAt(0).toUpperCase()
                      : selectedUser.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">
                      {selectedUser.name || selectedUser.email.split("@")[0]}
                    </h4>
                    <p className="text-gray-600 mt-1">{selectedUser.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                          selectedUser.role === "ADMIN"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedUser.role}
                      </span>
                      {selectedUser.plan && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                          {selectedUser.plan}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedUser.xp}
                    </p>
                    <p className="text-gray-600 text-sm">Experience Points</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedUser.level || 1}
                    </p>
                    <p className="text-gray-600 text-sm">Level</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedUser.streak || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Day Streak</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedUser.enrollments || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Enrollments</p>
                  </div>
                </div>

                {/* Additional Stats */}
                {(selectedUser.submissions ||
                  selectedUser.quizAttempts ||
                  selectedUser.achievements) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedUser.submissions !== undefined && (
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {selectedUser.submissions}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Code Submissions
                        </p>
                      </div>
                    )}
                    {selectedUser.quizAttempts !== undefined && (
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {selectedUser.quizAttempts}
                        </p>
                        <p className="text-gray-600 text-sm">Quiz Attempts</p>
                      </div>
                    )}
                    {selectedUser.achievements !== undefined && (
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {selectedUser.achievements}
                        </p>
                        <p className="text-gray-600 text-sm">Achievements</p>
                      </div>
                    )}
                  </div>
                )}

                {/* User Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="font-bold text-gray-900 mb-4">
                    Account Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Username
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedUser.username || "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Member Since
                      </p>
                      <p className="text-gray-900 font-medium">
                        {new Date(selectedUser.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    {selectedUser.lastActive && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Last Active
                        </p>
                        <p className="text-gray-900 font-medium">
                          {new Date(selectedUser.lastActive).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowViewUserModal(false);
                      editUser(selectedUser);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Edit User
                  </button>
                  <button
                    onClick={() => {
                      setShowViewUserModal(false);
                      setSelectedUser(null);
                    }}
                    className="px-6 py-3 text-gray-600 font-bold hover:text-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
