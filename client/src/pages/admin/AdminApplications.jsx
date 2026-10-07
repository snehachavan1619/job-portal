import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/applications");
      const data = response.data;

      setApplications(
        Array.isArray(data)
          ? data
          : data.applications || data.data || []
      );
    } catch (error) {
      console.error("Failed to fetch applications:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/applications/${id}/status`, {
        status,
      });

      setMessage(
        `Application status changed to ${status}.`
      );

      fetchApplications();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update application status"
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "SELECTED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "INTERVIEW":
        return "bg-purple-100 text-purple-700";

      case "SHORTLISTED":
        return "bg-blue-100 text-blue-700";

      case "WITHDRAWN":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getCandidateName = (application) => {
    return (
      application.candidate?.full_name ||
      application.Candidate?.full_name ||
      application.user?.full_name ||
      application.User?.full_name ||
      application.candidate_name ||
      "Unknown Candidate"
    );
  };

  const getCandidateEmail = (application) => {
    return (
      application.candidate?.email ||
      application.Candidate?.email ||
      application.user?.email ||
      application.User?.email ||
      application.candidate_email ||
      "No email"
    );
  };

  const getJobTitle = (application) => {
    return (
      application.job?.title ||
      application.Job?.title ||
      application.job_title ||
      "Unknown Job"
    );
  };

  const filteredApplications = applications.filter(
    (application) => {
      const candidateName =
        getCandidateName(application);

      const candidateEmail =
        getCandidateEmail(application);

      const jobTitle =
        getJobTitle(application);

      const status =
        application.status || "";

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        candidateName
          .toLowerCase()
          .includes(searchText) ||
        candidateEmail
          .toLowerCase()
          .includes(searchText) ||
        jobTitle
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

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
                Manage Applications 📄
              </h1>

              <p className="text-blue-100 mt-2 text-sm sm:text-base">
                Monitor and manage job applications across the platform.
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
                Search Applications
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search candidate or job..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">
                  All Statuses
                </option>

                <option value="APPLIED">
                  Applied
                </option>

                <option value="SHORTLISTED">
                  Shortlisted
                </option>

                <option value="INTERVIEW">
                  Interview
                </option>

                <option value="SELECTED">
                  Selected
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

                <option value="WITHDRAWN">
                  Withdrawn
                </option>
              </select>
            </div>

          </div>

          <p className="text-sm text-gray-500 mt-4">
            Showing{" "}
            <strong>
              {filteredApplications.length}
            </strong>{" "}
            of{" "}
            <strong>
              {applications.length}
            </strong>{" "}
            applications
          </p>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <div className="text-4xl mb-3">
              ⏳
            </div>

            <p className="text-gray-600">
              Loading applications...
            </p>

          </div>

        ) : filteredApplications.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <div className="text-5xl mb-4">
              📭
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              No applications found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or status filter.
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
                        Candidate
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Job
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Status
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Applied
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {filteredApplications.map(
                      (application) => {

                        const status =
                          application.status ||
                          "APPLIED";

                        return (
                          <tr
                            key={application.id}
                            className="hover:bg-gray-50 transition"
                          >

                            <td className="px-6 py-4 text-gray-600">
                              #{application.id}
                            </td>

                            <td className="px-6 py-4">

                              <p className="font-semibold text-gray-800 wrap-break-word">
                                {getCandidateName(
                                  application
                                )}
                              </p>

                              <p className="text-sm text-gray-500 wrap-break-word">
                                {getCandidateEmail(
                                  application
                                )}
                              </p>

                            </td>

                            <td className="px-6 py-4">

                              <p className="font-semibold text-gray-700 wrap-break-word">
                                {getJobTitle(
                                  application
                                )}
                              </p>

                              <p className="text-xs text-gray-400 mt-1">
                                Job ID: #
                                {application.job_id ||
                                  application.jobId ||
                                  "N/A"}
                              </p>

                            </td>

                            <td className="px-6 py-4">

                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(
                                  status
                                )}`}
                              >
                                {status}
                              </span>

                            </td>

                            <td className="px-6 py-4 text-sm text-gray-500">

                              {application.createdAt
                                ? new Date(
                                    application.createdAt
                                  ).toLocaleDateString()
                                : application.created_at
                                ? new Date(
                                    application.created_at
                                  ).toLocaleDateString()
                                : "N/A"}

                            </td>

                            <td className="px-6 py-4">

                              <select
                                value={status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    application.id,
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              >

                                <option value="APPLIED">
                                  Applied
                                </option>

                                <option value="SHORTLISTED">
                                  Shortlisted
                                </option>

                                <option value="INTERVIEW">
                                  Interview
                                </option>

                                <option value="SELECTED">
                                  Selected
                                </option>

                                <option value="REJECTED">
                                  Rejected
                                </option>

                                <option value="WITHDRAWN">
                                  Withdrawn
                                </option>

                              </select>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* Mobile / Tablet Cards */}
            <div className="lg:hidden space-y-4">

              {filteredApplications.map(
                (application) => {

                  const status =
                    application.status ||
                    "APPLIED";

                  return (
                    <div
                      key={application.id}
                      className="bg-white rounded-2xl shadow p-5"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h2 className="font-bold text-lg text-gray-800 wrap-break-word">
                            {getCandidateName(
                              application
                            )}
                          </h2>

                          <p className="text-sm text-gray-500 mt-1 wrap-break-word">
                            {getCandidateEmail(
                              application
                            )}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            Application #
                            {application.id}
                          </p>

                        </div>

                        <span
                          className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                      </div>

                      <div className="mt-5 bg-gray-50 rounded-xl p-4">

                        <p className="text-xs text-gray-500">
                          Applied For
                        </p>

                        <p className="font-semibold text-gray-800 mt-1 wrap-break-word">
                          {getJobTitle(
                            application
                          )}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          Job ID: #
                          {application.job_id ||
                            application.jobId ||
                            "N/A"}
                        </p>

                      </div>

                      <div className="mt-4">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Update Status
                        </label>

                        <select
                          value={status}
                          onChange={(e) =>
                            handleStatusChange(
                              application.id,
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-300 rounded-xl px-3 py-3"
                        >

                          <option value="APPLIED">
                            Applied
                          </option>

                          <option value="SHORTLISTED">
                            Shortlisted
                          </option>

                          <option value="INTERVIEW">
                            Interview
                          </option>

                          <option value="SELECTED">
                            Selected
                          </option>

                          <option value="REJECTED">
                            Rejected
                          </option>

                          <option value="WITHDRAWN">
                            Withdrawn
                          </option>

                        </select>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}

export default AdminApplications;