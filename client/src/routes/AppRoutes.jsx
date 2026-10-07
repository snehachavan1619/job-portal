import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import CandidateProfile from "../pages/candidate/CandidateProfile";
import Jobs from "../pages/candidate/Jobs";
import Applications from "../pages/candidate/Applications";
import JobDetails from "../pages/candidate/JobDetails";
import SavedJobs from "../pages/candidate/SavedJobs";
import Notifications from "../pages/candidate/Notifications";

import EmployerDashboard from "../pages/employer/EmployerDashboard";
import EmployerCompany from "../pages/employer/EmployerCompany";
import EmployerJobs from "../pages/employer/EmployerJobs";
import CreateJob from "../pages/employer/CreateJob";
import EditJob from "../pages/employer/EditJob";
import EmployerApplicants from "../pages/employer/EmployerApplicants";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminJobs from "../pages/admin/AdminJobs";
import AdminApplications from "../pages/admin/AdminApplications";

import ProtectedRoute from "../components/ProtectedRoute";
function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =========================
          CANDIDATE ROUTES
      ========================== */}

      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["CANDIDATE"]}
          >
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/profile"
        element={
          <ProtectedRoute
            allowedRoles={["CANDIDATE"]}
          >
            <CandidateProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/jobs"
        element={
          <ProtectedRoute
            allowedRoles={["CANDIDATE"]}
          >
            <Jobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/jobs/:id"
        element={
          <ProtectedRoute
            allowedRoles={["CANDIDATE"]}
          >
            <JobDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/applications"
        element={
          <ProtectedRoute
            allowedRoles={["CANDIDATE"]}
          >
            <Applications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/saved-jobs"
        element={
          <ProtectedRoute
            allowedRoles={["CANDIDATE"]}
          >
            <SavedJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/notifications"
        element={
          <ProtectedRoute
            allowedRoles={["CANDIDATE"]}
          >
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* =========================
          EMPLOYER ROUTES
      ========================== */}

      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["EMPLOYER"]}
          >
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/company"
        element={
          <ProtectedRoute
            allowedRoles={["EMPLOYER"]}
          >
            <EmployerCompany />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/jobs"
        element={
          <ProtectedRoute
            allowedRoles={["EMPLOYER"]}
          >
            <EmployerJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/jobs/create"
        element={
          <ProtectedRoute
            allowedRoles={["EMPLOYER"]}
          >
            <CreateJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/jobs/:id/edit"
        element={
          <ProtectedRoute
            allowedRoles={["EMPLOYER"]}
          >
            <EditJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/jobs/:jobId/applicants"
        element={
          <ProtectedRoute
            allowedRoles={["EMPLOYER"]}
          >
            <EmployerApplicants />
          </ProtectedRoute>
        }
      />

      {/* =========================
          ADMIN ROUTES
      ========================== */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <AdminJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <AdminApplications />
          </ProtectedRoute>
        }
      />

      {/* =========================
          404
      ========================== */}

      <Route
  path="*"
  element={
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center max-w-md w-full">

        <div className="text-7xl font-black text-blue-600">
          404
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          Page Not Found
        </h1>

        <p className="text-gray-500 mt-2">
          The page you are looking for does not exist.
        </p>

        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          ← Go Back
        </button>

      </div>
    </div>
  }
/>


    </Routes>
  );
}

export default AppRoutes;