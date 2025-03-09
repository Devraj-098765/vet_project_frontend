import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-50 to-emerald-50 py-16 mt-16 relative overflow-hidden">
      {/* Decorative paw print patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
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
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
          
          {/* Left Section: Navigation with curved background */}
          <div className="bg-white p-6 rounded-lg shadow-md transform md:rotate-1 border-l-4 border-emerald-500">
            <h2 className="text-xl font-bold text-emerald-800 mb-2">Vetcare</h2>
            <ul className="mt-3 space-y-3 text-gray-700">
              <li><a href="#" className="hover:text-emerald-600 transition-colors duration-300 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                Consultation
              </a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors duration-300 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                All veterinarians
              </a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors duration-300 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                About US
              </a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors duration-300 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                Book Appointment
              </a></li>
            </ul>
          </div>

          {/* Middle Section: Contact with curved background in opposite direction */}
          <div className="bg-white p-6 rounded-lg shadow-md transform md:-rotate-1 border-t-4 border-emerald-500">
            <h2 className="text-xl font-bold text-emerald-800 mb-2">Stay Connected</h2>
            <p className="text-gray-600 mt-2">Contact:</p>
            <p className="text-emerald-700 font-medium">hi.Vetpeople@Vetcare.com</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="bg-emerald-100 p-3 rounded-full hover:bg-emerald-200 transition-colors duration-300">
                <FaFacebookF className="text-emerald-700" size={18} />
              </div>
              <div className="bg-emerald-100 p-3 rounded-full hover:bg-emerald-200 transition-colors duration-300">
                <FaInstagram className="text-emerald-700" size={20} />
              </div>
            </div>
          </div>

          {/* Right Section: Promo with paw print decoration */}
          <div className="bg-white p-6 rounded-lg shadow-md transform md:rotate-1 border-r-4 border-emerald-500 relative">
            <div className="absolute -top-3 -right-3 bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
              10%
            </div>
            <h2 className="text-xl font-bold text-emerald-800 mb-2">Join as Vetfamily and get 10% OFF</h2>
            <p className="text-gray-600 mt-2">Our services are wide open for you</p>
            <button className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-lg shadow-md">
              Be Vetfamily
            </button>
          </div>
        </div>

        {/* Bottom Section: Copyright with wave pattern */}
        <div className="relative mt-16 pt-8 text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200"></div>
          <p className="text-emerald-800 text-sm">
            Abhisekkhatri@gmail.com • <a href="#" className="text-emerald-600 hover:underline">Terms and Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;