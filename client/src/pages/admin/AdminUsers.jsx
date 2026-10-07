import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/users");

      const data = response.data;

      setUsers(
        Array.isArray(data)
          ? data
          : data.users || data.data || []
      );
    } catch (error) {
      console.error("Failed to fetch users:", error);

      setMessage(
        error.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleActivate = async (id) => {
    try {
      await api.put(`/admin/users/${id}/activate`);

      setMessage("User activated successfully.");
      fetchUsers();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to activate user"
      );
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await api.put(`/admin/users/${id}/deactivate`);

      setMessage("User deactivated successfully.");
      fetchUsers();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to deactivate user"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/users/${id}`);

      setMessage("User deleted successfully.");
      fetchUsers();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, {
        role,
      });

      setMessage("User role updated successfully.");
      fetchUsers();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update role"
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user.full_name || "";
    const email = user.email || "";
    const role = user.role || "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "ALL" || role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-linear-to-r from-blue-700 to-indigo-700 text-white rounded-2xl p-5 sm:p-7 shadow">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <p className="text-blue-100 text-sm font-medium">
                Administration
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                Manage Users 👥
              </h1>

              <p className="text-blue-100 mt-2 text-sm sm:text-base">
                View, activate, deactivate and manage user accounts.
              </p>
            </div>

            <Link
              to="/admin/dashboard"
              className="bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold hover:bg-blue-50 transition text-center"
            >
              ← Dashboard
            </Link>

          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl">
            {message}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Users
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Role
              </label>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Roles</option>
                <option value="CANDIDATE">Candidate</option>
                <option value="EMPLOYER">Employer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing <strong>{filteredUsers.length}</strong> of{" "}
            <strong>{users.length}</strong> users
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-4xl mb-3">⏳</div>
            <p className="text-gray-600">
              Loading users...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-5xl mb-4">🔍</div>

            <h2 className="text-xl font-bold text-gray-800">
              No users found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or role filter.
            </p>
          </div>
        ) : (

          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl shadow overflow-hidden">

              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        ID
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        User
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Role
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Status
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">

                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-4 text-gray-600">
                          #{user.id}
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800 wrap-break-word">
                            {user.full_name || "Unknown User"}
                          </p>

                          <p className="text-sm text-gray-500 wrap-break-word">
                            {user.email}
                          </p>
                        </td>

                        <td className="px-6 py-4">

                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user.id,
                                e.target.value
                              )
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="CANDIDATE">
                              Candidate
                            </option>

                            <option value="EMPLOYER">
                              Employer
                            </option>

                            <option value="ADMIN">
                              Admin
                            </option>
                          </select>

                        </td>

                        <td className="px-6 py-4">

                          {user.is_active ? (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                              Inactive
                            </span>
                          )}

                        </td>

                        <td className="px-6 py-4">

                          <div className="flex flex-wrap gap-2">

                            {user.is_active ? (
                              <button
                                onClick={() =>
                                  handleDeactivate(user.id)
                                }
                                className="bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-200"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleActivate(user.id)
                                }
                                className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-200"
                              >
                                Activate
                              </button>
                            )}

                            <button
                              onClick={() =>
                                handleDelete(user.id)
                              }
                              className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-200"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>
              </div>

            </div>

            {/* Mobile / Tablet Cards */}
            <div className="lg:hidden space-y-4">

              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl shadow p-5"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">
                      <h2 className="font-bold text-lg text-gray-800 wrap-break-word">
                        {user.full_name || "Unknown User"}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1 wrap-break-word">
                        {user.email}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        User ID: #{user.id}
                      </p>
                    </div>

                    {user.is_active ? (
                      <span className="shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}

                  </div>

                  {/* Role */}
                  <div className="mt-5">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role
                    </label>

                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-xl px-3 py-3"
                    >
                      <option value="CANDIDATE">
                        Candidate
                      </option>

                      <option value="EMPLOYER">
                        Employer
                      </option>

                      <option value="ADMIN">
                        Admin
                      </option>
                    </select>

                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-5">

                    {user.is_active ? (
                      <button
                        onClick={() =>
                          handleDeactivate(user.id)
                        }
                        className="bg-orange-100 text-orange-700 px-3 py-3 rounded-xl font-semibold hover:bg-orange-200"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleActivate(user.id)
                        }
                        className="bg-green-100 text-green-700 px-3 py-3 rounded-xl font-semibold hover:bg-green-200"
                      >
                        Activate
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDelete(user.id)
                      }
                      className="bg-red-100 text-red-700 px-3 py-3 rounded-xl font-semibold hover:bg-red-200"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}

export default AdminUsers;