import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function EmployerJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("ALL");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/employer/jobs");

      const data = response.data;

      const list =
        data?.jobs ||
        data?.data?.jobs ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setJobs(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Employer jobs error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const getJobTitle = (job) => {
    return job.title || job.job_title || "Untitled Job";
  };

  const getDescription = (job) => {
    return job.description || "No description available.";
  };

  const getLocation = (job) => {
    return job.location || "Location not specified";
  };

  const getJobType = (job) => {
    return (
      job.job_type ||
      job.jobType ||
      job.type ||
      "Not specified"
    );
  };

  const getStatus = (job) => {
    return (
      job.status ||
      job.job_status ||
      (job.is_active === false ? "CLOSED" : "OPEN")
    );
  };

  const getApplicantsCount = (job) => {
    return (
      job.applications_count ??
      job.applicant_count ??
      job.applicants_count ??
      job.application_count ??
      0
    );
  };

  const getSalary = (job) => {
    const min = job.salary_min;
    const max = job.salary_max;

    if (min && max) {
      return `₹${Number(min).toLocaleString()} - ₹${Number(
        max
      ).toLocaleString()}`;
    }

    if (min) {
      return `₹${Number(min).toLocaleString()}+`;
    }

    if (max) {
      return `Up to ₹${Number(max).toLocaleString()}`;
    }

    return "Salary not specified";
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const title = getJobTitle(job).toLowerCase();
      const description = getDescription(job).toLowerCase();
      const location = getLocation(job).toLowerCase();
      const type = getJobType(job).toLowerCase();

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        description.includes(searchText) ||
        location.includes(searchText);

      const matchesType =
        jobType === "ALL" ||
        type === jobType.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [jobs, search, jobType]);

  const handleCloseJob = async (job) => {
    const title = getJobTitle(job);

    const confirmed = window.confirm(
      `Are you sure you want to close "${title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.put(`/employer/jobs/${job.id}/close`);

      await fetchJobs();
    } catch (err) {
      console.error("Close job error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to close the job."
      );
    }
  };

  const getStatusClasses = (status) => {
    const normalized = String(status).toUpperCase();

    if (
      normalized === "OPEN" ||
      normalized === "ACTIVE"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (normalized === "CLOSED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                Employer
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                My Jobs
              </h1>

              <p className="text-gray-500 mt-2">
                Manage the jobs posted by your company.
              </p>
            </div>

            <button
              onClick={() => navigate("/employer/jobs/create")}
              className="w-full lg:w-auto bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              + Post New Job
            </button>

          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Search */}
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

            {/* Job Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type
              </label>

              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredJobs.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {jobs.length}
            </span>{" "}
            jobs
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-red-700 font-semibold">
                {error}
              </p>

              <button
                onClick={fetchJobs}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>

            <p className="text-gray-500 mt-4">
              Loading your jobs...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

            <div className="text-5xl mb-4">
              💼
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              No Jobs Found
            </h2>

            <p className="text-gray-500 mt-2">
              {jobs.length === 0
                ? "You haven't posted any jobs yet."
                : "No jobs match your current search or filter."}
            </p>

            {jobs.length === 0 && (
              <button
                onClick={() =>
                  navigate("/employer/jobs/create")
                }
                className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Post Your First Job
              </button>
            )}

          </div>
        )}

        {/* Desktop Table */}
        {!loading &&
          !error &&
          filteredJobs.length > 0 && (
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">

              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead className="bg-gray-50 border-b">
                    <tr>
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
                        Applicants
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                        Status
                      </th>

                      <th className="text-right px-6 py-4 text-sm font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">

                    {filteredJobs.map((job) => {
                      const status = getStatus(job);
                      const closed =
                        String(status).toUpperCase() ===
                        "CLOSED";

                      return (
                        <tr
                          key={job.id || job._id}
                          className="hover:bg-gray-50 transition"
                        >

                          <td className="px-6 py-5">
                            <div className="max-w-xs">
                              <p className="font-bold text-gray-800 wrap-break-word">
                                {getJobTitle(job)}
                              </p>

                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {getDescription(job)}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-gray-600">
                            {getLocation(job)}
                          </td>

                          <td className="px-6 py-5">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                              {getJobType(job)}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-gray-700 whitespace-nowrap">
                            {getSalary(job)}
                          </td>

                          <td className="px-6 py-5">
                            <span className="font-bold text-gray-800">
                              {getApplicantsCount(job)}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClasses(
                                status
                              )}`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() =>
                                  navigate(
                                    `/employer/jobs/${job.id}/edit`
                                  )
                                }
                                className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-semibold hover:bg-blue-100"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  navigate(
                                    `/employer/jobs/${job.id}/applicants`
                                  )
                                }
                                className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg font-semibold hover:bg-purple-100"
                              >
                                Applicants
                              </button>

                              {!closed && (
                                <button
                                  onClick={() =>
                                    handleCloseJob(job)
                                  }
                                  className="bg-red-50 text-red-700 px-3 py-2 rounded-lg font-semibold hover:bg-red-100"
                                >
                                  Close
                                </button>
                              )}

                            </div>
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Mobile / Tablet Cards */}
        {!loading &&
          !error &&
          filteredJobs.length > 0 && (
            <div className="lg:hidden space-y-4">

              {filteredJobs.map((job) => {
                const status = getStatus(job);

                const closed =
                  String(status).toUpperCase() ===
                  "CLOSED";

                return (
                  <div
                    key={job.id || job._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                  >

                    {/* Title */}
                    <div className="flex items-start justify-between gap-3">

                      <h2 className="text-lg font-bold text-gray-800 wrap-break-word">
                        {getJobTitle(job)}
                      </h2>

                      <span
                        className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${getStatusClasses(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-sm mt-3 line-clamp-3">
                      {getDescription(job)}
                    </p>

                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">
                          Location
                        </p>

                        <p className="text-sm font-semibold text-gray-700 mt-1 wrap-break-word">
                          📍 {getLocation(job)}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">
                          Job Type
                        </p>

                        <p className="text-sm font-semibold text-gray-700 mt-1">
                          {getJobType(job)}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">
                          Salary
                        </p>

                        <p className="text-sm font-semibold text-gray-700 mt-1">
                          {getSalary(job)}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">
                          Applicants
                        </p>

                        <p className="text-sm font-semibold text-gray-700 mt-1">
                          👥 {getApplicantsCount(job)}
                        </p>
                      </div>

                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5">

                      <button
                        onClick={() =>
                          navigate(
                            `/employer/jobs/${job.id}/edit`
                          )
                        }
                        className="bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/employer/jobs/${job.id}/applicants`
                          )
                        }
                        className="bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
                      >
                        Applicants
                      </button>

                      {!closed && (
                        <button
                          onClick={() =>
                            handleCloseJob(job)
                          }
                          className="bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                        >
                          Close Job
                        </button>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </div>
    </DashboardLayout>
  );
}

export default EmployerJobs;