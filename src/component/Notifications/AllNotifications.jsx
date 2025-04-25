import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import NavBar from "../Header/NavBar";
import Footer from "../Footer/Footer";
import { FaBell, FaCheck, FaCalendarAlt, FaClipboardCheck, FaSearch } from "react-icons/fa";

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, read, unread
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/bookings/notifications");
      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
      setLoading(false);
      toast.error("Failed to load notifications");
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/bookings/notifications/${id}/read`);
      setNotifications(
        notifications.map((notification) =>
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n._id);
      if (unreadIds.length === 0) {
        toast.info("No unread notifications to mark");
        return;
      }
      
      await Promise.all(
        unreadIds.map((id) =>
          axiosInstance.put(`/bookings/notifications/${id}/read`)
        )
      );
      
      setNotifications(
        notifications.map((n) => ({ ...n, read: true }))
      );
      
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    
    // Navigate based on notification type
    if (notification.message.includes("report")) {
      navigate("/my-report-card");
    } else if (notification.message.includes("appointment")) {
      navigate("/appointmenthistory/me");
    }
  };

  // Filter and search notifications
  const filteredNotifications = notifications
    .filter((notification) => {
      if (filter === "read") return notification.read;
      if (filter === "unread") return !notification.read;
      return true; // "all" filter
    })
    .filter((notification) =>
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
      
      {/* Simple green header banner */}
      <header className="bg-green-900 py-16 text-white">
        <div className="container mx-auto px-8">
          <h1 className="text-5xl font-bold mb-4">
            Notifications <span className="italic">Center</span>
          </h1>
          <div className="h-1 w-32 bg-white mb-6"></div>
          <p className="text-xl">
            Stay updated with all your appointments and reports.
          </p>
        </div>
      </header>

      <div className="bg-green-50 min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with Mark All as Read button */}
            <div className="bg-white p-6 flex justify-between items-center border-b border-green-100">
              <div className="flex items-center">
                <FaBell className="text-green-700 text-3xl mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-green-800">
                    Your Notifications
                  </h2>
                  <p className="text-green-600">
                    Manage and track your updates
                  </p>
                </div>
              </div>
              <button
                onClick={markAllAsRead}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors flex items-center"
              >
                <FaCheck className="mr-2" /> Mark all as read
              </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-green-50 p-4 border-b border-green-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-lg ${
                    filter === "all"
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-700 hover:bg-green-100"
                  } transition-colors`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    filter === "unread"
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-700 hover:bg-green-100"
                  } transition-colors`}
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    filter === "read"
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-700 hover:bg-green-100"
                  } transition-colors`}
                  onClick={() => setFilter("read")}
                >
                  Read
                </button>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" />
              </div>
            </div>

            {/* Notifications list */}
            <div className="divide-y divide-green-100">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-green-800 font-medium">
                    Loading notifications...
                  </p>
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">
                  <p>{error}</p>
                  <button
                    onClick={fetchNotifications}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBell className="text-green-400 text-3xl" />
                  </div>
                  <h3 className="text-green-800 text-lg font-medium">
                    No notifications found
                  </h3>
                  <p className="text-green-600 mt-1">
                    {searchTerm
                      ? "Try a different search term"
                      : filter !== "all"
                      ? `No ${filter} notifications available`
                      : "You don't have any notifications yet"}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-green-50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-green-50" : "bg-white"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          notification.read
                            ? "bg-green-100 text-green-600"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {notification.message.includes("report") ? (
                          <FaClipboardCheck />
                        ) : (
                          <FaCalendarAlt />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p
                            className={`${
                              notification.read
                                ? "text-green-800"
                                : "text-green-900 font-medium"
                            }`}
                          >
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <span className="bg-green-500 h-2 w-2 rounded-full mt-2"></span>
                          )}
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-green-500">
                            {notification.time}
                          </p>
                          <p className="text-xs text-green-400">
                            {formatDateTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllNotifications; 