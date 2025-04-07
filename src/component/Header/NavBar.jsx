import { FaUserCircle, FaLeaf, FaBell } from "react-icons/fa"; // Added bell icon
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const NavBar = () => {
  // Simulated authentication state
  const { auth, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example count
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // Sample notifications
  const [notifications, setNotifications] = useState([
    // {
    //   id: 1,
    //   message: "Your appointment is confirmed for tomorrow",
    //   time: "2 hours ago",
    //   read: false
    // },
    // {
    //   id: 2,
    //   message: "Dr. Smith responded to your query",
    //   time: "Yesterday",
    //   read: false
    // },
    {
      id: 3,
      message: "  Your appointment will start at 3:15, so be ready. This is a reminder.",
      time: "3:45",
      read: false
    }
  ]);

  // Simulate logout
  const handleLogout = () => {
    setDropdownOpen(false);
    navigate("/login"); 
    logout();
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Toggle notification panel
  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
    if (!notificationOpen) {
      // Mark notifications as read when opening
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      setNotifications(updatedNotifications);
      setNotificationCount(0);
    }
  };

  // Mark a single notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    
    // Update notification count
    const unreadCount = updatedNotifications.filter(notification => !notification.read).length;
    setNotificationCount(unreadCount);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return ( 
    <nav className="relative bg-gradient-to-r from-green-50 to-green-100 px-8 py-4 rounded-xl shadow-md flex items-center justify-between mt-10 border-b-2 border-green-300">
      {/* Logo and name section */}
      <div className="flex items-center">
        <FaLeaf className="text-green-600 mr-2" size={20} />
        <NavLink to="/" className="text-green-800 font-medium text-lg tracking-wide hover:text-green-600 transition-colors">
          Vetcare
        </NavLink>
      </div>
      
      {/* Navigation links with hover effects */}
      <div className="flex space-x-2">
        <NavLink 
          to="/consultation" 
          className={({ isActive }) => 
            isActive 
              ? "bg-green-200 text-green-800 px-4 py-2 rounded-lg font-medium"
              : "text-green-700 px-4 py-2 hover:bg-green-100 rounded-lg transition-all duration-300"
          }
        >
          Consultation
        </NavLink>

        <NavLink 
          to="/user/veterinarians" 
          className={({ isActive }) => 
            isActive 
              ? "bg-green-200 text-green-800 px-4 py-2 rounded-lg font-medium"
              : "text-green-700 px-4 py-2 hover:bg-green-100 rounded-lg transition-all duration-300"
          }
        >
          All Veterinarians
        </NavLink>

        <NavLink 
          to="/about-us" 
          className={({ isActive }) => 
            isActive 
              ? "bg-green-200 text-green-800 px-4 py-2 rounded-lg font-medium"
              : "text-green-700 px-4 py-2 hover:bg-green-100 rounded-lg transition-all duration-300"
          }
        >
          About
        </NavLink>

        <NavLink 
          to="/contact" 
          className={({ isActive }) => 
            isActive 
              ? "bg-green-200 text-green-800 px-4 py-2 rounded-lg font-medium"
              : "text-green-700 px-4 py-2 hover:bg-green-100 rounded-lg transition-all duration-300"
          }
        >
          Contact
        </NavLink>
      </div>

      {/* Auth section */}
      <div className="flex items-center space-x-4">
        {auth.token && (
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={toggleNotification}
              className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition-colors duration-300 border border-green-300 relative"
            >
              <FaBell size={22} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            
            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-lg border border-green-200 overflow-hidden z-10">
                <div className="bg-green-50 px-4 py-2 border-b border-green-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-green-800">Notifications</h3>
                    <button 
                      className="text-xs text-green-600 hover:text-green-800"
                      onClick={() => {
                        const updatedNotifications = notifications.map(notification => ({
                          ...notification,
                          read: true
                        }));
                        setNotifications(updatedNotifications);
                        setNotificationCount(0);
                      }}
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 border-b border-green-50 hover:bg-green-50 transition-colors ${!notification.read ? 'bg-green-50' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between">
                          <p className={`text-sm ${!notification.read ? 'font-medium text-green-800' : 'text-green-700'}`}>
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-green-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-green-500">
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-green-50 py-2 px-4 border-t border-green-100">
                  <NavLink
                    to="/all-notifications"
                    className="text-xs text-green-600 hover:text-green-800 block text-center"
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
          <button className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition-colors duration-300">
            <NavLink to="/login">Sign up</NavLink>
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown} 
              className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition-colors duration-300 border border-green-300"
            >
              <FaUserCircle size={26} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-lg border border-green-200 overflow-hidden z-10">
                <NavLink
                  to={`/editprofile/${auth.userId}`}
                  className="flex px-4 py-3 text-green-800 hover:bg-green-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Edit profile 
                </NavLink>
                <NavLink
                  to="/my-report-card"
                  className="flex px-4 py-3 text-green-800 hover:bg-green-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Report
                </NavLink>
                <NavLink
                  to= { `/appointmenthistory/${auth.userId}` }
                  className="flex px-4 py-3 text-green-800 hover:bg-green-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Appointment Details
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-green-50 transition-colors border-t border-green-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;