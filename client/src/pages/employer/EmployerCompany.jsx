import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function EmployerCompany() {
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    industry: "",
    location: "",
    company_size: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/employer/company");

      const data =
        response.data?.company ||
        response.data?.data?.company ||
        response.data?.data ||
        response.data;

      if (data && typeof data === "object") {
        setCompany(data);

        setForm({
          name: data.name || data.company_name || "",
          description: data.description || "",
          website: data.website || "",
          industry: data.industry || "",
          location: data.location || "",
          company_size:
            data.company_size ||
            data.size ||
            "",
        });
      }
    } catch (err) {
      console.error("Company fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load company information."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(
        "/employer/company",
        form
      );

      const updatedCompany =
        response.data?.company ||
        response.data?.data?.company ||
        response.data?.data ||
        response.data;

      if (updatedCompany && typeof updatedCompany === "object") {
        setCompany(updatedCompany);

        setForm({
          name:
            updatedCompany.name ||
            updatedCompany.company_name ||
            form.name,

          description:
            updatedCompany.description ||
            form.description,

          website:
            updatedCompany.website ||
            form.website,

          industry:
            updatedCompany.industry ||
            form.industry,

          location:
            updatedCompany.location ||
            form.location,

          company_size:
            updatedCompany.company_size ||
            updatedCompany.size ||
            form.company_size,
        });
      }

      setSuccess(
        response.data?.message ||
          "Company information updated successfully."
      );
    } catch (err) {
      console.error("Company update error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update company information."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            Employer
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
            Company Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your company information and profile.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>

            <p className="text-gray-500 mt-4">
              Loading company information...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-semibold">
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        {!loading && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm p-5 sm:p-6"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Company Information
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Keep your company profile up to date.
              </p>
            </div>

            {/* Success */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Industry
                </label>

                <input
                  type="text"
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  placeholder="e.g. Information Technology"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website
                </label>

                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Size
                </label>

                <input
                  type="text"
                  name="company_size"
                  value={form.company_size}
                  onChange={handleChange}
                  placeholder="e.g. 51-200 employees"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Describe your company..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={fetchCompany}
                disabled={saving}
                className="w-full sm:w-auto bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Reset
              </button>

            </div>
          </form>
        )}

        {/* Company Preview */}
        {!loading && company && (
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Company Preview
            </h2>

            <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6">

              <h3 className="text-2xl font-bold wrap-break-word">
                {form.name || "Company Name"}
              </h3>

              {form.industry && (
                <p className="mt-2 text-blue-100">
                  {form.industry}
                </p>
              )}

              {form.location && (
                <p className="mt-1 text-blue-100">
                  📍 {form.location}
                </p>
              )}

              {form.description && (
                <p className="mt-4 text-blue-50 leading-relaxed wrap-break-word">
                  {form.description}
                </p>
              )}

              {form.website && (
                <p className="mt-4 text-sm text-blue-100 wrap-break-word">
                  🌐 {form.website}
                </p>
              )}

              {form.company_size && (
                <p className="mt-2 text-sm text-blue-100">
                  👥 {form.company_size}
                </p>
              )}

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default EmployerCompany;