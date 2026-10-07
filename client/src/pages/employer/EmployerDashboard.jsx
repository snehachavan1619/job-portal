import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function EmployerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET USER
  // =====================================================

  const getUser = () => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      setUser(storedUser);
    } catch (err) {
      console.error("User data error:", err);
    }
  };

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        jobsResponse,
        applicationsResponse,
        companyResponse,
      ] = await Promise.allSettled([
        api.get("/employer/jobs"),
        api.get("/employer/applications"),
        api.get("/employer/company"),
      ]);

      // =================================================
      // JOBS
      // =================================================

      if (jobsResponse.status === "fulfilled") {
        const data = jobsResponse.value.data;

        const jobList =
          Array.isArray(data)
            ? data
            : data.jobs ||
              data.data ||
              [];

        setJobs(jobList);
      }

      // =================================================
      // APPLICATIONS
      // =================================================

      if (
        applicationsResponse.status ===
        "fulfilled"
      ) {
        const data =
          applicationsResponse.value.data;

        const applicationList =
          Array.isArray(data)
            ? data
            : data.applications ||
              data.data ||
              [];

        setApplications(applicationList);
      }

      // =================================================
      // COMPANY
      // =================================================

      if (
        companyResponse.status ===
        "fulfilled"
      ) {
        const data =
          companyResponse.value.data;

        setCompany(
          data.company ||
            data.data ||
            data
        );
      }
    } catch (err) {
      console.error(
        "Employer dashboard error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    getUser();
    fetchDashboardData();
  }, []);

  // =====================================================
  // JOB STATISTICS
  // =====================================================

  const totalJobs = jobs.length;

  const openJobs = jobs.filter((job) => {
    return (
      !job.status ||
      job.status.toUpperCase() === "OPEN"
    );
  }).length;

  const closedJobs = jobs.filter((job) => {
    return (
      job.status?.toUpperCase() === "CLOSED"
    );
  }).length;

  // =====================================================
  // APPLICATION STATISTICS
  // =====================================================

  const totalApplications =
    applications.length;

  const pendingApplications =
    applications.filter((application) => {
      const status =
        application.status?.toUpperCase();

      return (
        !status ||
        status === "PENDING" ||
        status === "APPLIED"
      );
    }).length;

  const shortlistedApplications =
    applications.filter((application) => {
      const status =
        application.status?.toUpperCase();

      return (
        status === "SHORTLISTED" ||
        status === "INTERVIEW"
      );
    }).length;

  const selectedApplications =
    applications.filter((application) => {
      return (
        application.status?.toUpperCase() ===
        "SELECTED"
      );
    }).length;

  // =====================================================
  // RECENT JOBS
  // =====================================================

  const recentJobs = jobs.slice(0, 5);

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const value =
      status?.toUpperCase();

    if (value === "OPEN") {
      return "bg-green-50 text-green-700";
    }

    if (value === "CLOSED") {
      return "bg-gray-100 text-gray-600";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

            <p className="text-gray-600">
              Loading employer dashboard...
            </p>

          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-6">

        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="rounded-2xl bg-linear-to-r from-blue-600 to-blue-700 p-5 text-white shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-medium text-blue-100">
                Employer Dashboard
              </p>

              <h1 className="mt-1 wrap-break-word text-2xl font-bold sm:text-3xl">
                Welcome,{" "}
                {user.full_name || "Employer"} 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Manage your company, publish jobs,
                and review candidates from one place.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/employer/jobs/create")
              }
              className="w-full shrink-0 rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 sm:w-auto"
            >
              + Post New Job
            </button>

          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            COMPANY SUMMARY
        ================================================= */}

        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-medium text-gray-500">
                Company
              </p>

              <h2 className="mt-1 wrap-break-word text-xl font-bold text-gray-800">
                {company?.company_name ||
                  company?.name ||
                  "Company profile not configured"}
              </h2>

              {company?.location && (
                <p className="mt-1 text-sm text-gray-500">
                  📍 {company.location}
                </p>
              )}

            </div>

            <button
              onClick={() =>
                navigate("/employer/company")
              }
              className="w-full rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 sm:w-auto"
            >
              Manage Company
            </button>

          </div>

        </section>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section>

          <div className="mb-4">

            <h2 className="text-xl font-bold text-gray-800">
              Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Monitor your recruitment activity.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL JOBS */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Jobs
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {totalJobs}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  💼
                </div>

              </div>

              <button
                onClick={() =>
                  navigate("/employer/jobs")
                }
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Manage jobs →
              </button>

            </div>

            {/* OPEN JOBS */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Open Jobs
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {openJobs}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                  🟢
                </div>

              </div>

              <p className="mt-4 text-sm text-gray-500">
                Currently accepting applications
              </p>

            </div>

            {/* APPLICATIONS */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Applications
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {totalApplications}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                  📄
                </div>

              </div>

              <p className="mt-4 text-sm text-gray-500">
                Applications received
              </p>

            </div>

            {/* SHORTLISTED */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Shortlisted
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {shortlistedApplications}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                  ⭐
                </div>

              </div>

              <p className="mt-4 text-sm text-gray-500">
                Candidates in next stages
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            APPLICATION BREAKDOWN
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending Applications
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-800">
              {pendingApplications}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Need review
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Shortlisted / Interview
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-800">
              {shortlistedApplications}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Active candidates
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Selected
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-800">
              {selectedApplications}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Successfully selected
            </p>
          </div>

        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

          <h2 className="text-xl font-bold text-gray-800">
            Quick Actions
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <button
              onClick={() =>
                navigate("/employer/jobs/create")
              }
              className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-2xl">
                ➕
              </p>

              <p className="mt-2 font-semibold text-gray-800">
                Post New Job
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Create a new job opening
              </p>
            </button>

            <button
              onClick={() =>
                navigate("/employer/jobs")
              }
              className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-2xl">
                💼
              </p>

              <p className="mt-2 font-semibold text-gray-800">
                My Jobs
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Manage your job postings
              </p>
            </button>

            <button
              onClick={() =>
                navigate("/employer/company")
              }
              className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-2xl">
                🏢
              </p>

              <p className="mt-2 font-semibold text-gray-800">
                Company
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Manage company information
              </p>
            </button>

            <button
              onClick={() =>
                navigate("/employer/jobs")
              }
              className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-2xl">
                👥
              </p>

              <p className="mt-2 font-semibold text-gray-800">
                Applicants
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Review job applicants
              </p>
            </button>

          </div>

        </section>

        {/* =================================================
            RECENT JOBS
        ================================================= */}

        <section>

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-xl font-bold text-gray-800">
                Recent Jobs
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest job postings.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/employer/jobs")
              }
              className="w-fit text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View all →
            </button>

          </div>

          {recentJobs.length === 0 ? (

            <div className="rounded-xl bg-white p-8 text-center shadow-sm">

              <p className="text-gray-500">
                You haven't posted any jobs yet.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/employer/jobs/create"
                  )
                }
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Post Your First Job
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

              {recentJobs.map((job) => (

                <div
                  key={job.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                      <h3 className="wrap-break-word text-lg font-bold text-gray-800">
                        {job.title ||
                          "Job Title"}
                      </h3>

                      {job.location && (
                        <p className="mt-1 text-sm text-gray-500">
                          📍 {job.location}
                        </p>
                      )}

                    </div>

                    <span
                      className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        job.status
                      )}`}
                    >
                      {job.status ||
                        "OPEN"}
                    </span>

                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">

                    {job.job_type && (
                      <span>
                        💼 {job.job_type}
                      </span>
                    )}

                    {job.experience_required && (
                      <span>
                        🎓{" "}
                        {job.experience_required}
                      </span>
                    )}

                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">

                    <button
                      onClick={() =>
                        navigate(
                          `/employer/jobs/${job.id}/edit`
                        )
                      }
                      className="w-full rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 sm:w-auto"
                    >
                      Edit Job
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/employer/jobs/${job.id}/applicants`
                        )
                      }
                      className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                    >
                      View Applicants
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>
    </DashboardLayout>
  );
}

export default EmployerDashboard;