import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/saved-jobs");

      const data = response.data;

      setSavedJobs(
        Array.isArray(data)
          ? data
          : data.savedJobs ||
              data.saved_jobs ||
              data.data ||
              []
      );
    } catch (error) {
      console.error(
        "Failed to fetch saved jobs:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load saved jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const getJob = (saved) => {
    return (
      saved.job ||
      saved.Job ||
      saved
    );
  };

  const getJobId = (saved) => {
    const job = getJob(saved);

    return (
      job.id ||
      saved.job_id ||
      saved.jobId
    );
  };

  const getJobTitle = (saved) => {
    const job = getJob(saved);

    return (
      job.title ||
      saved.job_title ||
      "Untitled Job"
    );
  };

  const getLocation = (saved) => {
    const job = getJob(saved);

    return (
      job.location ||
      "Location not specified"
    );
  };

  const getJobType = (saved) => {
    const job = getJob(saved);

    return (
      job.job_type ||
      "Not specified"
    );
  };

  const getDescription = (saved) => {
    const job = getJob(saved);

    return (
      job.description ||
      "No description available."
    );
  };

  const getSalary = (saved) => {
    const job = getJob(saved);

    if (
      job.salary_min ||
      job.salary_max
    ) {
      return `₹${job.salary_min || 0} - ₹${
        job.salary_max || 0
      }`;
    }

    return "Salary not specified";
  };

  const handleRemove = async (saved) => {
    const jobId = getJobId(saved);

    if (!jobId) {
      setMessage(
        "Unable to identify this saved job."
      );
      return;
    }

    try {
      await api.delete(
        `/saved-jobs/${jobId}`
      );

      setMessage(
        "Job removed from saved jobs."
      );

      setSavedJobs((previous) =>
        previous.filter(
          (item) =>
            getJobId(item) !== jobId
        )
      );
    } catch (error) {
      console.error(
        "Failed to remove saved job:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to remove saved job."
      );
    }
  };

  const filteredJobs = savedJobs.filter(
    (saved) => {
      const title =
        getJobTitle(saved);

      const location =
        getLocation(saved);

      const searchText =
        search.toLowerCase();

      return (
        title
          .toLowerCase()
          .includes(searchText) ||
        location
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-linear-to-r from-blue-700 to-indigo-700 text-white rounded-2xl p-5 sm:p-7 shadow">

          <p className="text-blue-100 text-sm font-medium">
            Candidate Portal
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            Saved Jobs ⭐
          </h1>

          <p className="text-blue-100 mt-2 text-sm sm:text-base">
            Keep track of jobs you want to apply for later.
          </p>

        </div>

        {/* Message */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl">
            {message}
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Saved Jobs
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by job title or location..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <p className="text-sm text-gray-500 mt-4">
            Showing{" "}
            <strong>
              {filteredJobs.length}
            </strong>{" "}
            of{" "}
            <strong>
              {savedJobs.length}
            </strong>{" "}
            saved jobs
          </p>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <div className="text-4xl mb-3">
              ⏳
            </div>

            <p className="text-gray-600">
              Loading saved jobs...
            </p>

          </div>

        ) : filteredJobs.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <div className="text-6xl mb-4">
              ⭐
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              No saved jobs found
            </h2>

            <p className="text-gray-500 mt-2">
              Save interesting jobs so you can find them easily later.
            </p>

            <Link
              to="/candidate/jobs"
              className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              🔎 Find Jobs
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {filteredJobs.map(
              (saved, index) => {

                const jobId =
                  getJobId(saved);

                return (
                  <div
                    key={
                      saved.id ||
                      jobId ||
                      index
                    }
                    className="bg-white rounded-2xl shadow p-5 sm:p-6 hover:shadow-lg transition"
                  >

                    {/* Top */}
                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h2 className="text-xl font-bold text-gray-800 wrap-break-word">
                          {getJobTitle(
                            saved
                          )}
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                          📍 {getLocation(saved)}
                        </p>

                      </div>

                      <span className="shrink-0 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ Saved
                      </span>

                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-2 mt-4">

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        💼 {getJobType(saved)}
                      </span>

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        💰 {getSalary(saved)}
                      </span>

                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mt-5 wrap-break-word">
                      {getDescription(
                        saved
                      ).length > 160
                        ? `${getDescription(
                            saved
                          ).substring(
                            0,
                            160
                          )}...`
                        : getDescription(
                            saved
                          )}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">

                      {jobId && (
                        <Link
                          to={`/candidate/jobs/${jobId}`}
                          className="flex-1 text-center bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                          View Job
                        </Link>
                      )}

                      <button
                        onClick={() =>
                          handleRemove(
                            saved
                          )
                        }
                        className="flex-1 sm:flex-none bg-red-100 text-red-700 px-5 py-3 rounded-xl font-semibold hover:bg-red-200 transition"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default SavedJobs;