import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    users: 0,
    candidates: 0,
    employers: 0,
    admins: 0,
    jobs: 0,
    applications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET LOGGED-IN USER
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
  // FETCH ADMIN DASHBOARD
  // =====================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/dashboard"
      );

      const data = response.data;

      const dashboardData =
        data.stats ||
        data.data ||
        data;

      setStats({
        users:
          dashboardData.users ??
          dashboardData.totalUsers ??
          dashboardData.total_users ??
          0,

        candidates:
          dashboardData.candidates ??
          dashboardData.totalCandidates ??
          dashboardData.total_candidates ??
          0,

        employers:
          dashboardData.employers ??
          dashboardData.totalEmployers ??
          dashboardData.total_employers ??
          0,

        admins:
          dashboardData.admins ??
          dashboardData.totalAdmins ??
          dashboardData.total_admins ??
          0,

        jobs:
          dashboardData.jobs ??
          dashboardData.totalJobs ??
          dashboardData.total_jobs ??
          0,

        applications:
          dashboardData.applications ??
          dashboardData.totalApplications ??
          dashboardData.total_applications ??
          0,
      });
    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard."
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
    fetchDashboard();
  }, []);

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
              Loading admin dashboard...
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

        <section className="rounded-2xl bg-linear-to-r from-gray-800 to-gray-900 p-5 text-white shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-medium text-gray-300">
                Administration Panel
              </p>

              <h1 className="mt-1 wrap-break-word text-2xl font-bold sm:text-3xl">
                Welcome,{" "}
                {user.full_name || "Administrator"} 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
                Monitor users, jobs, and applications
                across the job portal.
              </p>

            </div>

            <div className="w-fit rounded-lg bg-white/10 px-4 py-3">

              <p className="text-xs uppercase tracking-wide text-gray-400">
                Role
              </p>

              <p className="mt-1 font-semibold">
                ADMIN
              </p>

            </div>

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

            <button
              onClick={fetchDashboard}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* =================================================
            MAIN STATISTICS
        ================================================= */}

        <section>

          <div className="mb-4">

            <h2 className="text-xl font-bold text-gray-800">
              System Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current activity across the job portal.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {/* USERS */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    Total Users
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {stats.users}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  👥
                </div>

              </div>

              <button
                onClick={() =>
                  navigate("/admin/users")
                }
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Manage users →
              </button>

            </div>

            {/* CANDIDATES */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    Candidates
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {stats.candidates}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                  🧑‍💼
                </div>

              </div>

              <p className="mt-4 text-sm text-gray-500">
                Registered candidates
              </p>

            </div>

            {/* EMPLOYERS */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    Employers
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {stats.employers}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                  🏢
                </div>

              </div>

              <p className="mt-4 text-sm text-gray-500">
                Registered employers
              </p>

            </div>

            {/* JOBS */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    Total Jobs
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {stats.jobs}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                  💼
                </div>

              </div>

              <button
                onClick={() =>
                  navigate("/admin/jobs")
                }
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Manage jobs →
              </button>

            </div>

            {/* APPLICATIONS */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    Applications
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {stats.applications}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                  📄
                </div>

              </div>

              <button
                onClick={() =>
                  navigate("/admin/applications")
                }
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Manage applications →
              </button>

            </div>

            {/* ADMINS */}

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    Administrators
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {stats.admins}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                  🛡️
                </div>

              </div>

              <p className="mt-4 text-sm text-gray-500">
                Admin accounts
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

          <p className="mt-1 text-sm text-gray-500">
            Manage the main areas of the portal.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {/* USERS */}

            <button
              onClick={() =>
                navigate("/admin/users")
              }
              className="rounded-lg border border-gray-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-2xl">
                👥
              </p>

              <p className="mt-2 font-semibold text-gray-800">
                Manage Users
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Activate, deactivate, update roles,
                or delete users.
              </p>

            </button>

            {/* JOBS */}

            <button
              onClick={() =>
                navigate("/admin/jobs")
              }
              className="rounded-lg border border-gray-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-2xl">
                💼
              </p>

              <p className="mt-2 font-semibold text-gray-800">
                Manage Jobs
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Review and manage job postings.
              </p>

            </button>

            {/* APPLICATIONS */}

            <button
              onClick={() =>
                navigate("/admin/applications")
              }
              className="rounded-lg border border-gray-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-2xl">
                📄
              </p>

              <p className="mt-2 font-semibold text-gray-800">
                Applications
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Review and update applications.
              </p>

            </button>

          </div>

        </section>

        {/* =================================================
            ROLE BREAKDOWN
        ================================================= */}

        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

          <h2 className="text-xl font-bold text-gray-800">
            User Breakdown
          </h2>

          <div className="mt-5 space-y-5">

            {/* CANDIDATES */}

            <div>

              <div className="mb-2 flex items-center justify-between gap-3">

                <span className="text-sm font-medium text-gray-700">
                  Candidates
                </span>

                <span className="text-sm font-semibold text-gray-800">
                  {stats.candidates}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width:
                      stats.users > 0
                        ? `${Math.min(
                            (stats.candidates /
                              stats.users) *
                              100,
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

            </div>

            {/* EMPLOYERS */}

            <div>

              <div className="mb-2 flex items-center justify-between gap-3">

                <span className="text-sm font-medium text-gray-700">
                  Employers
                </span>

                <span className="text-sm font-semibold text-gray-800">
                  {stats.employers}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-purple-600"
                  style={{
                    width:
                      stats.users > 0
                        ? `${Math.min(
                            (stats.employers /
                              stats.users) *
                              100,
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

            </div>

            {/* ADMINS */}

            <div>

              <div className="mb-2 flex items-center justify-between gap-3">

                <span className="text-sm font-medium text-gray-700">
                  Administrators
                </span>

                <span className="text-sm font-semibold text-gray-800">
                  {stats.admins}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-gray-700"
                  style={{
                    width:
                      stats.users > 0
                        ? `${Math.min(
                            (stats.admins /
                              stats.users) *
                              100,
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

            </div>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;