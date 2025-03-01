import React, { useState, useEffect } from "react";
import { FiActivity, FiBell, FiLogOut, FiUsers, FiCalendar, FiHeart } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import Admin from "../../pages/auth/Admin";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [totalAnimals, setTotalAnimals] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalVets, setTotalVets] = useState(0);

  useEffect(() => {
    let animTimeout = setTimeout(() => {
      setTotalAnimals(350);
      setTotalAppointments(120);
      setTotalVets(15);
    }, 500);
    return () => clearTimeout(animTimeout);
  }, []);

  const handleAdminLogout = () => {
    logout();
    navigate("/admin"); 
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-between">
            VetCare Admin 
          </h2>
          <nav className="mt-8">
            <ul className="space-y-4">
              {[
                { name: "Dashboard", icon: <FiActivity /> },
                { name: "Veterinarians", icon: <FiUsers /> },
                { name: "Appointments", icon: <FiCalendar /> },
                { name: "User List", icon: <FiHeart /> },
                { name: "Reports", icon: <FiActivity /> },
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition duration-300 cursor-pointer"
                >
                  {item.icon}
                  <span className="text-lg font-medium">{item.name}</span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header Bar */}
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
            { title: "Total User", count: totalAnimals, color: "text-blue-600", icon: <FiHeart /> },
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
