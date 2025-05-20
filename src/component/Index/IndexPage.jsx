import { NavLink } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaPaw } from "react-icons/fa";
import Footer from "../Footer/Footer";
// Import NavBar but we'll handle it differently
import NavBar from "../Header/NavBar";

const IndexPage = () => { 
  return (
    <>
    
           

      {/* Hero Section with Green Gradient Overlay */}
      <div className="hero relative h-screen flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-teal-800/70 z-0"></div>
        
        {/* Place NavBar at the top with higher z-index to ensure it's usable */}
        <div className="flex justify-center items-center">
          <NavBar />
        </div>
        
        <div className="absolute bottom-20 left-12 z-10 max-w-2xl">
          <div className="flex items-center mb-4">
            <FaPaw className="text-green-300 text-3xl mr-3" />
            <div className="h-1 w-32 bg-green-300 rounded-full"></div>
          </div>
          <h1 className="text-white text-5xl font-bold leading-tight mb-3">
            Ensuring your pets live their <span className="text-green-300">best lives</span>
          </h1>
          <p className="text-gray-200 text-lg">
            Professional care with a personal touch
          </p>
        </div>
      </div>

      {/* About Section with Card Design */}
      <div className="bg-gradient-to-b from-green-50 to-white py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 flex flex-col gap-8">
              <div className="inline-block">
                <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  OUR MISSION
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Prioritizing your pet companion</h1>
              <p className="text-gray-600 leading-relaxed text-lg">
                At VetCare, our primary goal is to ensure that every pet we care for leads a happy, healthy life. 
                We are dedicated to providing the highest standard of veterinary care, delivered with compassion 
                and professionalism.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our team of experienced veterinarians and support staff work tirelessly to promote preventive care 
                for your lovely pet, providing comprehensive treatments and supporting through all life stages.
              </p>
            </div>
            <div className="md:w-2/5">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full bg-green-200 rounded-2xl"></div>
                <img 
                  src="/src/assets/cat.png" 
                  alt="cat" 
                  className="relative z-10 h-[500px] w-full object-cover rounded-2xl shadow-xl" 
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-400 rounded-full flex items-center justify-center">
                  <FaPaw className="text-white text-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section with Card Effect */}
      <div className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-2/5">
              <div className="relative group">
                <img 
                  src="/src/assets/4.jpg" 
                  alt="Vet Team" 
                  className="w-full rounded-2xl shadow-lg object-cover z-10 relative transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent rounded-2xl opacity-70"></div>
                <div className="absolute top-4 left-4 bg-green-400 text-white p-3 rounded-full">
                  <FaPaw className="text-2xl" />
                </div>
              </div>
            </div>
            <div className="md:w-3/5">
              <div className="inline-block mb-4">
                <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ABOUT US
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                VetCare is dedicated to providing the best veterinary care with compassion and professionalism.
                Our expert team ensures the health and well-being of your pets through preventive care and 
                advanced treatments.
              </p>
              <NavLink
                to="/about-us"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition transform hover:-translate-y-1 shadow-lg"
              >
                <span>Learn More</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section with Accent Colors */}
      <div className="bg-green-50 py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-3/5">
              <div className="inline-block mb-4">
                <span className="px-4 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                  CONTACT US
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                We are available 24/7 to assist you. Feel free to reach out to us for any queries.
              </p>
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaPhoneAlt className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Call us anytime</p>
                    <p className="text-lg font-medium">+977 9840753049</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email us</p>
                    <p className="text-lg font-medium">mail@vetcare.com</p>
                  </div>
                </div>
              </div>
              <NavLink
                to="/contact"
                className="inline-flex items-center gap-2 bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600 transition transform hover:-translate-y-1 shadow-lg"
              >
                <span>Contact Us</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </NavLink>
            </div>
            <div className="md:w-2/5">
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-full h-full bg-teal-200 rounded-2xl"></div>
                <img 
                  src="/src/assets/1.jpg" 
                  alt="Vet Contact" 
                  className="relative z-10 w-full rounded-2xl shadow-xl object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default IndexPage;