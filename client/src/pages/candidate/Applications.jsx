import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);

      const data =
        response.data.job ||
        response.data.data ||
        response.data;

      setJob(data);
    } catch (error) {
      console.error("Job details error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load job details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);

      await api.post("/applications", {
        job_id: id,
      });

      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Application error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to apply for this job"
      );
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    try {
      setSaving(true);

      await api.post("/saved-jobs", {
        job_id: id,
      });

      alert("Job saved successfully!");
    } catch (error) {
      console.error("Save job error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save job"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <p className="text-lg font-semibold text-gray-600">
            Loading job details...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="text-5xl mb-4">
            🔍
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Job not found
          </h2>

          <button
            onClick={() =>
              navigate("/candidate/jobs")
            }
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() =>
            navigate("/candidate/jobs")
          }
          className="mb-5 text-blue-600 font-semibold hover:underline"
        >
          ← Back to Jobs
        </button>

        {/* Main Job Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="bg-blue-600 text-white p-6 md:p-8">
            <h1 className="text-3xl font-bold">
              {job.title || "Untitled Job"}
            </h1>

            <p className="text-blue-100 text-lg mt-2">
              {job.company_name ||
                job.company?.name ||
                "Company"}
            </p>

            {job.location && (
              <p className="text-blue-100 mt-3">
                📍 {job.location}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

              {job.job_type && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">
                    Job Type
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {job.job_type}
                  </p>
                </div>
              )}

              {job.experience_required && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">
                    Experience
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {job.experience_required}
                  </p>
                </div>
              )}

              {(job.salary_min ||
                job.salary_max) && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">
                    Salary
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {job.salary_min || ""}
                    {job.salary_min &&
                    job.salary_max
                      ? " - "
                      : ""}
                    {job.salary_max || ""}
                  </p>
                </div>
              )}

            </div>

            {/* Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Job Description
              </h2>

              <p className="text-gray-600 whitespace-pre-line leading-7">
                {job.description ||
                  "No job description available."}
              </p>
            </section>

            {/* Requirements */}
            {job.requirements && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Requirements
                </h2>

                <p className="text-gray-600 whitespace-pre-line leading-7">
                  {job.requirements}
                </p>
              </section>
            )}

            {/* Skills */}
            {Array.isArray(job.skills) &&
              job.skills.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Required Skills
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(
                      (skill, index) => (
                        <span
                          key={
                            skill.id || index
                          }
                          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium"
                        >
                          {skill.name ||
                            skill.skill_name ||
                            skill}
                        </span>
                      )
                    )}
                  </div>
                </section>
              )}

            {/* Actions */}
            <div className="border-t pt-6 flex flex-col sm:flex-row gap-4">

              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {applying
                  ? "Applying..."
                  : "Apply Now"}
              </button>

              <button
                onClick={handleSaveJob}
                disabled={saving}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                {saving
                  ? "Saving..."
                  : "Save Job"}
              </button>

            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default JobDetails;
