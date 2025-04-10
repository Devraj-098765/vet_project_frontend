import React, { useState, useEffect } from "react";
import { FiCalendar, FiHeart, FiUsers } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import useUserInfo from "../../hooks/userUserInfo";
import useAppointmentHistory from "../../hooks/useAppointmentHistory";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { users } = useUserInfo();
  const { adminAppointments } = useAppointmentHistory();
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalVets: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch veterinarians
        const vetsResponse = await fetch("http://localhost:3001/api/veterinarians");
        const vetsData = await vetsResponse.json();

        // Set statistics
        const newStats = {
          totalUsers: users.length || 0,
          totalAppointments: adminAppointments.reduce((sum, vet) => sum + (vet.totalAppointments || 0), 0),
          totalVets: vetsData.length || 0,
        };
        setStatistics(newStats);

        // Generate recent activities
        const activities = adminAppointments
          .flatMap((vet) =>
            vet.appointments.map((appt) => ({
              id: appt._id,
              type: "appointment",
              message: `${appt.status} appointment for ${appt.petName} with Dr. ${vet.veterinarian?.name || "Unknown"}`,
              time: new Date(appt.date).toLocaleTimeString(),
            }))
          )
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 5);
        setRecentActivities(activities);

        // Generate weekly appointment data
        const weeklyData = Array(7)
          .fill(0)
          .map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dayAppointments = adminAppointments
              .flatMap((vet) => vet.appointments)
              .filter((appt) => new Date(appt.date).toDateString() === date.toDateString()).length;
            return {
              name: date.toLocaleDateString("en-US", { weekday: "short" }),
              value: dayAppointments,
            };
          });
        setAppointmentData(weeklyData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [users, adminAppointments]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/admin");
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleStatClick = (route) => {
    navigate(route);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminNavbar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md rounded-xl px-6 py-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <span className="text-gray-500 text-sm">Welcome back, Admin</span>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm text-white rounded-lg shadow transition-colors duration-300 mt-4 md:mt-0"
            onClick={handleLogoutClick}
          >
            Log out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            {
              title: "Total Users",
              count: statistics.totalUsers,
              color: "bg-blue-500",
              icon: <FiUsers className="text-white" />,
              route: "/UserList",
            },
            {
              title: "Total Appointments",
              count: statistics.totalAppointments,
              color: "bg-green-500",
              icon: <FiCalendar className="text-white" />,
              route: "/appointments",
            },
            {
              title: "Total Veterinarians",
              count: statistics.totalVets,
              color: "bg-purple-500",
              icon: <FiHeart className="text-white" />,
              route: "/admin/veterinarianlist",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden cursor-pointer hover:bg-gray-50"
              onClick={() => handleStatClick(stat.route)}
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-4 flex items-center justify-center`}>
                  <div className="text-2xl">{stat.icon}</div>
                </div>
                <div className="flex-1 p-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <span className="text-2xl font-bold text-gray-800 mt-1">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      stat.count
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Weekly Appointments Overview</h2>
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-64 w-full rounded"></div>
            ) : (
              <div className="h-64 relative">
                <div className="flex h-52 items-end space-x-2 px-4">
                  {appointmentData.map((item, index) => {
                    const maxValue = Math.max(...appointmentData.map((d) => d.value));
                    const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1 relative group">
                        <div
                          className="w-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md transition-all duration-300 ease-in-out hover:from-blue-500 hover:to-blue-700 shadow-sm hover:shadow-md"
                          style={{ height: `${heightPercentage}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm text-gray-700 bg-white px-2 py-1 rounded shadow">
                            {item.value}
                          </div>
                        </div>
                        <span className="text-xs mt-2 text-gray-600 font-medium">{item.name}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-4 border-t pt-2 text-xs text-gray-500 px-4">
                  <span>0</span>
                  <span className="font-medium">Appointments</span>
                  <span>{Math.max(...appointmentData.map((d) => d.value))}</span>
                </div>
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -rotate-90 text-xs text-gray-500">
                  Volume
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {isLoading ? (
                Array(3)
                  .fill()
                  .map((_, i) => (
                    <div key={i} className="animate-pulse flex items-start space-x-3">
                      <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
                      <div className="flex-1">
                        <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                      </div>
                    </div>
                  ))
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-500">
                      <FiCalendar />
                    </div>
                    <div>
                      <span className="text-sm text-gray-700">{activity.message}</span>
                      <span className="text-xs text-gray-500 mt-1 block">{activity.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => navigate("/appointments")}
            >
              View All Activity
            </button>
          </div>
        </div>

        {/* Logout Confirmation Popup */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
              <span className="text-gray-600 mb-6 block">Do you want to log out?</span>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
                  onClick={cancelLogout}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  onClick={confirmLogout}
                >
                  Yes, Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;