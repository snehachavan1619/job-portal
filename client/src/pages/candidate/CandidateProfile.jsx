import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function CandidateProfile() {
  const [profile, setProfile] = useState({
    headline: "",
    summary: "",
    phone: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/candidate/profile");

      const data =
        response.data?.profile ||
        response.data?.data ||
        response.data;

      if (data) {
        setProfile({
          headline: data.headline || "",
          summary: data.summary || "",
          phone: data.phone || "",
          location: data.location || "",
        });
      }
    } catch (err) {
      console.error("Failed to load profile:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await api.put("/candidate/profile", profile);

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <div className="text-4xl mb-3">⏳</div>

          <p className="text-gray-600">
            Loading your profile...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-linear-to-r from-blue-700 to-indigo-700 text-white rounded-2xl p-5 sm:p-7 shadow">

          <p className="text-blue-100 text-sm font-medium">
            Candidate Profile
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            My Profile 👤
          </h1>

          <p className="text-blue-100 mt-2 text-sm sm:text-base">
            Keep your professional information updated for employers.
          </p>

        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            ❌ {error}
          </div>
        )}

        {/* Profile Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow p-5 sm:p-7"
        >

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Professional Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add information that helps employers understand your profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Headline */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Professional Headline
              </label>

              <input
                type="text"
                name="headline"
                value={profile.headline}
                onChange={handleChange}
                placeholder="Example: Full Stack Developer"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
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
                value={profile.location}
                onChange={handleChange}
                placeholder="Example: Pune, Maharashtra"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Summary */}
            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Professional Summary
              </label>

              <textarea
                name="summary"
                value={profile.summary}
                onChange={handleChange}
                rows="6"
                placeholder="Write a short summary about your skills, experience and career goals..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-xs text-gray-400 mt-2">
                Keep your summary clear and professional.
              </p>

            </div>

          </div>

          {/* Save */}
          <div className="flex justify-end mt-7">

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

          </div>

        </form>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-3xl mb-3">🎓</div>

            <h3 className="font-bold text-gray-800">
              Education
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Manage your educational qualifications.
            </p>

            <p className="text-blue-600 text-sm font-semibold mt-4">
              Available from sidebar
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-3xl mb-3">💼</div>

            <h3 className="font-bold text-gray-800">
              Experience
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Add your work experience and projects.
            </p>

            <p className="text-blue-600 text-sm font-semibold mt-4">
              Available from profile modules
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-3xl mb-3">🛠️</div>

            <h3 className="font-bold text-gray-800">
              Skills
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Maintain your technical and professional skills.
            </p>

            <p className="text-blue-600 text-sm font-semibold mt-4">
              Available from profile modules
            </p>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default CandidateProfile;