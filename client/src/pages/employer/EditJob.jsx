import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "FULL_TIME",
    experience_required: "",
    salary_min: "",
    salary_max: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setApiError("");

      const response = await api.get(
        `/employer/jobs/${id}`
      );

      const data =
        response.data?.job ||
        response.data?.data?.job ||
        response.data?.data ||
        response.data;

      setForm({
        title: data?.title || "",
        description: data?.description || "",
        location: data?.location || "",
        job_type:
          data?.job_type ||
          data?.jobType ||
          "FULL_TIME",
        experience_required:
          data?.experience_required || "",
        salary_min:
          data?.salary_min ?? "",
        salary_max:
          data?.salary_max ?? "",
      });
    } catch (err) {
      console.error("Fetch job error:", err);

      setApiError(
        err.response?.data?.message ||
          "Failed to load job details."
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

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setApiError("");
    setSuccess("");
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Job title is required.";
    } else if (form.title.trim().length < 3) {
      newErrors.title =
        "Job title must contain at least 3 characters.";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Job description is required.";
    } else if (form.description.trim().length < 20) {
      newErrors.description =
        "Description should contain at least 20 characters.";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (!form.job_type) {
      newErrors.job_type = "Please select a job type.";
    }

    if (
      form.salary_min !== "" &&
      Number(form.salary_min) < 0
    ) {
      newErrors.salary_min =
        "Salary cannot be negative.";
    }

    if (
      form.salary_max !== "" &&
      Number(form.salary_max) < 0
    ) {
      newErrors.salary_max =
        "Salary cannot be negative.";
    }

    if (
      form.salary_min !== "" &&
      form.salary_max !== "" &&
      Number(form.salary_min) >
        Number(form.salary_max)
    ) {
      newErrors.salary_max =
        "Maximum salary must be greater than minimum salary.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");
    setSuccess("");

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        job_type: form.job_type,
        experience_required:
          form.experience_required.trim(),

        salary_min:
          form.salary_min === ""
            ? undefined
            : Number(form.salary_min),

        salary_max:
          form.salary_max === ""
            ? undefined
            : Number(form.salary_max),
      };

      const response = await api.put(
        `/employer/jobs/${id}`,
        payload
      );

      setSuccess(
        response.data?.message ||
          "Job updated successfully."
      );

      setTimeout(() => {
        navigate("/employer/jobs");
      }, 800);
    } catch (err) {
      console.error("Update job error:", err);

      setApiError(
        err.response?.data?.message ||
          "Failed to update the job."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/employer/jobs");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>

            <p className="text-gray-500 mt-4">
              Loading job details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            Employer
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
            Edit Job
          </h1>

          <p className="text-gray-500 mt-2">
            Update your job listing information.
          </p>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-semibold">
              {apiError}
            </p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-700 font-semibold">
              {success}
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Title *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer"
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
              />

              {errors.title && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Pune, Maharashtra"
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
              />

              {errors.location && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.location}
                </p>
              )}
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type *
              </label>

              <select
                name="job_type"
                value={form.job_type}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.job_type
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
              >
                <option value="FULL_TIME">
                  Full Time
                </option>

                <option value="PART_TIME">
                  Part Time
                </option>

                <option value="INTERNSHIP">
                  Internship
                </option>

                <option value="CONTRACT">
                  Contract
                </option>

                <option value="REMOTE">
                  Remote
                </option>
              </select>

              {errors.job_type && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.job_type}
                </p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience Required
              </label>

              <input
                type="text"
                name="experience_required"
                value={form.experience_required}
                onChange={handleChange}
                placeholder="e.g. 0-2 years"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Minimum Salary */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Salary
              </label>

              <input
                type="number"
                min="0"
                name="salary_min"
                value={form.salary_min}
                onChange={handleChange}
                placeholder="e.g. 300000"
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.salary_min
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
              />

              {errors.salary_min && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.salary_min}
                </p>
              )}
            </div>

            {/* Maximum Salary */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Salary
              </label>

              <input
                type="number"
                min="0"
                name="salary_max"
                value={form.salary_max}
                onChange={handleChange}
                placeholder="e.g. 600000"
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.salary_max
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
              />

              {errors.salary_max && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.salary_max}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="8"
                placeholder="Describe the role, responsibilities and requirements..."
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                  errors.description
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
              />

              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-red-600 text-sm">
                    {errors.description}
                  </p>
                ) : (
                  <span />
                )}

                <span className="text-xs text-gray-400">
                  {form.description.length} characters
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7 pt-6 border-t">

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="w-full sm:w-auto bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Updating..." : "Update Job"}
            </button>

          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default EditJob;