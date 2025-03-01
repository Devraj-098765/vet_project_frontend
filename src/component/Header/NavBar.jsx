import { FaUserCircle } from "react-icons/fa"; // User icon
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
    <nav className="relative bg-white px-6 py-3 rounded-full shadow-md space-x-6 flex items-center mt-10">
      <NavLink to="/" className="text-gray-600 hover:text-black">
        Vetcare
      </NavLink>

      <NavLink to="/consultation" className="text-gray-600 hover:text-black">
        Consultation
      </NavLink>

      <NavLink to="/all-veterinarians" className="text-gray-600 hover:text-black">
        All Veterinarians
      </NavLink>

      <NavLink to="/about-us" className="text-gray-600 hover:text-black">
        About
      </NavLink>

      <NavLink to="/contact" className="text-gray-600 hover:text-black">
        Contact
      </NavLink>

      {!auth.token ? (
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
          <NavLink to="/login">Sign up</NavLink>
        </button>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="text-gray-600 hover:text-black">
            <FaUserCircle size={30} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
              <NavLink
                to="/settings"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Settings
              </NavLink>
              <NavLink
                to="/report"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Report
              </NavLink>
              <NavLink
                to="/vacation-details"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Vacation Details
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      <button className="border border-gray-400 px-4 py-2 rounded-full hover:bg-gray-100">
        <NavLink to="/BookingVisitForm">Book Appointment</NavLink>
      </button>
    </nav>
  );
};

export default NavBar;
