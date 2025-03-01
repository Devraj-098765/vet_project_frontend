import React, { useState } from "react";

const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState("16:00");
  const [clinic, setClinic] = useState("Pawcare Barktown");
  const [consultation, setConsultation] = useState("Jasmine Miller");

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="bg-blue-900 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold">Booking Visit Form</h2>
          <button className="text-white text-2xl">✕</button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center space-x-4 my-4 text-sm">
          <div className="flex items-center">
            <span className="w-6 h-6 bg-gray-300 text-white flex justify-center items-center rounded-full">
              1
            </span>
            <span className="ml-2 text-gray-600">Booking Details</span>
          </div>
          <span>—</span>
          <div className="flex items-center">
            <span className="w-6 h-6 bg-blue-600 text-white flex justify-center items-center rounded-full">
              2
            </span>
            <span className="ml-2 text-blue-600">Select Date & Time</span>
          </div>
          <span>—</span>
          <div className="flex items-center">
            <span className="w-6 h-6 bg-gray-300 text-white flex justify-center items-center rounded-full">
              3
            </span>
            <span className="ml-2 text-gray-600">Select Payment</span>
          </div>
        </div>

        {/* Date Selection */}
        <h3 className="text-lg font-semibold">Schedule Date & Time</h3>
        <div className="flex flex-wrap md:flex-nowrap gap-6 mt-4">
          {/* Calendar */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <button className="text-gray-500">{"<"}</button>
              <span className="font-semibold">July 2024</span>
              <button className="text-gray-500">{">"}</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <span key={day} className="font-semibold text-gray-600">
                  {day}
                </span>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  className={`w-10 h-10 rounded-full ${
                    selectedDate === day
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Pet Details Card */}
          <div className="flex-1 bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src="https://placekitten.com/50/50"
                alt="Pet"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-semibold">Lucy</h4>
                <div className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Golden Retriever
                </div>
                <div className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1">
                  Female, 2 y.o.
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Swollen leg for about 3 days
            </p>
          </div>
        </div>

        {/* Time Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </div>

        {/* Clinic Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Clinic
          </label>
          <select
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg"
          >
            <option>Pawcare Barktown</option>
            <option>Happy Paws Clinic</option>
            <option>VetCare Downtown</option>
          </select>
        </div>

        {/* Consultation Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Consultation with
          </label>
          <select
            value={consultation}
            onChange={(e) => setConsultation(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg"
          >
            <option>Jasmine Miller</option>
            <option>Dr. Robert Smith</option>
            <option>Emily Johnson</option>
          </select>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
