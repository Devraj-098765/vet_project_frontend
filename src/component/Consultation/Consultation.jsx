import { NavLink } from "react-router-dom";
import NavBar from "../Header/Navbar";
import Footer from "../Footer/Footer";

const Consultation = () => {
  return (
    <>
      <div className="consultation flex flex-col items-center gap-16">
        <NavBar />
        <div className="absolute bottom-0 left-0 text-white text-[60px] font-bold p-4 ">
          Ensuring your pets live their best lives
        </div>
      </div>

      <div className="container mx-auto py-16 px-6 grid gap-12 md:grid-cols-2">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
          <img 
            src="/src/assets/2.jpg" 
            alt="Online Vet Consultation" 
            className="rounded-lg w-full h-[250px] object-cover mb-6"
          />
          <h2 className="text-3xl font-semibold">Connect with A Vet</h2>
          <p className="text-gray-600 mt-4 text-lg">
            Get expert veterinary care from the comfort of your home. Our online consultations provide 
            professional access to advice, follow-ups, and non-emergency consultations.
          </p>
          <NavLink 
            to="/online-consultation" 
            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition text-lg"
          >
            Consultation Online →
          </NavLink>
        </div>

        {/* Visit Our Clinic */}
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
          <img 
            src="/src/assets/3.jpg" 
            alt="Clinic Visit" 
            className="rounded-lg w-full h-[250px] object-cover mb-6"
          />
          <h2 className="text-3xl font-semibold">Visit Our Clinic</h2>
          <p className="text-gray-600 mt-4 text-lg">
            Visit our clinic for comprehensive veterinary care. Our experienced team provides thorough 
            examinations, advanced diagnostics, and personalized treatments for your pet’s well-being.
          </p>
          <NavLink 
            to="/clinic-visit" 
            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition text-lg"
          >
            Schedule a Visit →
          </NavLink>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Consultation;
