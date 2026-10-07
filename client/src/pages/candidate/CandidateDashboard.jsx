import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function CandidateDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);

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
        savedJobsResponse,
        notificationsResponse,
      ] = await Promise.allSettled([
        api.get("/jobs"),
        api.get("/applications"),
        api.get("/saved-jobs"),
        api.get("/notifications"),
      ]);

      // -------------------------------------------------
      // JOBS
      // -------------------------------------------------

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

      // -------------------------------------------------
      // APPLICATIONS
      // -------------------------------------------------

      if (applicationsResponse.status === "fulfilled") {
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

      // -------------------------------------------------
      // SAVED JOBS
      // -------------------------------------------------

      if (savedJobsResponse.status === "fulfilled") {
        const data =
          savedJobsResponse.value.data;

        const savedList =
          Array.isArray(data)
            ? data
            : data.savedJobs ||
              data.jobs ||
              data.data ||
              [];

        setSavedJobs(savedList);
      }

      // -------------------------------------------------
      // NOTIFICATIONS
      // -------------------------------------------------

      if (notificationsResponse.status === "fulfilled") {
        const data =
          notificationsResponse.value.data;

        const notificationList =
          Array.isArray(data)
            ? data
            : data.notifications ||
              data.data ||
              [];

        setNotifications(notificationList);
      }
    } catch (err) {
      console.error(
        "Dashboard loading error:",
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
  // APPLICATION STATS
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
      const status =
        application.status?.toUpperCase();

      return status === "SELECTED";
    }).length;

  // =====================================================
  // RECENT JOBS
  // =====================================================

  const recentJobs = jobs.slice(0, 4);

  // =====================================================
  // RECENT APPLICATIONS
  // =====================================================

  const recentApplications =
    applications.slice(0, 4);

  // =====================================================
  // COMPANY NAME
  // =====================================================

  const getCompanyName = (job) => {
    return (
      job?.Company?.company_name ||
      job?.company?.company_name ||
      job?.company_name ||
      job?.Company?.name ||
      job?.company?.name ||
      "Company"
    );
  };

  // =====================================================
  // APPLICATION JOB TITLE
  // =====================================================

  const getApplicationJobTitle = (
    application
  ) => {
    return (
      application?.Job?.title ||
      application?.job?.title ||
      application?.job_title ||
      "Job Application"
    );
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {
    const value =
      status?.toUpperCase();

    if (value === "SELECTED") {
      return "bg-green-50 text-green-700";
    }

    if (
      value === "SHORTLISTED" ||
      value === "INTERVIEW"
    ) {
      return "bg-blue-50 text-blue-700";
    }

    if (value === "REJECTED") {
      return "bg-red-50 text-red-700";
    }

    if (value === "WITHDRAWN") {
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
              Loading your dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-6">

        {/* =================================================
            WELCOME SECTION
        ================================================= */}

        <section className="rounded-2xl bg-linear-to-r from-blue-600 to-blue-700 p-5 text-white shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-medium text-blue-100">
                Candidate Dashboard
              </p>

              <h1 className="mt-1 wrap-break-words text-2xl font-bold sm:text-3xl">
                Welcome,{" "}
                {user.full_name || "Candidate"} 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Find new opportunities, track your
                applications, and manage your job search
                from one place.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/candidate/jobs")
              }
              className="w-full shrink-0 rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 sm:w-auto"
            >
              Find Jobs →
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
            STATISTICS
        ================================================= */}

        <section>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Your Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track your job search activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL APPLICATIONS */}

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

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  📄
                </div>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/candidate/applications"
                  )
                }
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                View applications →
              </button>

            </div>

            {/* PENDING */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pending
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {pendingApplications}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                  ⏳
                </div>

              </div>

              <p className="mt-4 text-sm text-gray-500">
                Applications awaiting update
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

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                  ⭐
                </div>

              </div>

              <p className="mt-4 text-sm text-gray-500">
                Shortlisted or interview stage
              </p>

            </div>

            {/* SELECTED */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Selected
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {selectedApplications}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                  🎉
                </div>

              </div>

              <p className="mt-4 text-sm text-gray-500">
                Successfully selected
              </p>

            </div>

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
                navigate("/candidate/jobs")
              }
              className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-2xl">🔎</p>

              <p className="mt-2 font-semibold text-gray-800">
                Find Jobs
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Explore available opportunities
              </p>
            </button>

            <button
              onClick={() =>
                navigate("/candidate/profile")
              }
              className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-2xl">👤</p>

              <p className="mt-2 font-semibold text-gray-800">
                My Profile
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Update your candidate profile
              </p>
            </button>

            <button
              onClick={() =>
                navigate(
                  "/candidate/saved-jobs"
                )
              }
              className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-2xl">🔖</p>

              <p className="mt-2 font-semibold text-gray-800">
                Saved Jobs
              </p>

              <p className="mt-1 text-sm text-gray-500">
                View jobs you saved
              </p>
            </button>

            <button
              onClick={() =>
                navigate(
                  "/candidate/notifications"
                )
              }
              className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-2xl">🔔</p>

              <p className="mt-2 font-semibold text-gray-800">
                Notifications
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Check your latest updates
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
                Latest opportunities available on the portal.
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/candidate/jobs")
              }
              className="w-fit text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View all →
            </button>

          </div>

          {recentJobs.length === 0 ? (

            <div className="rounded-xl bg-white p-8 text-center shadow-sm">

              <p className="text-gray-500">
                No jobs available right now.
              </p>

              <button
                onClick={() =>
                  navigate("/candidate/jobs")
                }
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Browse Jobs
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

              {recentJobs.map((job) => (

                <div
                  key={job.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                      <h3 className="wrap-break-word text-lg font-bold text-gray-800">
                        {job.title ||
                          "Job Title"}
                      </h3>

                      <p className="mt-1 wrap-break-word font-medium text-blue-700">
                        {getCompanyName(job)}
                      </p>

                    </div>

                    <span className="w-fit shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {job.status || "OPEN"}
                    </span>

                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">

                    {job.location && (
                      <span>
                        📍 {job.location}
                      </span>
                    )}

                    {job.job_type && (
                      <span>
                        💼 {job.job_type}
                      </span>
                    )}

                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        `/candidate/jobs/${job.id}`
                      )
                    }
                    className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                  >
                    View Details
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* =================================================
            RECENT APPLICATIONS
        ================================================= */}

        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Recent Applications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track the latest applications you submitted.
              </p>
            </div>

            <button
              onClick={() =>
                navigate(
                  "/candidate/applications"
                )
              }
              className="w-fit text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View all →
            </button>

          </div>

          {recentApplications.length === 0 ? (

            <div className="rounded-lg bg-gray-50 p-6 text-center">

              <p className="text-gray-500">
                You haven't applied for any jobs yet.
              </p>

              <button
                onClick={() =>
                  navigate("/candidate/jobs")
                }
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Find a Job
              </button>

            </div>

          ) : (

            <div className="space-y-3">

              {recentApplications.map(
                (application, index) => {

                  const status =
                    application.status ||
                    "PENDING";

                  return (
                    <div
                      key={
                        application.id ||
                        index
                      }
                      className="flex flex-col gap-3 rounded-lg border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="min-w-0">

                        <h3 className="wrap-break-word font-semibold text-gray-800">
                          {getApplicationJobTitle(
                            application
                          )}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Application ID:{" "}
                          {application.id ||
                            "—"}
                        </p>

                      </div>

                      <span
                        className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>

        {/* =================================================
            SAVED + NOTIFICATIONS SUMMARY
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* SAVED JOBS */}

          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Saved Jobs
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-800">
                  {savedJobs.length}
                </p>
              </div>

              <div className="text-3xl">
                🔖
              </div>

            </div>

            <button
              onClick={() =>
                navigate(
                  "/candidate/saved-jobs"
                )
              }
              className="mt-4 rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              View Saved Jobs
            </button>

          </div>

          {/* NOTIFICATIONS */}

          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Notifications
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-800">
                  {notifications.length}
                </p>
              </div>

              <div className="text-3xl">
                🔔
              </div>

            </div>

            <button
              onClick={() =>
                navigate(
                  "/candidate/notifications"
                )
              }
              className="mt-4 rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              View Notifications
            </button>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}

export default CandidateDashboard;