import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex flex-col md:flex-row">

        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;