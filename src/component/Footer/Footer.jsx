import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { NavLink } from "react-router-dom"; // Import NavLink

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-green-50 to-emerald-50 py-12 mt-16 overflow-hidden">
      {/* Decorative paw print patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-6 left-12 transform rotate-12">
          <div className="w-4 h-4 rounded-full bg-emerald-900"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-900 absolute -top-6 -left-1"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-900 absolute -top-6 left-5"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-900 absolute -top-1 -left-5"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-900 absolute -top-1 left-9"></div>
        </div>
        <div className="absolute bottom-16 right-24 transform -rotate-12">
          <div className="w-4 h-4 rounded-full bg-emerald-900"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-900 absolute -top-6 -left-1"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-900 absolute -top-6 left-5"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-900 absolute -top-1 -left-5"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-900 absolute -top-1 left-9"></div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Left Section: Navigation */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-emerald-500">
            <h2 className="text-xl font-serif font-bold text-emerald-800 mb-4">Vetcare</h2>
            <ul className="space-y-3 text-gray-700 font-sans">
              <li>
                <NavLink
                  to="/consultation"
                  className={({ isActive }) =>
                    isActive
                      ? "text-emerald-600 flex items-center font-medium"
                      : "hover:text-emerald-600 transition-colors duration-300 flex items-center"
                  }
                >
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  Consultation
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/user/veterinarians"
                  className={({ isActive }) =>
                    isActive
                      ? "text-emerald-600 flex items-center font-medium"
                      : "hover:text-emerald-600 transition-colors duration-300 flex items-center"
                  }
                >
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  All Veterinarians
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about-us"
                  className={({ isActive }) =>
                    isActive
                      ? "text-emerald-600 flex items-center font-medium"
                      : "hover:text-emerald-600 transition-colors duration-300 flex items-center"
                  }
                >
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  About US
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Middle Section: Contact */}
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-emerald-500">
            <h2 className="text-xl font-serif font-bold text-emerald-800 mb-2">Stay Connected</h2>
            <p className="text-gray-600 mt-2 font-sans">Contact:</p>
            <p className="text-emerald-700 font-sans font-medium">hi.Vetpeople@Vetcare.com</p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-100 p-3 rounded-full hover:bg-emerald-200 transition-colors duration-300"
              >
                <FaFacebookF className="text-emerald-700" size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-100 p-3 rounded-full hover:bg-emerald-200 transition-colors duration-300"
              >
                <FaInstagram className="text-emerald-700" size={20} />
              </a>
            </div>
          </div>

          {/* Right Section: Promo */}
          <div className="bg-white p-6 rounded-lg shadow-md border-r-4 border-emerald-500 relative">
            <div className="absolute -top-3 -right-3 bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-serif font-bold">
              10%
            </div>
            <h2 className="text-xl font-serif font-bold text-emerald-800 mb-2">Join as Vetfamily and get 10% OFF</h2>
            <p className="text-gray-600 mt-2 font-sans">Our services are wide open for you</p>
            <button className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-lg shadow-md font-sans">
              Be Vetfamily
            </button>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="relative mt-12 pt-8 text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200"></div>
          <p className="text-emerald-800 text-sm font-sans">
          vetcaresystem12@gmail.com {" "}
            <NavLink to="/terms" className="text-emerald-600 hover:underline font-sans">
              Terms and Privacy Policy
            </NavLink>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;