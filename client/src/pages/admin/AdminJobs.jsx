import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/jobs");
      const data = response.data;

      setJobs(
        Array.isArray(data)
          ? data
          : data.jobs || data.data || []
      );
    } catch (error) {
      console.error("Failed to fetch jobs:", error);

      setMessage(
        error.response?.data?.message || "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/jobs/${id}`);

      setMessage("Job deleted successfully.");
      fetchJobs();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete job"
      );
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const description = job.description || "";
    const location = job.location || "";
    const jobType = job.job_type || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      typeFilter === "ALL" || jobType === typeFilter;

    return matchesSearch && matchesType;
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
                Manage Jobs 💼
              </h1>

              <p className="text-blue-100 mt-2 text-sm sm:text-base">
                View and manage jobs posted on the platform.
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Jobs
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description or location..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type
              </label>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>

          </div>

          <p className="text-sm text-gray-500 mt-4">
            Showing{" "}
            <strong>{filteredJobs.length}</strong> of{" "}
            <strong>{jobs.length}</strong> jobs
          </p>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-4xl mb-3">⏳</div>

            <p className="text-gray-600">
              Loading jobs...
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              No jobs found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filter.
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
                        Job
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Location
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Type
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Salary
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {filteredJobs.map((job) => (

                      <tr
                        key={job.id}
                        className="hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-4 text-gray-600">
                          #{job.id}
                        </td>

                        <td className="px-6 py-4">

                          <p className="font-semibold text-gray-800 wrap-break-word">
                            {job.title || "Untitled Job"}
                          </p>

                          <p className="text-sm text-gray-500 mt-1 wrap-break-word">
                            {job.description
                              ? `${job.description.substring(0, 80)}...`
                              : "No description"}
                          </p>

                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {job.location || "Not specified"}
                        </td>

                        <td className="px-6 py-4">

                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {job.job_type || "Not specified"}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-gray-600">

                          {job.salary_min || job.salary_max ? (
                            <>
                              ₹{job.salary_min || 0}
                              {" - "}
                              ₹{job.salary_max || 0}
                            </>
                          ) : (
                            "Not specified"
                          )}

                        </td>

                        <td className="px-6 py-4">

                          <button
                            onClick={() =>
                              handleDelete(job.id)
                            }
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200"
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            {/* Mobile / Tablet Cards */}
            <div className="lg:hidden space-y-4">

              {filteredJobs.map((job) => (

                <div
                  key={job.id}
                  className="bg-white rounded-2xl shadow p-5"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <h2 className="text-lg font-bold text-gray-800 wrap-break-word">
                        {job.title || "Untitled Job"}
                      </h2>

                      <p className="text-xs text-gray-400 mt-1">
                        Job ID: #{job.id}
                      </p>

                    </div>

                    <span className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {job.job_type || "N/A"}
                    </span>

                  </div>

                  <div className="mt-4 space-y-2">

                    <p className="text-sm text-gray-600">
                      📍 {job.location || "Location not specified"}
                    </p>

                    <p className="text-sm text-gray-600">
                      💰{" "}
                      {job.salary_min || job.salary_max
                        ? `₹${job.salary_min || 0} - ₹${job.salary_max || 0}`
                        : "Salary not specified"}
                    </p>

                  </div>

                  <p className="text-sm text-gray-500 mt-4 wrap-break-word">
                    {job.description
                      ? `${job.description.substring(0, 150)}...`
                      : "No description available."}
                  </p>

                  <button
                    onClick={() =>
                      handleDelete(job.id)
                    }
                    className="w-full mt-5 bg-red-100 text-red-700 px-4 py-3 rounded-xl font-semibold hover:bg-red-200"
                  >
                    🗑 Delete Job
                  </button>

                </div>

              ))}

            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}

export default AdminJobs;