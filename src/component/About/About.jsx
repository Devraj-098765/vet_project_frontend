import React from "react";
import { NavLink } from "react-router-dom";
import Footer from "../Footer/Footer"; // Import Footer Component
import NavBar from "../Header/Navbar";

const AboutUs = () => {
  return (
    <>

      <div className="flex justify-center items-center">
       <NavBar />
      </div>
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-24 mt-16 text-center">
        <h1 className="text-5xl font-extrabold">Who We Are at VetCare</h1>
        <p className="text-lg mt-3 max-w-2xl mx-auto opacity-90">
          Committed to the highest standards of pet care with love and professionalism.
        </p>
      </header>

      {/* Who We Are Section */}
      <section className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">
        <img src="/src/assets/4.jpg" alt="Vet Team" className="w-full md:w-1/2 rounded-lg shadow-xl hover:scale-105 transition duration-300" />
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-4 text-blue-600">Why Choose VetCare?</h2>
          <p className="text-gray-700 leading-relaxed">
            Our highly experienced veterinarians provide compassionate care with state-of-the-art medical technology.
            We focus on preventive healthcare and customized treatment for your pet’s best health.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Whether it's a routine check-up, emergency care, or pet nutrition, we’re here to help your furry friends live a happy and healthy life.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-blue-600">Why People Trust Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold">🐶 Expert Veterinarians</h3>
              <p className="text-gray-600 mt-2">Our team is made up of the best professionals in the field.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold">🚑 24/7 Emergency Services</h3>
              <p className="text-gray-600 mt-2">We are available around the clock for critical care.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold">📅 Easy Online Booking</h3>
              <p className="text-gray-600 mt-2">Schedule your appointments hassle-free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-100 shadow-md rounded-lg hover:bg-blue-200 transition duration-300">
            <h3 className="text-xl font-semibold">✔ Preventive Health Checkups</h3>
            <p className="text-gray-700 mt-2">Regular screenings and vaccinations for your pet.</p>
          </div>
          <div className="p-6 bg-blue-100 shadow-md rounded-lg hover:bg-blue-200 transition duration-300">
            <h3 className="text-xl font-semibold">✔ Advanced Surgery</h3>
            <p className="text-gray-700 mt-2">State-of-the-art surgical care for various medical conditions.</p>
          </div>
          <div className="p-6 bg-blue-100 shadow-md rounded-lg hover:bg-blue-200 transition duration-300">
            <h3 className="text-xl font-semibold">✔ Diet & Nutrition Plans</h3>
            <p className="text-gray-700 mt-2">Personalized meal plans for a balanced pet diet.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-blue-600">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white shadow-lg rounded-lg hover:scale-105 transition duration-300">
              <p className="text-gray-700 italic">"VetCare provided the best treatment for my dog. The staff is amazing!"</p>
              <h4 className="font-semibold mt-4">- Alice M.</h4>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg hover:scale-105 transition duration-300">
              <p className="text-gray-700 italic">"I trust VetCare for all my pets. Their online booking is super easy!"</p>
              <h4 className="font-semibold mt-4">- John D.</h4>
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
