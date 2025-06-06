import { FaUserCircle, FaLeaf, FaBell, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../api/axios.js";
import toast, { Toaster } from 'react-hot-toast';
import ReactDOM from 'react-dom';

const NavBar = () => {
  const { auth, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [auth.token]);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/bookings/notifications');
      const newNotifications = response.data.filter(n => !n.read);
      setNotifications(response.data);
      setNotificationCount(newNotifications.length);

      newNotifications.forEach(notification => {
        toast(
          <div>
            <p>{notification.message}</p>
            <p className="text-xs text-green-500">{notification.time}</p>
          </div>,
          {
            position: 'top-right',
            duration: 5000,
            style: {
              border: '1px solid #10B981',
              padding: '16px',
              color: '#10B981',
              background: '#F0FDF4',
            },
            onClick: () => {
              // Navigate to the relevant page based on notification type
              if (notification.message.includes('report')) {
                navigate('/my-report-card');
              }
              markAsRead(notification._id);
            },
          }
        );
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 500) {
        toast.error('Server error fetching notifications. Please try again later.');
      } else if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        logout();
      }
    }
  };

  const handleLogout = () => {
    setIsModalOpen(true); // Open the modal when logout is clicked
  };

  const confirmLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setIsModalOpen(false); // Close the modal
    logout();
    navigate("/");
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal without logging out
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
    if (!notificationOpen && notificationCount > 0) {
      markAllAsRead();
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/bookings/notifications/${id}/read`);
      const updatedNotifications = notifications.map(notification =>
        notification._id === id ? { ...notification, read: true } : notification
      );
      setNotifications(updatedNotifications);
      setNotificationCount(updatedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
      await Promise.all(unreadIds.map(id => axiosInstance.put(`/bookings/notifications/${id}/read`)));
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setNotificationCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Toaster />
      <nav className="relative bg-gradient-to-r from-green-50 to-green-100 px-4 sm:px-8 py-4 rounded-xl shadow-md flex items-center justify-between mt-10 border-b-2 border-green-300">
        <div className="flex items-center">
          <FaLeaf className="text-green-600 mr-2" size={20} />
          <NavLink to="/" className="text-green-800 font-serif font-medium text-lg tracking-wide hover:text-green-600 transition-colors">
            Vetcare
          </NavLink>
        </div>

        <div className="hidden md:flex space-x-2">
          <NavLink 
            to="/consultation" 
            className={({ isActive }) => 
              isActive 
                ? "bg-green-200 text-green-800 px-4 py-2 rounded-lg font-sans font-medium"
                : "text-green-700 px-4 py-2 hover:bg-green-100 rounded-lg transition-all duration-300 font-sans"
            }
          >
            Consultation
          </NavLink>

          <NavLink 
            to="/user/veterinarians" 
            className={({ isActive }) => 
              isActive 
                ? "bg-green-200 text-green-800 px-4 py-2 rounded-lg font-sans font-medium"
                : "text-green-700 px-4 py-2 hover:bg-green-100 rounded-lg transition-all duration-300 font-sans"
            }
          >
            All Veterinarians
          </NavLink>

          <NavLink 
            to="/about-us" 
            className={({ isActive }) => 
              isActive 
                ? "bg-green-200 text-green-800 px-4 py-2 rounded-lg font-sans font-medium"
                : "text-green-700 px-4 py-2 hover:bg-green-100 rounded-lg transition-all duration-300 font-sans"
            }
          >
            About
          </NavLink>

          <NavLink 
            to="/blogs" 
            className={({ isActive }) => 
              isActive 
                ? "bg-green-200 text-green-800 px-4 py-2 rounded-lg font-sans font-medium"
                : "text-green-700 px-4 py-2 hover:bg-green-100 rounded-lg transition-all duration-300 font-sans"
            }
          >
            Blog
          </NavLink>

          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              isActive 
                ? "bg-green-200 text-green-800 px-4 py-2 rounded-lg font-sans font-medium"
                : "text-green-700 px-4 py-2 hover:bg-green-100 rounded-lg transition-all duration-300 font-sans"
            }
          >
            Contact
          </NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            className="md:hidden text-green-700 p-2 hover:bg-green-100 rounded-lg transition-colors font-sans"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          {auth.token && (
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={toggleNotification}
                className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition-colors duration-300 border border-green-300 relative font-sans"
              >
                <FaBell size={22} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-sans">
                    {notificationCount}
                  </span>
                )}
              </button>
              
              {notificationOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-lg border border-green-200 overflow-hidden z-10">
                  <div className="bg-green-50 px-4 py-2 border-b border-green-100">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif font-medium text-green-800">Notifications</h3>
                      <button 
                        className="text-xs text-green-600 hover:text-green-800 font-sans"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification._id}
                          className={`px-4 py-3 border-b border-green-50 hover:bg-green-50 transition-colors ${!notification.read ? 'bg-green-50' : ''}`}
                          onClick={() => {
                            markAsRead(notification._id);
                            if (notification.message.includes('report')) {
                              navigate('/my-report-card');
                            }
                          }}
                        >
                          <div className="flex justify-between">
                            <p className={`text-sm ${!notification.read ? 'font-sans font-medium text-green-800' : 'text-green-700 font-sans'}`}>
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-green-500 mt-1 font-sans">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-green-500 font-sans">
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-green-50 py-2 px-4 border-t border-green-100">
                    <NavLink
                      to="/all-notifications"
                      className="text-xs text-green-600 hover:text-green-800 block text-center font-sans"
                      onClick={() => setNotificationOpen(false)}
                    >
                      View all notifications
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!auth.token ? (
            <button className="bg-green-600 text-white px-4 sm:px-5 py-2 rounded-lg shadow hover:bg-green-700 transition-colors duration-300 text-sm sm:text-base font-sans">
              <NavLink to="/login">Sign up</NavLink>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown} 
                className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition-colors duration-300 border border-green-300 font-sans"
              >
                <FaUserCircle size={26} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-lg border border-green-200 overflow-visible z-50">
                  <NavLink
                    to={`/editprofile/${auth.userId}`}
                    className="flex px-4 py-3 text-green-800 hover:bg-green-50 transition-colors font-sans"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Edit profile 
                  </NavLink>
                  <NavLink
                    to="/my-report-card"
                    className="flex px-4 py-3 text-green-800 hover:bg-green-50 transition-colors font-sans"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Report
                  </NavLink>
                  <NavLink
                    to={`/appointmenthistory/${auth.userId}`}
                    className="flex px-4 py-3 text-green-800 hover:bg-green-50 transition-colors font-sans"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Appointment Details
                  </NavLink>
                  <NavLink
                    to="/payments/history"
                    className="flex px-4 py-3 text-green-800 hover:bg-green-50 transition-colors font-sans"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Payment History
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-green-50 transition-colors border-t border-green-100 font-sans"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="absolute top-16 right-0 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-10 border border-green-200 md:hidden"
          >
            <NavLink 
              to="/consultation" 
              className={({ isActive }) => 
                isActive 
                  ? "block px-4 py-3 bg-green-100 text-green-800 font-sans font-medium"
                  : "block px-4 py-3 text-green-700 hover:bg-green-50 transition-colors font-sans"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Consultation
            </NavLink>
            
            <NavLink 
              to="/user/veterinarians" 
              className={({ isActive }) => 
                isActive 
                  ? "block px-4 py-3 bg-green-100 text-green-800 font-sans font-medium"
                  : "block px-4 py-3 text-green-700 hover:bg-green-50 transition-colors font-sans"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              All Veterinarians
            </NavLink>

            <NavLink 
              to="/about-us" 
              className={({ isActive }) => 
                isActive 
                  ? "block px-4 py-3 bg-green-100 text-green-800 font-sans font-medium"
                  : "block px-4 py-3 text-green-700 hover:bg-green-50 transition-colors font-sans"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </NavLink>

            <NavLink
              to="/blogs"
              className="block px-4 py-3 text-green-800 hover:bg-green-50 transition-colors font-sans"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </NavLink>

            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                isActive 
                  ? "block px-4 py-3 bg-green-100 text-green-800 font-sans font-medium"
                  : "block px-4 py-3 text-green-700 hover:bg-green-50 transition-colors font-sans"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </NavLink>

            {auth.token && (
              <>
                <div className="border-t border-green-100 my-2"></div>
                <NavLink
                  to={`/editprofile/${auth.userId}`}
                  className="block px-4 py-3 text-green-800 hover:bg-green-50 transition-colors font-sans"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Edit profile
                </NavLink>
                <NavLink
                  to="/my-report-card"
                  className="block px-4 py-3 text-green-800 hover:bg-green-50 transition-colors font-sans"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Report
                </NavLink>
                <NavLink
                  to={`/appointmenthistory/${auth.userId}`}
                  className="block px-4 py-3 text-green-800 hover:bg-green-50 transition-colors font-sans"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Appointment Details
                </NavLink>
                <NavLink
                  to="/payments/history"
                  className="block px-4 py-3 text-green-800 hover:bg-green-50 transition-colors font-sans"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Payment History
                </NavLink>
                <NavLink
                  to="/blogs"
                  className="block px-4 py-3 text-green-800 hover:bg-green-50 transition-colors font-sans"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-green-50 transition-colors border-t border-green-100 font-sans"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {isModalOpen && ReactDOM.createPortal(
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeModal}></div>
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 w-80 p-6">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute -top-3 -right-3 text-white bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700 transition-colors font-sans"
              >
                ✕
              </button>

              {/* Modal Content */}
              <h3 className="text-lg font-serif font-semibold text-black mb-2">Confirm Logout</h3>
              <p className="text-gray-600 mb-6 font-sans">Are you sure you want to log out?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-sans"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-sans"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </>,
        document.getElementById('modal-root')
      )}
    </>
  );
};

export default NavBar;