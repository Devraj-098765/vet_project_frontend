import { FaUserCircle, FaLeaf } from "react-icons/fa"; // Changed to leaf icon
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const NavBar = () => {
  // Simulated authentication state
  const { auth, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
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
      <div className="flex items-center">
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
                  to="/settings"
                  className="flex px-4 py-3 text-green-800 hover:bg-green-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Edit profile 
                </NavLink>
                <NavLink
                  to="/report"
                  className="flex px-4 py-3 text-green-800 hover:bg-green-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Report
                </NavLink>
                <NavLink
                  to="/vacation-details"
                  className="flex px-4 py-3 text-green-800 hover:bg-green-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Vacation Details
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