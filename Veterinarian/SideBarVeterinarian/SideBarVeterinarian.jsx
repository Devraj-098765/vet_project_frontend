import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiCalendar, FiFileText, FiUser, FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axiosInstance, { getBaseUrl } from "../../src/api/axios"; // Import getBaseUrl

const SideBarVeterinarian = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [vetInfo, setVetInfo] = useState({ 
    name: "Veterinarian", 
    role: "Vet Specialist",
    image: null
  });
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
        const token = localStorage.getItem("vetapp-token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const { data } = await axiosInstance.get("/veterinarians/me");
        
        // Format the image URL if it exists
        const imageUrl = data.image ? `${getBaseUrl()}${data.image}` : null;

        setVetInfo({
          name: data.name || "Veterinarian",
          role: data.specialization || "Vet Specialist",
          image: imageUrl,
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
      className={`bg-gradient-to-br from-green-800 via-green-700 to-green-600 rounded-r-xl shadow-xl h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } relative`}
    >
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-green-600 border-opacity-30">
        {!isCollapsed && (
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavigation("/VeterinarianDashboard")}
            role="button"
            tabIndex="0"
            aria-label="Go to Dashboard"
            onKeyDown={(e) => e.key === 'Enter' && handleNavigation("/VeterinarianDashboard")}
          >
            <div className="bg-white bg-opacity-20 p-2 rounded-full shadow-inner group-hover:bg-opacity-30 transition-all">
              <FiUser className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-white ml-3 group-hover:translate-x-0.5 transition-transform">Vetcare</h2>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="text-white hover:bg-white hover:bg-opacity-20 p-1.5 rounded-full transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow mt-6 px-2" aria-label="Main navigation">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.route);
            return (
              <li
                key={item.name}
                className={`relative group`}
              >
                <div 
                  className={`flex items-center px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    active
                      ? "bg-white bg-opacity-20 text-white shadow-md"
                      : "text-green-100 hover:bg-white hover:bg-opacity-10"
                  }`}
                  onClick={() => handleNavigation(item.route)}
                  role="button"
                  tabIndex="0"
                  aria-label={item.name}
                  aria-current={active ? "page" : undefined}
                  onKeyDown={(e) => e.key === 'Enter' && handleNavigation(item.route)}
                >
                  <div
                    className={`text-xl ${
                      active ? "text-white" : "text-green-200"
                    }`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className={`ml-3 font-medium ${active ? "translate-x-0.5" : ""} transition-transform`}>
                      {item.name}
                    </span>
                  )}
                  {isCollapsed && (
                    <span className="absolute left-14 bg-green-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                      {item.tooltip}
                    </span>
                  )}
                  {active && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-6 bg-white rounded-full shadow-sm" aria-hidden="true" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Veterinarian Info & Logout */}
      <div className="mt-auto p-4 border-t border-green-600 border-opacity-30">
        {!isCollapsed && (
          <div className="mb-4 bg-white bg-opacity-10 p-3 rounded-lg hover:bg-opacity-15 transition-colors shadow-inner">
            <div className="flex items-center">
              {vetInfo.image ? (
                <img 
                  src={vetInfo.image} 
                  alt="Veterinarian profile" 
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-white border-opacity-30"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0 border-2 border-white border-opacity-20" aria-hidden="true">
                  <FiUser className="text-white" />
                </div>
              )}
              <div className="ml-3 overflow-hidden">
                <p className="text-white text-sm font-medium truncate">{vetInfo.name}</p>
                <p className="text-green-200 text-xs truncate">{vetInfo.role}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogoutClick}
          className={`group w-full flex items-center px-3 py-3 text-green-100 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 ${
            isCollapsed ? "justify-center" : ""
          }`}
          aria-label="Logout"
        >
          <FiLogOut className="text-xl text-green-200 flex-shrink-0 group-hover:text-white transition-colors" aria-hidden="true" />
          {!isCollapsed && <span className="ml-3 font-medium group-hover:translate-x-0.5 transition-transform">Logout</span>}
          {isCollapsed && (
            <span className="absolute left-14 bg-green-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
              Logout
            </span>
          )}
        </button>
      </div>

      {/* Custom Logout Modal */}
      {showLogoutModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 id="logout-modal-title" className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
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