import { NavLink } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import Footer from "../Footer/Footer"; // Import Footer Component
import NavBar from "../Header/Navbar";

const IndexPage = () => { 
  return (
    <>
      <div className="hero flex flex-col items-center gap-16">
        <NavBar />
        <div className="absolute bottom-0 left-0 text-white text-[60px] font-bold p-4 ">
          Ensuring your pets live their best lives
        </div>
      </div>

      <div className="bg-[#f3f4f6]">
        <div className="flex custom-container gap-5 py-[100px]">
          <div className="flex-1 flex flex-col gap-5 mt-20">
            <h1 className="text-3xl font-semibold">Prioritizing your pet companion</h1>
            <p className="max-w-[700px] leading-relaxed text-base font-normal">
              At VetCare, our primary goal is to ensure that every pet we care for leads a happy, healthy life. 
              We are dedicated to providing the highest standard of veterinary care, delivered with compassion 
              and professionalism.<br />
              Our team of experienced veterinarians and support staff work tirelessly to promote preventive care 
              for your lovely pet, providing comprehensive treatments and supporting through all life stages.
            </p>
          </div>

          <div>
            <img src="/src/assets/cat.png" alt="cat" className="h-[500px] object-cover" />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
          <img src="/src/assets/4.jpg" alt="Vet Team" className="w-full md:w-1/3 rounded-lg shadow-lg object-cover" />
          <div className="md:w-2/3">
            <h2 className="text-3xl font-semibold"><span className="text-blue-500 font-semibold">About Us</span><br />Who We Are</h2>
            <p className="text-gray-700 leading-relaxed mt-2">
              VetCare is dedicated to providing the best veterinary care with compassion and professionalism.
              Our expert team ensures the health and well-being of your pets through preventive care and 
              advanced treatments.
            </p>
            <NavLink
              to="/about-us"
              className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
            >
              Show More
            </NavLink>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <h2 className="text-3xl font-semibold"><span className="text-blue-500 font-semibold">Contact Us</span><br />Get in Touch</h2>
            <p className="text-gray-700 leading-relaxed mt-2">
              We are available 24/7 to assist you. Feel free to reach out to us for any queries.
            </p>
            <div className="mt-4 space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-blue-500" /> +977 9840753049
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500" /> mail@vetcare.com
              </p>
            </div>
            <NavLink
              to="/contact"
              className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
            >
              Show More
            </NavLink>
          </div>
          <img src="/src/assets/1.jpg" alt="Vet Contact" className="w-full md:w-1/3 rounded-lg shadow-lg object-cover" />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default IndexPage;
