import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axios.js";
import NavBar from "../Header/Navbar";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";

const AppointmentHistory = () => {
  const { id } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
    console.log (appointments)
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get("/bookings/history");
      console.log("Fetch Response:", response.data);
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error Details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError("Failed to load appointment history");
      setLoading(false);
      toast.error("Failed to load appointment history");
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axiosInstance.delete(`/api/bookings/${bookingId}`);
        setAppointments(appointments.filter((appt) => appt._id !== bookingId));
        toast.success("Appointment canceled successfully");
      } catch (err) {
        console.error("Cancel Error:", err.response ? err.response.data : err.message);
        toast.error("Failed to cancel appointment");
      }
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <NavBar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-green-900 text-center mb-10">Appointment History</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-600">No appointments found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white p-6 rounded-xl shadow-md border border-green-200 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-semibold text-green-800">{appt.service}</h3>
                <p className="text-gray-600 mt-2">Pet: {appt.petName} ({appt.petType})</p>
                <p className="text-gray-600">Date: {appt.date}</p>
                <p className="text-gray-600">Time: {appt.time}</p>
                <p className="text-gray-600">Created: {new Date(appt.createdAt).toLocaleDateString()}</p>
                <button
                  onClick={() => handleCancel(appt._id)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  Cancel Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentHistory;