import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiUsers, FiCalendar, FiHeart, FiDollarSign } from "react-icons/fi";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const navItems = [
    { name: "Dashboard", icon: <FiActivity />, route: "/adminDashboard" },
    { name: " Add Veterinarians", icon: <FiUsers />, route: "/AddVet" },
    { name: "Appointments", icon: <FiCalendar />, route: "/appointments" },
    { name: "User List", icon: <FiHeart />, route: "/UserList" },
    { name: "Veterinarian List", icon: <FiUsers />, route: "/admin/veterinarianlist" },
    { name: "Payments", icon: <FiDollarSign />, route: "/admin/payments" },
  ];

  const handleNavigation = (route, name) => {
    setActiveItem(name);
    navigate(route);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 to-indigo-800 rounded-r-xl shadow-xl p-4 h-screen flex flex-col">
      <div className="flex items-center justify-center mb-12 mt-4">
        <div className="bg-white bg-opacity-20 p-3 rounded-full">
          <FiHeart className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-white ml-3">VetCare</h2>
      </div>
      
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                activeItem === item.name
                  ? "bg-white bg-opacity-20 text-white shadow-md transform -translate-x-1"
                  : "text-gray-300 hover:bg-white hover:bg-opacity-10"
              }`}
              onClick={() => handleNavigation(item.route, item.name)}
            >
              <div className={`text-xl ${activeItem === item.name ? "text-white" : "text-gray-400"}`}>
                {item.icon}
              </div>
              <span className="ml-3 font-medium">{item.name}</span>
              {activeItem === item.name && (
                <div className="ml-auto w-1 h-8 bg-white rounded-full"></div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto mb-6 bg-white bg-opacity-10 p-3 rounded-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <div className="ml-3">
            <p className="text-white text-sm font-medium">Admin User</p>
            <p className="text-gray-300 text-xs">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );   
};

export default AdminNavbar;