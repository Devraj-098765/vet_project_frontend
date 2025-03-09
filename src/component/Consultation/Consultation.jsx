import { NavLink } from "react-router-dom";
import NavBar from "../Header/Navbar";
import Footer from "../Footer/Footer";

const Consultation = () => {
  return (
    <>
      {/* Hero Section with Background Image */}
      <div className="relative h-screen">
        {/* Background Image */}
        <img 
          src="/src/assets/1.jpg" 
          alt="Pets Living Their Best Lives" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-green-700/60 z-0"></div>
        
        <div className="flex justify-center items-center">
          <NavBar />
        </div>
        <div className="absolute bottom-0 left-0 text-white text-[60px] font-bold p-8 z-10">
          Ensuring your pets live their best lives
        </div>
      </div>

      {/* Consultation Options Section */}
      <div className="relative bg-green-50 py-24">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-100 rounded-full -ml-24 -mb-24 opacity-50"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              OUR SERVICES
            </span>
            <h1 className="text-4xl font-bold text-gray-800">Choose Your Consultation Option</h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We offer flexible ways to provide veterinary care for your beloved pets
            </p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-2 relative z-10">
            {/* Online Consultation Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl shadow-xl flex flex-col h-full transform group-hover:-translate-y-2 transition duration-300">
                <div className="relative mb-8 overflow-hidden rounded-xl">
                  <img 
                    src="/src/assets/2.jpg" 
                    alt="Online Vet Consultation" 
                    className="w-full h-[250px] object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Remote Care
                </div>
                <h2 className="text-3xl font-semibold text-gray-800">Connect with A Vet</h2>
                <p className="text-gray-600 mt-4 text-lg flex-grow">
                  Get expert veterinary care from the comfort of your home. Our online consultations provide 
                  professional access to advice, follow-ups, and non-emergency consultations.
                </p>
                <div className="mt-8">
                  <NavLink 
                    to="/online-consultation" 
                    className="inline-flex items-center justify-center w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-lg shadow-md group-hover:shadow-lg"
                  >
                    <span>Consultation Online</span>
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Clinic Visit Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl shadow-xl flex flex-col h-full transform group-hover:-translate-y-2 transition duration-300">
                <div className="relative mb-8 overflow-hidden rounded-xl">
                  <img 
                    src="/src/assets/3.jpg" 
                    alt="Clinic Visit" 
                    className="w-full h-[250px] object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>
                <div className="absolute top-4 right-4 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                  In-Person Care
                </div>
                <h2 className="text-3xl font-semibold text-gray-800">Visit Our Clinic</h2>
                <p className="text-gray-600 mt-4 text-lg flex-grow">
                  Visit our clinic for comprehensive veterinary care. Our experienced team provides thorough 
                  examinations, advanced diagnostics, and personalized treatments for your pet's well-being.
                </p>
                <div className="mt-8">
                  <NavLink 
                    to="/clinic-visit" 
                    className="inline-flex items-center justify-center w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition text-lg shadow-md group-hover:shadow-lg"
                  >
                    <span>Schedule a Visit</span>
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Consultation;