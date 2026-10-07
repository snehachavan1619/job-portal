import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user.role;

  const candidateMenu = [
    {
      label: "Dashboard",
      path: "/candidate/dashboard",
    },
    {
      label: "My Profile",
      path: "/candidate/profile",
    },
    {
      label: "Find Jobs",
      path: "/candidate/jobs",
    },
    {
      label: "Applications",
      path: "/candidate/applications",
    },
    {
      label: "Saved Jobs",
      path: "/candidate/saved-jobs",
    },
    {
      label: "Notifications",
      path: "/candidate/notifications",
    },
  ];

  const employerMenu = [
    {
      label: "Dashboard",
      path: "/employer/dashboard",
    },
    {
      label: "Company",
      path: "/employer/company",
    },
    {
      label: "My Jobs",
      path: "/employer/jobs",
    },
    {
      label: "Post New Job",
      path: "/employer/jobs/create",
    },
  ];

  const adminMenu = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      label: "Manage Users",
      path: "/admin/users",
    },
    {
      label: "Manage Jobs",
      path: "/admin/jobs",
    },
    {
      label: "Applications",
      path: "/admin/applications",
    },
  ];

  let menu = [];

  if (role === "CANDIDATE") {
    menu = candidateMenu;
  } else if (role === "EMPLOYER") {
    menu = employerMenu;
  } else if (role === "ADMIN") {
    menu = adminMenu;
  }

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Sidebar Button */}
      <div className="md:hidden bg-white border-b px-4 py-3">

        <button
          onClick={() =>
            setMobileOpen(!mobileOpen)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          {mobileOpen
            ? "Close Menu"
            : "☰ Dashboard Menu"}
        </button>

      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 min-h-[calc(100vh-73px)] bg-white border-r shadow-sm">

        <div className="p-5">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {role === "CANDIDATE"
              ? "Candidate"
              : role === "EMPLOYER"
              ? "Employer"
              : role === "ADMIN"
              ? "Administrator"
              : "Menu"}
          </h2>

          <div className="space-y-2">

            {menu.map((item) => (
              <button
                key={item.path}
                onClick={() =>
                  handleNavigation(item.path)
                }
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {item.label}
              </button>
            ))}

          </div>

        </div>

      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b shadow-sm">

          <div className="p-4">

            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {role === "CANDIDATE"
                ? "Candidate"
                : role === "EMPLOYER"
                ? "Employer"
                : role === "ADMIN"
                ? "Administrator"
                : "Menu"}
            </h2>

            <div className="space-y-2">

              {menu.map((item) => (
                <button
                  key={item.path}
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Sidebar;