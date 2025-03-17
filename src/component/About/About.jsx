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
      
      {/* Hero Section - Luxury design with subtle green palette */}
      <header className="relative mt-16 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-green-800 to-green-900"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('/src/assets/pattern.png')]"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-green-500 opacity-5 blur-3xl rounded-full"></div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight font-serif">
              Excellence in <span className="text-green-200 italic">Pet Care</span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-green-400 to-green-300 mt-6 mb-6"></div>
            <p className="text-xl mt-6 text-gray-100 font-light max-w-2xl tracking-wide">
              Committed to the highest standards of veterinary care with dedication and sophistication.
            </p>
          </div>
        </div>
      </header>

      {/* Who We Are Section - Refined luxury design */}
      <section className="container mx-auto px-6 py-24 relative">
        <div className="absolute top-16 right-10 w-32 h-32 bg-green-200 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-green-200 rounded-full opacity-10 blur-xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative">
            <div className="absolute -top-3 -left-3 bottom-3 right-3 border border-green-700 rounded-xl"></div>
            <div className="absolute -bottom-3 -right-3 top-3 left-3 border border-green-600 rounded-xl"></div>
            <img 
              src="/src/assets/4.jpg" 
              alt="Vet Team" 
              className="w-full relative z-10 rounded-xl shadow-xl object-cover h-full hover:opacity-90 transition duration-700" 
            />
          </div>
          
          <div className="md:w-1/2">
            <span className="text-green-700 uppercase tracking-widest text-sm font-medium">Our Philosophy</span>
            <h2 className="text-4xl font-serif font-bold mb-8 text-green-900 relative">
              Why Choose <span className="text-green-700 italic">VetCare</span>
              <span className="absolute -bottom-3 left-0 w-16 h-px bg-green-600"></span>
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg tracking-wide">
              Our highly experienced veterinarians provide compassionate care with state-of-the-art medical technology.
              We focus on preventive healthcare and customized treatment for your pet's best health.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mt-6 tracking-wide">
              Whether it's a routine check-up, emergency care, or pet nutrition, we're here to help your furry friends live a happy and healthy life.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Elegant green themed cards */}
      <section className="py-24 relative overflow-hidden bg-green-50/40">
        <div className="absolute inset-0 opacity-20 bg-[url('/src/assets/pattern.png')]"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="text-green-700 uppercase tracking-widest text-sm font-medium">Trust & Excellence</span>
          <h2 className="text-4xl font-serif font-bold mb-16 text-green-900 inline-block relative">
            Why People Trust Us
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-px bg-green-600"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group">
              <div className="p-10 bg-white shadow-md rounded-lg hover:shadow-lg transition-all duration-500 border-b border-green-700">
                <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-100 transition-all duration-300">
                  <span className="text-3xl">🐶</span>
                </div>
                <h3 className="text-xl font-medium text-green-900 mb-2">Expert Veterinarians</h3>
                <div className="h-px w-12 bg-green-300 mx-auto mb-4"></div>
                <p className="text-gray-600 mt-4">Our team is made up of the best professionals in the field.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="p-10 bg-white shadow-md rounded-lg hover:shadow-lg transition-all duration-500 border-b border-green-700">
                <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-100 transition-all duration-300">
                  <span className="text-3xl">🚑</span>
                </div>
                <h3 className="text-xl font-medium text-green-900 mb-2">24/7 Emergency Services</h3>
                <div className="h-px w-12 bg-green-300 mx-auto mb-4"></div>
                <p className="text-gray-600 mt-4">We are available around the clock for critical care.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="p-10 bg-white shadow-md rounded-lg hover:shadow-lg transition-all duration-500 border-b border-green-700">
                <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-100 transition-all duration-300">
                  <span className="text-3xl">📅</span>
                </div>
                <h3 className="text-xl font-medium text-green-900 mb-2">Easy Online Booking</h3>
                <div className="h-px w-12 bg-green-300 mx-auto mb-4"></div>
                <p className="text-gray-600 mt-4">Schedule your appointments hassle-free.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services - Sophisticated design with dim green elements */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="text-green-700 uppercase tracking-widest text-sm font-medium">Exceptional Care</span>
          <h2 className="text-4xl font-serif font-bold mt-2 text-green-900 relative inline-block">
            Our Services
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-px bg-green-600"></span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden">
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-lg hover:shadow-md transition duration-300 group-hover:border-green-200">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-6 text-green-700 group-hover:bg-green-100 transition-all duration-300">
                <span className="font-medium text-xl">✦</span>
              </div>
              <h3 className="text-xl font-medium text-green-900">Preventive Health Checkups</h3>
              <div className="h-px w-12 bg-green-200 my-4 group-hover:w-16 transition-all duration-300"></div>
              <p className="text-gray-600">Regular screenings and vaccinations for your pet.</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden">
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-lg hover:shadow-md transition duration-300 group-hover:border-green-200">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-6 text-green-700 group-hover:bg-green-100 transition-all duration-300">
                <span className="font-medium text-xl">✦</span>
              </div>
              <h3 className="text-xl font-medium text-green-900">Advanced Surgery</h3>
              <div className="h-px w-12 bg-green-200 my-4 group-hover:w-16 transition-all duration-300"></div>
              <p className="text-gray-600">State-of-the-art surgical care for various medical conditions.</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-lg hover:shadow-md transition duration-300 group-hover:border-green-200">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-6 text-green-700 group-hover:bg-green-100 transition-all duration-300">
                <span className="font-medium text-xl">✦</span>
              </div>
              <h3 className="text-xl font-medium text-green-900">Diet & Nutrition Plans</h3>
              <div className="h-px w-12 bg-green-200 my-4 group-hover:w-16 transition-all duration-300"></div>
              <p className="text-gray-600">Personalized meal plans for a balanced pet diet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Luxurious green testimonials */}
      <section className="py-24 relative overflow-hidden bg-green-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('/src/assets/pattern.png')]"></div>
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-green-800 to-green-700 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-full h-8 bg-gradient-to-r from-green-700 to-green-800 opacity-30"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="text-green-300 uppercase tracking-widest text-sm font-medium">Client Testimonials</span>
          <h2 className="text-4xl font-serif font-bold mb-16 text-white inline-block relative">
            What Our Clients Say
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-px bg-green-400"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative">
              <div className="p-8 bg-green-800/50 rounded-lg backdrop-blur-sm border border-green-700/30">
                <div className="text-6xl text-green-500 opacity-30 absolute top-4 left-4">"</div>
                <p className="text-gray-100 italic relative z-10 text-lg">VetCare provided the best treatment for my dog. The staff is amazing!</p>
                <div className="mt-8 flex items-center justify-center">
                  <div className="w-10 h-10 bg-green-700 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Alice M.</h4>
                    <p className="text-green-300 text-xs">Dog Owner</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="p-8 bg-green-800/50 rounded-lg backdrop-blur-sm border border-green-700/30">
                <div className="text-6xl text-green-500 opacity-30 absolute top-4 left-4">"</div>
                <p className="text-gray-100 italic relative z-10 text-lg">I trust VetCare for all my pets. Their online booking is super easy!</p>
                <div className="mt-8 flex items-center justify-center">
                  <div className="w-10 h-10 bg-green-700 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-bold text-white text-sm">John D.</h4>
                    <p className="text-green-300 text-xs">Cat Owner</p>
                  </div>
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