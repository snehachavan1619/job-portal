import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const goToDashboard = () => {
    if (user.role === "CANDIDATE") {
      navigate("/candidate/dashboard");
    } else if (user.role === "EMPLOYER") {
      navigate("/employer/dashboard");
    } else if (user.role === "ADMIN") {
      navigate("/admin/dashboard");
    }

    setMenuOpen(false);
  };

  return (
    <nav className="bg-blue-700 text-white px-4 sm:px-6 py-4 shadow relative z-50">

      <div className="flex justify-between items-center">

        {/* Logo */}
        <button
          onClick={goToDashboard}
          className="text-xl sm:text-2xl font-bold"
        >
          Job Portal
        </button>

        {/* Desktop User Info */}
        <div className="hidden sm:flex items-center gap-5">

          <div className="text-right">
            <p className="font-semibold">
              {user.full_name || "User"}
            </p>

            <p className="text-sm text-blue-100">
              {user.role || ""}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          className="sm:hidden text-2xl"
          aria-label="Open menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 pt-4 border-t border-blue-500">

          <div className="mb-4">
            <p className="font-semibold">
              {user.full_name || "User"}
            </p>

            <p className="text-sm text-blue-100">
              {user.role || ""}
            </p>
          </div>

          <button
            onClick={goToDashboard}
            className="w-full text-left bg-blue-600 px-4 py-3 rounded-lg mb-2"
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 px-4 py-3 rounded-lg font-semibold hover:bg-red-600"
          >
            Logout
          </button>

        </div>
      )}

    </nav>
  );
}

export default Navbar;