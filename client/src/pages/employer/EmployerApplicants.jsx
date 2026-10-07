import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function EmployerApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const statuses = [
    "APPLIED",
    "SHORTLISTED",
    "INTERVIEW",
    "SELECTED",
    "REJECTED",
  ];

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobResponse, applicantsResponse] =
        await Promise.all([
          api.get(`/employer/jobs/${jobId}`),
          api.get(`/employer/jobs/${jobId}/applicants`),
        ]);

      const jobData =
        jobResponse.data?.job ||
        jobResponse.data?.data?.job ||
        jobResponse.data?.data ||
        jobResponse.data;

      const applicantData = applicantsResponse.data;

      const applicantList =
        applicantData?.applications ||
        applicantData?.data?.applications ||
        applicantData?.data ||
        (Array.isArray(applicantData)
          ? applicantData
          : []);

      setJob(jobData);
      setApplications(
        Array.isArray(applicantList)
          ? applicantList
          : []
      );
    } catch (err) {
      console.error("Applicants error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load applicants."
      );
    } finally {
      setLoading(false);
    }
  };

  const getJobTitle = () => {
    return (
      job?.title ||
      job?.job_title ||
      "Job Applicants"
    );
  };

  const getCandidate = (application) => {
    return (
      application.candidate ||
      application.user ||
      application.Candidate ||
      {}
    );
  };

  const getCandidateName = (application) => {
    const candidate = getCandidate(application);

    return (
      candidate.full_name ||
      candidate.name ||
      application.candidate_name ||
      application.user_name ||
      "Candidate"
    );
  };

  const getCandidateEmail = (application) => {
    const candidate = getCandidate(application);

    return (
      candidate.email ||
      application.candidate_email ||
      application.user_email ||
      "Email not available"
    );
  };

  const getCandidatePhone = (application) => {
    const candidate = getCandidate(application);

    return (
      candidate.phone ||
      candidate.phone_number ||
      application.phone ||
      "Not provided"
    );
  };

  const getCandidateLocation = (application) => {
    const candidate = getCandidate(application);

    return (
      candidate.location ||
      candidate.city ||
      application.location ||
      "Not provided"
    );
  };

  const getApplicationStatus = (application) => {
    return (
      application.status ||
      application.application_status ||
      "APPLIED"
    );
  };

  const getAppliedDate = (application) => {
    const date =
      application.created_at ||
      application.createdAt ||
      application.applied_at ||
      application.appliedAt;

    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString();
  };

  const getStatusClasses = (status) => {
    switch (String(status).toUpperCase()) {
      case "APPLIED":
        return "bg-blue-100 text-blue-700";

      case "SHORTLISTED":
        return "bg-purple-100 text-purple-700";

      case "INTERVIEW":
        return "bg-yellow-100 text-yellow-700";

      case "SELECTED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      setUpdatingId(applicationId);
      setError("");

      await api.put(
        `/employer/applications/${applicationId}/status`,
        {
          status,
        }
      );

      setApplications((prev) =>
        prev.map((application) => {
          const id =
            application.id ||
            application._id;

          if (id === applicationId) {
            return {
              ...application,
              status,
              application_status: status,
            };
          }

          return application;
        })
      );
    } catch (err) {
      console.error("Update status error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>

            <p className="text-gray-500 mt-4">
              Loading applicants...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                Employer
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 wrap-break-word">
                {getJobTitle()}
              </h1>

              <p className="text-gray-500 mt-2">
                Manage candidates who applied for this job.
              </p>

              <div className="mt-3 inline-flex bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {applications.length}{" "}
                {applications.length === 1
                  ? "Applicant"
                  : "Applicants"}
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/employer/jobs")
              }
              className="w-full lg:w-auto bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              ← Back to My Jobs
            </button>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <p className="text-red-700 font-semibold">
                {error}
              </p>

              <button
                onClick={fetchData}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>

            </div>
          </div>
        )}

        {/* Empty */}
        {!error && applications.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

            <div className="text-5xl mb-4">
              👥
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              No Applicants Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Candidates who apply for this job will appear here.
            </p>

          </div>
        )}

        {/* Desktop Table */}
        {!error && applications.length > 0 && (
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">

            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-gray-50 border-b">
                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                      Candidate
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                      Contact
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                      Location
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                      Applied
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">
                      Update
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y">

                  {applications.map((application, index) => {
                    const applicationId =
                      application.id ||
                      application._id ||
                      index;

                    const status =
                      getApplicationStatus(
                        application
                      );

                    const updating =
                      updatingId === applicationId;

                    return (
                      <tr
                        key={applicationId}
                        className="hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-5">
                          <div>
                            <p className="font-bold text-gray-800">
                              {getCandidateName(
                                application
                              )}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              Application #
                              {application.id ||
                                application._id ||
                                index + 1}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-gray-700">
                            {getCandidateEmail(
                              application
                            )}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {getCandidatePhone(
                              application
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {getCandidateLocation(
                            application
                          )}
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {getAppliedDate(
                            application
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClasses(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <select
                            value={status}
                            disabled={updating}
                            onChange={(e) =>
                              updateStatus(
                                applicationId,
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                          >
                            {statuses.map(
                              (item) => (
                                <option
                                  key={item}
                                  value={item}
                                >
                                  {item}
                                </option>
                              )
                            )}
                          </select>

                          {updating && (
                            <p className="text-xs text-gray-400 mt-1">
                              Updating...
                            </p>
                          )}
                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Cards */}
        {!error && applications.length > 0 && (
          <div className="lg:hidden space-y-4">

            {applications.map((application, index) => {
              const applicationId =
                application.id ||
                application._id ||
                index;

              const status =
                getApplicationStatus(
                  application
                );

              const updating =
                updatingId === applicationId;

              return (
                <div
                  key={applicationId}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                >

                  {/* Candidate */}
                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
                      {getCandidateName(
                        application
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">

                      <h2 className="text-lg font-bold text-gray-800 wrap-break-word">
                        {getCandidateName(
                          application
                        )}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Applied on{" "}
                        {getAppliedDate(
                          application
                        )}
                      </p>

                    </div>

                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${getStatusClasses(
                        status
                      )}`}
                    >
                      {status}
                    </span>

                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400">
                        Email
                      </p>

                      <p className="text-sm font-semibold text-gray-700 mt-1 wrap-break-word">
                        {getCandidateEmail(
                          application
                        )}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="text-sm font-semibold text-gray-700 mt-1">
                        {getCandidatePhone(
                          application
                        )}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 sm:col-span-2">
                      <p className="text-xs text-gray-400">
                        Location
                      </p>

                      <p className="text-sm font-semibold text-gray-700 mt-1">
                        📍{" "}
                        {getCandidateLocation(
                          application
                        )}
                      </p>
                    </div>

                  </div>

                  {/* Status */}
                  <div className="mt-5">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Application Status
                    </label>

                    <select
                      value={status}
                      disabled={updating}
                      onChange={(e) =>
                        updateStatus(
                          applicationId,
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    >
                      {statuses.map((item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ))}
                    </select>

                    {updating && (
                      <p className="text-xs text-gray-400 mt-2">
                        Updating application status...
                      </p>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default EmployerApplicants;