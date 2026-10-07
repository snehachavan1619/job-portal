import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      const data = response.data;

      const list =
        data?.notifications ||
        data?.data?.notifications ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Notifications error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const getNotificationTitle = (notification) => {
    return (
      notification.title ||
      notification.subject ||
      "Notification"
    );
  };

  const getNotificationMessage = (notification) => {
    return (
      notification.message ||
      notification.content ||
      notification.description ||
      "You have a new notification."
    );
  };

  const getNotificationDate = (notification) => {
    const date =
      notification.created_at ||
      notification.createdAt ||
      notification.date;

    if (!date) return "Recently";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    return parsedDate.toLocaleString();
  };

  const isUnread = (notification) => {
    if (notification.is_read !== undefined) {
      return !notification.is_read;
    }

    if (notification.isRead !== undefined) {
      return !notification.isRead;
    }

    if (notification.read !== undefined) {
      return !notification.read;
    }

    return false;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                Candidate
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                Notifications
              </h1>

              <p className="text-gray-500 mt-2">
                Stay updated with your job applications and account activity.
              </p>
            </div>

            <button
              onClick={fetchNotifications}
              className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>

            <p className="text-gray-500 mt-4">
              Loading notifications...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="text-red-700 font-semibold">
              {error}
            </p>

            <button
              onClick={fetchNotifications}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && notifications.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">
              🔔
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              No Notifications
            </h2>

            <p className="text-gray-500 mt-2">
              You don't have any notifications right now.
            </p>

            <button
              onClick={() => navigate("/candidate/jobs")}
              className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Find Jobs
            </button>
          </div>
        )}

        {/* Notifications */}
        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-4">

            {notifications.map((notification, index) => {
              const unread = isUnread(notification);

              return (
                <div
                  key={notification.id || notification._id || index}
                  className={`bg-white rounded-2xl shadow-sm border p-5 sm:p-6 transition hover:shadow-md ${
                    unread
                      ? "border-blue-200 bg-blue-50/30"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-4">

                    {/* Icon */}
                    <div
                      className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xl ${
                        unread
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      🔔
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <h2
                          className={`text-lg font-bold wrap-break-word ${
                            unread
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {getNotificationTitle(notification)}
                        </h2>

                        {unread && (
                          <span className="self-start bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mt-2 leading-relaxed wrap-break-word">
                        {getNotificationMessage(notification)}
                      </p>

                      <p className="text-sm text-gray-400 mt-3">
                        {getNotificationDate(notification)}
                      </p>

                    </div>
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

export default Notifications;