import React, { useState, useEffect } from "react";
import { FiCalendar, FiHeart, FiUsers, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalVets: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const data = {
        totalUsers: 350,
        totalAppointments: 120,
        totalVets: 15,
        pendingAppointments: 42,
        completedAppointments: 78
      };
      setStatistics(data);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleAdminLogout = () => {
    logout();
    navigate("/admin");
  };

  // Recent activities data (for the activity feed)
  const recentActivities = [
    { id: 1, type: "user", message: "New user registered: John Smith", time: "10 minutes ago" },
    { id: 2, type: "appointment", message: "Appointment confirmed with Dr. Wilson", time: "25 minutes ago" },
    { id: 3, type: "vet", message: "Dr. Sarah Rodriguez updated availability", time: "1 hour ago" },
    { id: 4, type: "appointment", message: "Appointment canceled by user Emma Brown", time: "2 hours ago" },
    { id: 5, type: "user", message: "User profile updated: Michael Johnson", time: "3 hours ago" }
  ];

  // Chart data
  const appointmentData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 21 },
    { name: 'Fri', value: 25 },
    { name: 'Sat', value: 18 },
    { name: 'Sun', value: 10 }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md rounded-xl px-6 py-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, Admin</p>
          </div>
          
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm text-white rounded-lg shadow transition-colors duration-300 mt-4 md:mt-0"
            onClick={handleAdminLogout}
          >
            Log out
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {[
            { title: "Total Users", count: statistics.totalUsers, color: "bg-blue-500", icon: <FiUsers className="text-white" /> },
            { title: "Total Appointments", count: statistics.totalAppointments, color: "bg-green-500", icon: <FiCalendar className="text-white" /> },
            { title: "Total Veterinarians", count: statistics.totalVets, color: "bg-purple-500", icon: <FiHeart className="text-white" /> },
            { title: "Pending Appointments", count: statistics.pendingAppointments, color: "bg-yellow-500", icon: <FiAlertCircle className="text-white" /> },
            { title: "Completed Appointments", count: statistics.completedAppointments, color: "bg-teal-500", icon: <FiCheckCircle className="text-white" /> },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-white shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-4 flex items-center justify-center`}>
                  <div className="text-2xl">{stat.icon}</div>
                </div>
                <div className="flex-1 p-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      stat.count
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Appointments Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Weekly Appointments Overview</h2>
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-64 w-full rounded"></div>
            ) : (
              <div className="h-64 relative">
                {/* Simple bar chart visual representation */}
                <div className="flex h-52 items-end space-x-2">
                  {appointmentData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-blue-500 rounded-t-sm" 
                        style={{ height: `${(item.value / 25) * 100}%` }}
                      ></div>
                      <span className="text-xs mt-2 text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 border-t pt-2 text-xs text-gray-500">
                  <span>0</span>
                  <span>Number of Appointments</span>
                  <span>25</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {isLoading ? (
                Array(3).fill().map((_, i) => (
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
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full 
                      ${activity.type === "user" ? "bg-blue-100 text-blue-500" : 
                       activity.type === "appointment" ? "bg-green-100 text-green-500" : 
                       "bg-purple-100 text-purple-500"}`}>
                      {activity.type === "user" ? <FiUsers /> : 
                       activity.type === "appointment" ? <FiCalendar /> : <FiHeart />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Activity
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;