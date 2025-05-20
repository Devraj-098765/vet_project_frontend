import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiActivity, FiUsers, FiCalendar, FiHeart, FiDollarSign, FiLogOut } from "react-icons/fi";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("Dashboard");
  
  useEffect(() => {
    // Set active item based on current route
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.route === currentPath);
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [location]);

  const navItems = [
    { name: "Dashboard", icon: <FiActivity />, route: "/adminDashboard" },
    { name: "Add Veterinarians", icon: <FiUsers />, route: "/AddVet" },
    { name: "Appointments", icon: <FiCalendar />, route: "/adminAppointment" },
    { name: "User List", icon: <FiHeart />, route: "/UserList" },
    { name: "Veterinarian List", icon: <FiUsers />, route: "/admin/veterinarianlist" },
    { name: "Activities", icon: <FiActivity />, route: "/admin/activities" },
    { name: "Payments", icon: <FiDollarSign />, route: "/admin/payments" },
  ];

  const handleNavigation = (route, name) => {
    setActiveItem(name);
    navigate(route);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 via-indigo-800 to-indigo-900 rounded-r-2xl shadow-2xl p-5 h-screen flex flex-col relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-20 -mb-20"></div>
      
      {/* Logo section */}
      <div className="flex items-center mb-12 mt-2">
        <div className="bg-white bg-opacity-20 p-3 rounded-full shadow-lg">
          <FiHeart className="text-white text-2xl" />
        </div>
        <div className="ml-3">
          <h2 className="text-2xl font-bold text-white">VetCare</h2>
          <p className="text-xs text-indigo-200">Admin Portal</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-grow">
        <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-4 pl-2">Main Menu</p>
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ease-in-out ${
                activeItem === item.name
                  ? "bg-white bg-opacity-15 text-white shadow-md transform scale-105"
                  : "text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white"
              }`}
              onClick={() => handleNavigation(item.route, item.name)}
            >
              <div className={`text-xl ${activeItem === item.name ? "text-white" : "text-indigo-300"}`}>
                {item.icon}
              </div>
              <span className="ml-3 font-medium">{item.name}</span>
              {activeItem === item.name && (
                <div className="ml-auto w-1.5 h-6 bg-white rounded-full shadow-glow"></div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User profile section */}
      <div className="mt-auto">
        <div className="border-t border-indigo-700 pt-4 mb-4 opacity-70"></div>
        <div className="bg-white bg-opacity-10 p-4 rounded-xl shadow-inner hover:bg-opacity-15 transition-all duration-300">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-300 to-indigo-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
              A
            </div>
            <div className="ml-3">
              <p className="text-white text-sm font-medium">Admin User</p>
              <p className="text-indigo-200 text-xs">Administrator</p>
            </div>
            <button className="ml-auto p-2 text-indigo-200 hover:text-white rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-300">
              <FiLogOut />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );   
};

export default AdminNavbar;