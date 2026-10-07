import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");
      const data = response.data;

      setJobs(
        Array.isArray(data)
          ? data
          : data.jobs || data.data || []
      );
    } catch (err) {
      console.error("Fetch jobs error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";

    const company =
      job.Company?.company_name ||
      job.company?.company_name ||
      job.company_name ||
      "";

    const jobLocation = job.location || "";

    const searchText = search.toLowerCase();
    const locationText = location.toLowerCase();

    const matchesSearch =
      title.toLowerCase().includes(searchText) ||
      company.toLowerCase().includes(searchText);

    const matchesLocation =
      jobLocation.toLowerCase().includes(locationText);

    return matchesSearch && matchesLocation;
  });

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Find Jobs
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Explore job opportunities and find a role that matches your skills.
          </p>
        </div>

        {/* Search Section */}
        <div className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5">

          {/* Job Search */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Job title or company
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. React Developer"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Location Search */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Pune"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

        </div>

        {/* Jobs Heading */}
        <div className="flex flex-wrap items-center justify-between gap-2">

          <h2 className="text-lg font-semibold text-gray-800">
            Available Jobs
          </h2>

          {!loading && !error && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {filteredJobs.length} found
            </span>
          )}

        </div>

        {/* Loading State */}
        {loading && (
          <LoadingSpinner text="Loading jobs..." />
        )}

        {/* Error State */}
        {!loading && error && (
          <ErrorMessage
            message={error}
            onRetry={fetchJobs}
          />
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          filteredJobs.length === 0 && (
            <EmptyState
              icon="💼"
              title="No Jobs Found"
              message="Try another job title or location to find available opportunities."
            />
          )}

        {/* Jobs List */}
        {!loading &&
          !error &&
          filteredJobs.length > 0 && (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

              {filteredJobs.map((job) => {

                const company =
                  job.Company?.company_name ||
                  job.company?.company_name ||
                  job.company_name ||
                  "Company";

                return (
                  <article
                    key={job.id}
                    className="flex min-w-0 flex-col justify-between gap-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:p-5"
                  >

                    {/* Job Information */}
                    <div className="min-w-0">

                      <div className="flex flex-wrap items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h3 className="wrap-break-word text-lg font-bold text-gray-800 sm:text-xl">
                            {job.title}
                          </h3>

                          <p className="mt-1 wrap-break-word font-medium text-blue-700">
                            {company}
                          </p>

                        </div>

                        <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {job.status || "OPEN"}
                        </span>

                      </div>

                      {/* Job Details */}
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">

                        {job.location && (
                          <span className="flex items-center gap-1">
                            <span aria-hidden="true">
                              📍
                            </span>
                            {job.location}
                          </span>
                        )}

                        {job.job_type && (
                          <span className="flex items-center gap-1">
                            <span aria-hidden="true">
                              💼
                            </span>
                            {job.job_type}
                          </span>
                        )}

                        {job.experience_required && (
                          <span className="flex items-center gap-1">
                            <span aria-hidden="true">
                              🎓
                            </span>
                            {job.experience_required}
                          </span>
                        )}

                      </div>

                      {/* Description */}
                      {job.description && (
                        <p className="mt-4 line-clamp-3 whitespace-pre-line wrap-break-word text-sm leading-6 text-gray-600">
                          {job.description}
                        </p>
                      )}

                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                      {/* Salary */}
                      <p className="text-sm font-semibold text-gray-700">
                        {job.salary_min || job.salary_max
                          ? `₹${job.salary_min ?? "—"} – ₹${
                              job.salary_max ?? "—"
                            }`
                          : "Salary not specified"}
                      </p>

                      {/* View Details */}
                      <button
                        onClick={() =>
                          navigate(
                            `/candidate/jobs/${job.id}`
                          )
                        }
                        className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                      >
                        View Details
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </div>
    </DashboardLayout>
  );
}

export default Jobs;