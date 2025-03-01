import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10 mt-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start">
        
        {/* Left Section: Navigation */}
        <div>
          <h2 className="text-lg font-semibold">Vetcare</h2>
          <ul className="mt-3 space-y-2 text-gray-600">
            <li><a href="#" className="hover:underline">Consultation</a></li>
            <li><a href="#" className="hover:underline">All veterinarians</a></li>
            <li><a href="#" className="hover:underline">About US</a></li>
            <li><a href="#" className="hover:underline">Book Appiontment  </a></li>
          </ul>
        </div>

        {/* Middle Section: Contact */}
        <div>
          <h2 className="text-lg font-semibold">Stay Connected</h2>
          <p className="text-gray-600 mt-2">Contact:</p>
          <p className="text-gray-700 font-medium">hi.Vetpeople@Vetcare.com</p>
          <div className="flex items-center gap-3 mt-3 text-gray-700">
            <FaFacebookF className="cursor-pointer hover:text-gray-900" size={20} />
            <FaInstagram className="cursor-pointer hover:text-gray-900" size={22} />
          </div>
        </div>

        {/* Right Section: Promo */}
        <div>
          <h2 className="text-lg font-semibold">Join as Vetfamily and get 10% OFF</h2>
          <p className="text-gray-600 mt-2">Our services are wide open for you</p>
          <button className="mt-4 px-5 py-2 border border-black rounded-full hover:bg-gray-200">
            Be Vetfamily
          </button>
        </div>
      </div>

      {/* Bottom Section: Copyright */}
      <div className="text-center text-gray-500 text-sm mt-8">
        © Vetcare.co • <a href="#" className="hover:underline">Terms and Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
