import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CANDIDATE",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const validateForm = () => {
    if (!form.full_name.trim()) {
      return "Full name is required.";
    }

    if (form.full_name.trim().length < 2) {
      return "Full name must contain at least 2 characters.";
    }

    if (!form.email.trim()) {
      return "Email is required.";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Please enter a valid email address.";
    }

    if (!form.password) {
      return "Password is required.";
    }

    if (form.password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!["CANDIDATE", "EMPLOYER"].includes(form.role)) {
      return "Please select a valid role.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      setSuccess(
        response.data?.message ||
          "Registration successful."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-lg">

        {/* Logo / Heading */}
        <div className="text-center mb-6">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-3xl shadow-lg">
            💼
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-4">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Join our Job Portal and find your next opportunity
          </p>

        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-8">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5">
              <p className="font-semibold">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-5">
              <p className="font-semibold">
                {success}
              </p>

              <p className="text-sm mt-1">
                Redirecting to login...
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Register As
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      role: "CANDIDATE",
                    })
                  }
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    form.role === "CANDIDATE"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <p className="text-2xl">
                    👨‍💻
                  </p>

                  <p className="font-bold text-gray-800 mt-2">
                    Candidate
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Find and apply for jobs
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      role: "EMPLOYER",
                    })
                  }
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    form.role === "EMPLOYER"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <p className="text-2xl">
                    🏢
                  </p>

                  <p className="font-bold text-gray-800 mt-2">
                    Employer
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Post and manage jobs
                  </p>
                </button>

              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <p className="text-xs text-gray-500 mt-2">
                Minimum 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-5 border-t border-gray-100">

            <p className="text-gray-600">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="inline-block mt-2 text-blue-600 font-bold hover:text-blue-700"
            >
              Login here →
            </Link>

          </div>

        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Job Portal • Secure Registration
        </p>

      </div>
    </div>
  );
}

export default Register;