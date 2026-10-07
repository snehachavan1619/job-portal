import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/jobs/${id}`);

      const data =
        response.data?.job ||
        response.data?.data?.job ||
        response.data?.data ||
        response.data;

      setJob(data);

      // Check application status
      try {
        const applicationsResponse =
          await api.get("/applications");

        const applicationData =
          applicationsResponse.data;

        const applications =
          applicationData?.applications ||
          applicationData?.data?.applications ||
          applicationData?.data ||
          (Array.isArray(applicationData)
            ? applicationData
            : []);

        const foundApplication =
          Array.isArray(applications) &&
          applications.some(
            (application) =>
              Number(
                application.job_id ||
                  application.jobId ||
                  application.job?.id
              ) === Number(id)
          );

        setAlreadyApplied(Boolean(foundApplication));
      } catch (applicationError) {
        console.warn(
          "Could not check applications:",
          applicationError
        );
      }

      // Check saved jobs
      try {
        const savedResponse =
          await api.get("/saved-jobs");

        const savedData = savedResponse.data;

        const savedJobs =
          savedData?.savedJobs ||
          savedData?.data?.savedJobs ||
          savedData?.data ||
          (Array.isArray(savedData)
            ? savedData
            : []);

        const foundSaved =
          Array.isArray(savedJobs) &&
          savedJobs.some(
            (item) =>
              Number(
                item.job_id ||
                  item.jobId ||
                  item.job?.id ||
                  item.id
              ) === Number(id)
          );

        setSaved(Boolean(foundSaved));
      } catch (savedError) {
        console.warn(
          "Could not check saved jobs:",
          savedError
        );
      }
    } catch (err) {
      console.error("Job details error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load job details."
      );
    } finally {
      setLoading(false);
    }
  };

  const getJobTitle = () => {
    return (
      job?.title ||
      job?.job_title ||
      "Job Details"
    );
  };

  const getDescription = () => {
    return (
      job?.description ||
      "No job description available."
    );
  };

  const getLocation = () => {
    return (
      job?.location ||
      "Location not specified"
    );
  };

  const getJobType = () => {
    return (
      job?.job_type ||
      job?.jobType ||
      job?.type ||
      "Not specified"
    );
  };

  const getExperience = () => {
    return (
      job?.experience_required ||
      job?.experience ||
      "Not specified"
    );
  };

  const getCompanyName = () => {
    return (
      job?.company?.name ||
      job?.company_name ||
      job?.company?.company_name ||
      "Company"
    );
  };

  const getSalary = () => {
    const min = job?.salary_min;
    const max = job?.salary_max;

    if (min && max) {
      return `₹${Number(min).toLocaleString()} - ₹${Number(
        max
      ).toLocaleString()}`;
    }

    if (min) {
      return `₹${Number(min).toLocaleString()}+`;
    }

    if (max) {
      return `Up to ₹${Number(max).toLocaleString()}`;
    }

    return "Salary not specified";
  };

  const handleApply = async () => {
    if (alreadyApplied) return;

    try {
      setApplying(true);
      setError("");
      setSuccess("");

      const response = await api.post("/applications", {
        job_id: Number(id),
      });

      setAlreadyApplied(true);

      setSuccess(
        response.data?.message ||
          "Application submitted successfully."
      );
    } catch (err) {
      console.error("Apply error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to apply for this job."
      );
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (saved) {
      try {
        setSaving(true);
        setError("");

        await api.delete(`/saved-jobs/${id}`);

        setSaved(false);

        setSuccess("Job removed from saved jobs.");
      } catch (err) {
        console.error("Remove saved job error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to remove saved job."
        );
      } finally {
        setSaving(false);
      }

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.post("/saved-jobs", {
        job_id: Number(id),
      });

      setSaved(true);

      setSuccess(
        response.data?.message ||
          "Job saved successfully."
      );
    } catch (err) {
      console.error("Save job error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save this job."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
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

  if (error && !job) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold text-red-700">
              Unable to Load Job
            </h2>

            <p className="text-red-600 mt-2">
              {error}
            </p>

            <button
              onClick={() => navigate("/candidate/jobs")}
              className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 sm:p-8 shadow-sm">

          <button
            onClick={() => navigate("/candidate/jobs")}
            className="text-blue-100 hover:text-white font-semibold mb-5"
          >
            ← Back to Jobs
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

            <div className="min-w-0">

              <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">
                Job Opportunity
              </p>

              <h1 className="text-2xl sm:text-4xl font-bold mt-2 wrap-break-word">
                {getJobTitle()}
              </h1>

              <p className="text-blue-100 text-lg mt-3">
                {getCompanyName()}
              </p>

              <div className="flex flex-wrap gap-2 mt-5">

                <span className="bg-white/15 px-3 py-2 rounded-lg text-sm">
                  📍 {getLocation()}
                </span>

                <span className="bg-white/15 px-3 py-2 rounded-lg text-sm">
                  💼 {getJobType()}
                </span>

                <span className="bg-white/15 px-3 py-2 rounded-lg text-sm">
                  💰 {getSalary()}
                </span>

              </div>

            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">

              <button
                onClick={handleApply}
                disabled={alreadyApplied || applying}
                className={`px-6 py-3 rounded-xl font-bold transition ${
                  alreadyApplied
                    ? "bg-green-500 text-white cursor-default"
                    : "bg-white text-blue-700 hover:bg-blue-50"
                }`}
              >
                {applying
                  ? "Applying..."
                  : alreadyApplied
                  ? "✓ Applied"
                  : "Apply Now"}
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 rounded-xl font-bold bg-blue-500/40 text-white border border-white/30 hover:bg-blue-500/60 transition"
              >
                {saving
                  ? "Saving..."
                  : saved
                  ? "★ Saved"
                  : "☆ Save Job"}
              </button>

            </div>

          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-700 font-semibold">
              {success}
            </p>
          </div>
        )}

        {/* Error */}
        {error && job && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-semibold">
              {error}
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Description */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5 sm:p-6">

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Job Description
            </h2>

            <div className="mt-5 text-gray-600 leading-7 whitespace-pre-line wrap-break-word">
              {getDescription()}
            </div>

          </div>

          {/* Job Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 h-fit">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Job Summary
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Location
                </p>

                <p className="text-gray-700 font-semibold mt-1">
                  📍 {getLocation()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Job Type
                </p>

                <p className="text-gray-700 font-semibold mt-1">
                  💼 {getJobType()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Experience
                </p>

                <p className="text-gray-700 font-semibold mt-1">
                  🧑‍💻 {getExperience()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Salary
                </p>

                <p className="text-gray-700 font-semibold mt-1">
                  💰 {getSalary()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Company
                </p>

                <p className="text-gray-700 font-semibold mt-1 wrap-break-word">
                  🏢 {getCompanyName()}
                </p>
              </div>

            </div>

            <div className="border-t mt-6 pt-5">

              <button
                onClick={handleApply}
                disabled={alreadyApplied || applying}
                className={`w-full py-3 rounded-xl font-bold transition ${
                  alreadyApplied
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {alreadyApplied
                  ? "✓ Application Submitted"
                  : applying
                  ? "Applying..."
                  : "Apply for this Job"}
              </button>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default JobDetails;