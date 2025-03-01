import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaClock, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion"; 
import NavBar from "../component/Header/NavBar";
import Footer from "../component/Footer/Footer"; 

const Contact = () => {
  return (
    <>
      
      <div className="flex justify-center items-center">
       <NavBar />
      </div>

  

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-blue-500 text-white text-center py-16 px-6"
      >
        <h1 className="text-4xl font-bold">We’re Here to Help Your Pets!</h1>
        <p className="mt-2 text-lg">Contact VetCare for professional veterinary support anytime.</p>
        <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-full text-lg font-semibold shadow-md hover:bg-gray-200 transition">
          Get in Touch
        </button>
      </motion.div>

      {/* Contact Details */}
      <div className="bg-gray-100 py-16 px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8"
        >
          <h2 className="text-3xl font-bold text-center text-blue-600">Contact Us</h2>
          <p className="text-center text-gray-600 mt-2">We’re available to assist you 24/7.</p>

          <div className="mt-6 space-y-4 text-gray-700 text-center">
            <p className="flex justify-center items-center gap-2 text-lg">
              <FaPhoneAlt className="text-blue-500" /> +977 9840753049
            </p>
            <p className="flex justify-center items-center gap-2 text-lg">
              <FaEnvelope className="text-blue-500" /> support@vetcare.com
            </p>
            <p className="flex justify-center items-center gap-2 text-lg">
              <FaMapMarkerAlt className="text-blue-500" /> Vet Street, Kathmandu, Nepal
            </p>
            <p className="flex justify-center items-center gap-2 text-lg">
              <FaClock className="text-blue-500" /> Mon - Sat: 9 AM - 8 PM
            </p>
          </div>

          {/* Social Media */}
          <div className="mt-6 flex justify-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600"><FaFacebook size={30} /></a>
            <a href="#" className="text-gray-600 hover:text-blue-600"><FaInstagram size={30} /></a>
          </div>
        </motion.div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-blue-600">Why Choose VetCare?</h2>
        <div className="mt-6 max-w-4xl mx-auto space-y-4 text-gray-700">
          <p className="flex items-center justify-center gap-2 text-lg">
            <FaCheckCircle className="text-green-500" /> 24/7 Emergency Care
          </p>
          <p className="flex items-center justify-center gap-2 text-lg">
            <FaCheckCircle className="text-green-500" /> Highly Qualified Veterinarians
          </p>
          <p className="flex items-center justify-center gap-2 text-lg">
            <FaCheckCircle className="text-green-500" /> Affordable & Reliable Services
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
