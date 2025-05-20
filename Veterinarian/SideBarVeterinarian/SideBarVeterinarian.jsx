import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiCalendar, FiFileText, FiUser, FiLogOut, FiChevronLeft, FiChevronRight, FiDollarSign, FiHome, FiMenu, FiX } from "react-icons/fi";
import axiosInstance, { getBaseUrl } from "../../src/api/axios";

const SideBarVeterinarian = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [vetInfo, setVetInfo] = useState({ 
    name: "Veterinarian", 
    role: "Vet Specialist",
    image: null
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: <FiHome />, route: "/VeterinarianDashboard", tooltip: "Dashboard" },
    { name: "Appointments", icon: <FiCalendar />, route: "/Totalappointment", tooltip: "View Appointments" },
    { name: "Reports", icon: <FiFileText />, route: "/veterinarian-reports", tooltip: "View Reports" },
    { name: "Profile", icon: <FiUser />, route: "/Profile", tooltip: "Edit Profile" },
    { name: "Blog", icon: <FiFileText />, route: "/blog", tooltip: "View Blog" },
    { name: "Earning", icon: <FiDollarSign />, route: "/earning", tooltip: "View Earnings" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("vetapp-token");
    if (!token) return;

    axiosInstance.get("/veterinarians/me")
      .then(response => {
        const data = response.data;
        const imageUrl = data.image ? `${getBaseUrl()}${data.image}` : null;
        
        setVetInfo({
          name: data.name || "Veterinarian",
          role: data.specialization || "Vet Specialist",
          image: imageUrl,
        });
      })
      .catch(error => {
        console.error("Error fetching vet info:", error);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (route) => {
    navigate(route);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("vetapp-token");
    localStorage.removeItem("veterinarian-stats");
    setShowLogoutModal(false);
    navigate("/admin");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (route) => location.pathname === route;

  // Mobile menu toggle button
  const MobileMenuButton = () => (
    <button
      className="fixed top-4 left-4 z-50 bg-teal-500 text-white p-2 rounded-md shadow-md md:hidden"
      onClick={toggleMobileMenu}
      aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
    >
      {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
    </button>
  );

  // Main sidebar content
  const SidebarContent = () => (
    <>
      <div className="absolute inset-0 bg-blue-50/80 w-full h-full"></div>
      
      {/* Toggle button - only visible on tablet and above */}
      <div className="absolute top-2 right-3 z-10 hidden md:block">
        <button
          onClick={toggleCollapse}
          className="text-teal-600 hover:text-teal-700 p-1 rounded-full transition-all"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

      {/* Header with Logo */}
      <div className="relative z-10 px-4 pt-4 pb-2">
        <div 
          className={`flex items-center cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}
          onClick={() => handleNavigation("/VeterinarianDashboard")}
          role="button"
          tabIndex="0"
          aria-label="Go to Dashboard"
          onKeyDown={(e) => e.key === 'Enter' && handleNavigation("/VeterinarianDashboard")}
        >
          <div className="bg-teal-500 p-2 rounded-lg shadow-sm">
            <FiUser className="text-white text-lg" />
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-teal-800">Vetcare</h2>
              <p className="text-xs text-teal-600">Veterinary Portal</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 pt-2 pb-0 relative z-10 overflow-y-auto">
        {/* Veterinarian Profile Card */}
        <div className={`mb-6 ${isCollapsed ? 'px-0' : 'px-1'}`}>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-teal-100">
            <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center'}`}>
              {vetInfo.image ? (
                <img 
                  src={vetInfo.image} 
                  alt="Veterinarian profile" 
                  className={`rounded-full object-cover ${isCollapsed ? 'w-9 h-9' : 'w-10 h-10'} border-2 border-teal-200`}
                />
              ) : (
                <div className={`rounded-full bg-teal-500 flex items-center justify-center ${isCollapsed ? 'w-9 h-9' : 'w-10 h-10'}`}>
                  <FiUser className="text-white" />
                </div>
              )}
              {!isCollapsed && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-teal-800 font-medium truncate">{vetInfo.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow" aria-label="Main navigation">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.route);
              return (
                <li key={item.name} className="relative group">
                  <div 
                    className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg cursor-pointer transition-all ${
                      active
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-teal-700 hover:bg-teal-100"
                    }`}
                    onClick={() => handleNavigation(item.route)}
                    role="button"
                    tabIndex="0"
                    aria-label={item.name}
                    aria-current={active ? "page" : undefined}
                    onKeyDown={(e) => e.key === 'Enter' && handleNavigation(item.route)}
                  >
                    <span className={`text-lg ${active ? "text-white" : "text-teal-600"}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className={`ml-3 ${active ? "text-white font-medium" : "text-teal-800"}`}>
                        {item.name}
                      </span>
                    )}
                    {isCollapsed && (
                      <span className="absolute left-16 bg-teal-600 text-white text-xs font-medium rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                        {item.tooltip}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="pb-6 pt-2">
          <button
            onClick={handleLogoutClick}
            className={`group w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-teal-700 hover:bg-teal-100 rounded-lg transition-all`}
            aria-label="Logout"
          >
            <FiLogOut className="text-lg text-teal-600" aria-hidden="true" />
            {!isCollapsed && (
              <span className="ml-3 text-teal-800">
                Logout
              </span>
            )}
            {isCollapsed && (
              <span className="absolute left-16 bg-teal-600 text-white text-xs font-medium rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button - Always visible on mobile */}
      {isMobile && <MobileMenuButton />}

      {/* Sidebar for desktop and tablet */}
      <aside
        className={`bg-white fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 ease-in-out shadow-md overflow-hidden z-50
          ${isMobile 
            ? isMobileMenuOpen 
              ? 'w-72 translate-x-0' 
              : '-translate-x-full w-72'
            : isCollapsed 
              ? 'w-20' 
              : 'w-72'
          }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay - only visible when mobile menu is open */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Custom Logout Modal */}
      {showLogoutModal && (
        <div 
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <div className="bg-white rounded-xl p-5 w-72 sm:w-80 mx-4 shadow-lg">
            <h3 id="logout-modal-title" className="text-lg font-medium text-teal-800 mb-3">Confirm Logout</h3>
            <p className="text-gray-600 mb-5">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBarVeterinarian;