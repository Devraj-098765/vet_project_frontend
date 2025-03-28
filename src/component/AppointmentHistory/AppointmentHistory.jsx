import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios.js";
import NavBar from "../Header/NavBar.jsx"
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get("/bookings/history");
      console.log(response)
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      setError("Failed to load appointment history");
      setLoading(false);
      toast.error("Failed to load appointment history");
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axiosInstance.delete(`/bookings/${bookingId}`);
        setAppointments(appointments.filter((appt) => appt._id !== bookingId));
        toast.success("Appointment canceled successfully");
      } catch (err) {
        toast.error("Failed to cancel appointment");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-400";
      case "Confirmed": return "bg-green-400";
      case "Completed": return "bg-blue-400";
      case "Cancelled": return "bg-red-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <NavBar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent">
              Appointment History
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-teal-400 mx-auto mt-2 rounded-full"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-t-green-600 border-b-teal-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
              <p className="text-red-600 font-medium text-center">{error}</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-xl border border-green-100 text-center">
              <p className="text-xl text-gray-600 font-medium">No appointments found.</p>
              <p className="text-gray-500 mt-2">Your appointment history will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100 transition-all hover:shadow-2xl"
                >
                  <div className="relative">
                    <div className={`absolute top-0 left-0 w-full h-2 ${getStatusColor(appt.status)}`}></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{appt.service}</h3>
                        <span className="text-xs uppercase tracking-wide font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {new Date(appt.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                            <img
                              src={appt.veterinarianId?.image ? `${import.meta.env.VITE_API_URL}${appt.veterinarianId.image}` : "https://via.placeholder.com/40"}
                              alt={appt.veterinarianId?.name || "Doctor"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Doctor</p>
                            <p className="text-gray-800">{appt.veterinarianId?.name || "N/A"}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-teal-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Date</p>
                            <p className="text-gray-800">{appt.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-emerald-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Time</p>
                            <p className="text-gray-800">{appt.time}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-purple-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Pet</p>
                            <p className="text-gray-800">{appt.petName} ({appt.petType})</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-yellow-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Status</p>
                            <p className="text-gray-800">{appt.status}</p>
                          </div>
                        </div>
                      </div>

                      {['Pending'].includes(appt.status) && (
                        <button
                          onClick={() => handleCancel(appt._id)}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentHistory;
