import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function BookingVisitForm() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-3xl">
        <div className="bg-blue-800 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-bold">Booking Visit Form</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-around mb-6">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-500' : 'text-gray-400'}`}>
              <span className="w-8 h-8 flex items-center justify-center border rounded-full font-bold">
                1
              </span>
              <span className="ml-2">Booking Details</span>
            </div>
            <span className="text-gray-400">&mdash;</span>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-500' : 'text-gray-400'}`}>
              <span className="w-8 h-8 flex items-center justify-center border rounded-full font-bold">
                2
              </span>
              <span className="ml-2">Select Date & Time</span>
              
            </div>
            <span className="text-gray-400">&mdash;</span>
            <div className={`flex items-center ${step === 3 ? 'text-blue-500' : 'text-gray-400'}`}>
              <span className="w-8 h-8 flex items-center justify-center border rounded-full font-bold">
                3
              </span>
              <span className="ml-2">Select Payment Method</span>
            </div>
          </div>

          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="border p-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="col-span-2 border p-2 rounded"
                />
              </div>

              <h3 className="text-lg font-bold mb-4">Pet Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Pet Name"
                  className="border p-2 rounded"
                />
                <select className="border p-2 rounded">
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Bird</option>
                </select>
                <input
                  type="text"
                  placeholder="Breed"
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Age"
                  className="border p-2 rounded"
                />
                <select className="border p-2 rounded">
                  <option>1 day</option>
                  <option>2 days</option>
                  <option>3 days</option>
                </select>
                <input
                  type="text"
                  placeholder="Problem"
                  className="border p-2 rounded"
                />
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-between items-center mt-6">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button
                onClick={nextStep}
                className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingVisitForm;
