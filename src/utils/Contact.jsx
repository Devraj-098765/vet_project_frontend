import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaClock, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion"; 

import NavBar from "../component/Header/NavBar.jsx";
import Footer from "../component/Footer/Footer"; 

const Contact = () => {
  return (
    <>
      <div className="flex justify-center items-center">
       <NavBar />
      </div>

      {/* Hero Section - Redesigned with organic shapes */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-28 px-6 mt-16"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-20 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-400 opacity-20 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold leading-tight">We're Here to Help Your Pets!</h1>
          <p className="mt-4 text-xl text-emerald-100">Contact VetCare for professional veterinary support anytime.</p>
          <button className="mt-8 bg-white text-emerald-700 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-emerald-50 transition transform hover:-translate-y-1 hover:shadow-xl">
            Get in Touch
          </button>
        </div>
      </motion.div>

      {/* Contact Details - Redesigned with cards */}
      <div className="relative bg-gray-50 py-20 px-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e0f2f1_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 py-6 px-8">
              <h2 className="text-3xl font-bold text-white text-center">Contact Us</h2>
              <p className="text-center text-emerald-100 mt-2">We're available to assist you 24/7.</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Contact Info */}
                <div className="space-y-6 border-r-0 md:border-r border-gray-200 pr-0 md:pr-6">
                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                    <div className="bg-emerald-600 text-white p-3 rounded-full mr-4">
                      <FaPhoneAlt />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-700 font-semibold">Phone Number</p>
                      <p className="text-gray-700">+977 9840753049</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors">
                    <div className="bg-teal-600 text-white p-3 rounded-full mr-4">
                      <FaEnvelope />
                    </div>
                    <div>
                      <p className="text-sm text-teal-700 font-semibold">Email</p>
                      <p className="text-gray-700">support@vetcare.com</p>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Additional Info */}
                <div className="space-y-6 pl-0 md:pl-6">
                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                    <div className="bg-emerald-600 text-white p-3 rounded-full mr-4">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-700 font-semibold">Address</p>
                      <p className="text-gray-700">Vet Street, Kathmandu, Nepal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors">
                    <div className="bg-teal-600 text-white p-3 rounded-full mr-4">
                      <FaClock />
                    </div>
                    <div>
                      <p className="text-sm text-teal-700 font-semibold">Working Hours</p>
                      <p className="text-gray-700">Mon - Sat: 9 AM - 8 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <p className="text-center text-gray-600 mb-4">Connect with us on social media</p>
                <div className="flex justify-center space-x-6">
                  <a href="#" className="bg-emerald-50 p-3 rounded-full text-emerald-700 hover:bg-emerald-700 hover:text-white transition-colors">
                    <FaFacebook size={24} />
                  </a>
                  <a href="#" className="bg-teal-50 p-3 rounded-full text-teal-700 hover:bg-teal-700 hover:text-white transition-colors">
                    <FaInstagram size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Why Choose Us Section - Redesigned with cards */}
      <div className="py-20 px-6 relative overflow-hidden">
        {/* Background Element */}
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-100 rounded-full opacity-50"></div>
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-teal-100 rounded-full opacity-50"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-emerald-700 text-center relative inline-block">
            Why Choose VetCare?
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></span>
          </h2>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-emerald-500"
            >
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-emerald-600 text-2xl" />
              </div>
              <p className="text-center text-gray-800 font-medium text-lg">24/7 Emergency Care</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-teal-500"
            >
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-teal-600 text-2xl" />
              </div>
              <p className="text-center text-gray-800 font-medium text-lg">Highly Qualified Veterinarians</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-500"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
              <p className="text-center text-gray-800 font-medium text-lg">Affordable & Reliable Services</p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;