import React from "react";
import { NavLink } from "react-router-dom";
import Footer from "../Footer/Footer";
import NavBar from "../Header/Navbar";

const AboutUs = () => {
  return (
    <>
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
      
      {/* Hero Section - Redesigned with soft green gradient */}
      <header className="relative mt-16 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-800 via-green-700 to-teal-600 transform -skew-y-3"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-emerald-200 opacity-20 rounded-tl-full"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-black text-white leading-tight">
              Who We Are at <span className="text-emerald-200">VetCare</span>
            </h1>
            <p className="text-xl mt-6 text-green-100 font-light max-w-2xl">
              Committed to the highest standards of pet care with love and professionalism.
            </p>
          </div>
        </div>
      </header>

      {/* Who We Are Section - Card-based design with floating elements */}
      <section className="container mx-auto px-6 py-24 relative">
        <div className="absolute top-16 right-10 w-24 h-24 bg-emerald-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-teal-200 rounded-full opacity-20"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative">
            <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl"></div>
            <img 
              src="/src/assets/4.jpg" 
              alt="Vet Team" 
              className="w-full relative z-10 rounded-2xl shadow-2xl hover:transform hover:translate-y-2 transition duration-500" 
            />
          </div>
          
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-8 text-emerald-800 relative">
              Why Choose <span className="text-teal-600">VetCare</span>?
              <span className="absolute -bottom-3 left-0 w-20 h-1 bg-emerald-300"></span>
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Our highly experienced veterinarians provide compassionate care with state-of-the-art medical technology.
              We focus on preventive healthcare and customized treatment for your pet's best health.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mt-6">
              Whether it's a routine check-up, emergency care, or pet nutrition, we're here to help your furry friends live a happy and healthy life.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Soft green cards */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 transform rotate-3"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-16 text-emerald-800 inline-block relative">
            Why People Trust Us
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-emerald-300"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group">
              <div className="p-8 bg-white shadow-lg rounded-2xl border-t-4 border-emerald-500 hover:border-teal-400 transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-all duration-300">
                  <span className="text-3xl">🐶</span>
                </div>
                <h3 className="text-xl font-bold text-emerald-800">Expert Veterinarians</h3>
                <p className="text-gray-600 mt-4">Our team is made up of the best professionals in the field.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="p-8 bg-white shadow-lg rounded-2xl border-t-4 border-teal-500 hover:border-emerald-400 transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-all duration-300">
                  <span className="text-3xl">🚑</span>
                </div>
                <h3 className="text-xl font-bold text-teal-800">24/7 Emergency Services</h3>
                <p className="text-gray-600 mt-4">We are available around the clock for critical care.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="p-8 bg-white shadow-lg rounded-2xl border-t-4 border-green-500 hover:border-teal-400 transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-100 transition-all duration-300">
                  <span className="text-3xl">📅</span>
                </div>
                <h3 className="text-xl font-bold text-green-800">Easy Online Booking</h3>
                <p className="text-gray-600 mt-4">Schedule your appointments hassle-free.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services - Soothing green cards */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-emerald-800 relative inline-block">
          Our Services
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-emerald-300"></span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
            <div className="p-8 bg-white shadow-lg rounded-lg hover:shadow-2xl transition duration-300 group-hover:bg-emerald-50">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-6 text-emerald-600 group-hover:bg-emerald-200 transition-all duration-300">
                <span className="font-bold text-xl">✔</span>
              </div>
              <h3 className="text-xl font-bold text-emerald-800">Preventive Health Checkups</h3>
              <p className="text-gray-700 mt-4">Regular screenings and vaccinations for your pet.</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-green-500"></div>
            <div className="p-8 bg-white shadow-lg rounded-lg hover:shadow-2xl transition duration-300 group-hover:bg-teal-50">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-6 text-teal-600 group-hover:bg-teal-200 transition-all duration-300">
                <span className="font-bold text-xl">✔</span>
              </div>
              <h3 className="text-xl font-bold text-teal-800">Advanced Surgery</h3>
              <p className="text-gray-700 mt-4">State-of-the-art surgical care for various medical conditions.</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div className="p-8 bg-white shadow-lg rounded-lg hover:shadow-2xl transition duration-300 group-hover:bg-green-50">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-6 text-green-600 group-hover:bg-green-200 transition-all duration-300">
                <span className="font-bold text-xl">✔</span>
              </div>
              <h3 className="text-xl font-bold text-green-800">Diet & Nutrition Plans</h3>
              <p className="text-gray-700 mt-4">Personalized meal plans for a balanced pet diet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Elegant green testimonials */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-green-50 transform -rotate-2"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-16 text-emerald-800 inline-block relative">
            What Our Clients Say
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-emerald-300"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative p-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg transform rotate-1"></div>
              <div className="relative p-8 bg-white rounded-lg shadow-lg">
                <div className="absolute -top-5 left-10 text-5xl text-emerald-400 opacity-50">"</div>
                <p className="text-gray-700 italic relative z-10 text-lg">VetCare provided the best treatment for my dog. The staff is amazing!</p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full mr-3"></div>
                  <h4 className="font-bold text-emerald-800">- Alice M.</h4>
                </div>
              </div>
            </div>
            
            <div className="relative p-1">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg transform -rotate-1"></div>
              <div className="relative p-8 bg-white rounded-lg shadow-lg">
                <div className="absolute -top-5 left-10 text-5xl text-teal-400 opacity-50">"</div>
                <p className="text-gray-700 italic relative z-10 text-lg">I trust VetCare for all my pets. Their online booking is super easy!</p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="w-10 h-10 bg-teal-100 rounded-full mr-3"></div>
                  <h4 className="font-bold text-teal-800">- John D.</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default AboutUs;