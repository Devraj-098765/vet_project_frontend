import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiCalendar, FiFileText, FiUser, FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axiosInstance from "../../src/api/axios"; // Assuming this is your axios setup

const SideBarVeterinarian = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [vetInfo, setVetInfo] = useState({ name: "Veterinarian", role: "Vet Specialist" });
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal

  // Navigation items
  const navItems = [
    { name: "Appointments", icon: <FiCalendar />, route: "/Totalappointment", tooltip: "View Appointments" },
    { name: "Reports", icon: <FiFileText />, route: "/veterinarian-reports", tooltip: "View Reports" },
    { name: "Profile", icon: <FiUser />, route: "/Profile", tooltip: "Edit Profile" },
    { name: "Blog", icon: <FiFileText />, route: "/blog", tooltip: "View Blog" },
  ];

  // Fetch veterinarian info on mount
  useEffect(() => {
    const fetchVetInfo = async () => {
      try {
        const { data } = await axiosInstance.get("/veterinarians"); // Adjust endpoint as per your backend
        setVetInfo({
          name: data.name || "Veterinarian",
          role: data.role || "Vet Specialist",
        });
      } catch (error) {
        console.error("Error fetching vet info:", error);
      }
    };
    fetchVetInfo();
  }, []);

  // Handle navigation
  const handleNavigation = (route) => {
    navigate(route);
  };

  // Show logout modal
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Confirm logout
  const confirmLogout = () => {
    localStorage.removeItem("vetapp-token"); // Clear token
    localStorage.removeItem("veterinarian-stats"); // Clear stats
    setShowLogoutModal(false); // Close modal immediately
    navigate("/admin"); // Navigate immediately
  };

  // Cancel logout
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Determine active item based on current route
  const isActive = (route) => location.pathname === route;

  return (
    <aside
      className={`bg-gradient-to-b from-green-800 to-green-600 rounded-r-xl shadow-xl h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("/VeterinarianDashboard")}
          >
            <div className="bg-green-500 bg-opacity-20 p-2 rounded-full">
              <FiUser className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-white ml-2">Vetcare</h2>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="text-white hover:bg-green-500 hover:bg-opacity-20 p-1 rounded-full transition-colors"
        >
          {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow mt-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li
              key={item.route}
              className={`relative flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                isActive(item.route)
                  ? "bg-green-500 bg-opacity-20 text-white shadow-md"
                  : "text-green-100 hover:bg-green-500 hover:bg-opacity-10"
              }`}
              onClick={() => handleNavigation(item.route)}
            >
              <div
                className={`text-xl ${
                  isActive(item.route) ? "text-white" : "text-green-200"
                }`}
              >
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
              {isCollapsed && (
                <span className="absolute left-14 bg-green-700 text-white text-xs rounded-md px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                  {item.tooltip}
                </span>
              )}
              {isActive(item.route) && !isCollapsed && (
                <div className="ml-auto w-1 h-6 bg-green-300 rounded-full" />
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Veterinarian Info & Logout */}
      <div className="mt-auto p-4">
        {!isCollapsed && (
          <div className="mb-4 bg-green-500 bg-opacity-10 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-200 flex-shrink-0" />
              <div className="ml-3 overflow-hidden">
                <p className="text-white text-sm font-medium truncate">{vetInfo.name}</p>
                <p className="text-green-200 text-xs truncate">{vetInfo.role}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogoutClick}
          className={`w-full flex items-center px-4 py-3 text-green-100 hover:bg-green-500 hover:bg-opacity-10 rounded-lg transition-all duration-300 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <FiLogOut className="text-xl text-green-200 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          {isCollapsed && (
            <span className="absolute left-14 bg-green-700 text-white text-xs rounded-md px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
              Logout
            </span>
          )}
        </button>
      </div>

      {/* Custom Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SideBarVeterinarian;