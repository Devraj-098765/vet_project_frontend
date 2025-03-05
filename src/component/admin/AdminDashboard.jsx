import React, { useState, useEffect } from "react";
import { FiCalendar, FiHeart, FiUsers } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar"; // Import AdminNavbar

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalVets, setTotalVets] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setTotalUsers(350);
      setTotalAppointments(120);
      setTotalVets(15);
    }, 500);
  }, []);

  const handleAdminLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white shadow-md rounded-lg px-6 py-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-md text-white rounded-lg shadow"
            onClick={handleAdminLogout}
          >
            Log out
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: "Total Users", count: totalUsers, color: "text-blue-600", icon: <FiHeart /> },
            { title: "Total Appointments", count: totalAppointments, color: "text-green-600", icon: <FiCalendar /> },
            { title: "Total Veterinarians", count: totalVets, color: "text-purple-600", icon: <FiUsers /> },
          ].map((stat, index) => (
            <div key={index} className="bg-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
                  <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.count}</p>
                </div>
                <div className="text-4xl text-gray-300">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
