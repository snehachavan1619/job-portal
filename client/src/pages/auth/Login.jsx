import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      console.log("Login request:", {
        email,
        passwordLength: password.length,
      });

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      console.log("Login response:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Login failed"
        );
      }

      const { token, user } = response.data;

      // Save login information
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      console.log("Logged in user:", user);

      // Redirect according to role
      if (user.role === "CANDIDATE") {
        navigate("/candidate/dashboard", {
          replace: true,
        });
      } else if (user.role === "EMPLOYER") {
        navigate("/employer/dashboard", {
          replace: true,
        });
      } else if (user.role === "ADMIN") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        setError("Unknown user role.");
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      console.error(
        "Backend response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* TITLE */}

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-600">
            Job Portal
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your account
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* REGISTER */}

        <p className="text-center text-gray-600 mt-6">

          Don't have an account?{" "}

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </button>

        </p>

      </div>

    </div>
  );
}

export default Login;