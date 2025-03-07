import React from "react";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiUsers, FiCalendar, FiHeart } from "react-icons/fi";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: <FiActivity />, route: "/adminDashboard" },
    { name: "Veterinarians", icon: <FiUsers />, route: "/AddVet" },
    { name: "Appointments", icon: <FiCalendar />, route: "/admin/appointments" },
    { name: "User List", icon: <FiHeart />, route: "/UserList" },
    { name: "Reports", icon: <FiActivity />, route: "/admin/reports" },
    { name: "Veterinarian List", icon: <FiActivity />, route: "/admin/Veterinarian" },

  ];

  return (
    <aside className="w-64 bg-white shadow-lg p-6 h-screen flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">VetCare Admin</h2>
      <nav>
        <ul className="space-y-4">
          {navItems.map((item, index) => (
            <li
              key={index}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition duration-300 cursor-pointer"
              onClick={() => navigate(item.route)}
            >
              {item.icon}
              <span className="text-lg font-medium">{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminNavbar;
