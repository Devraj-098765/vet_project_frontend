import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios.js";
import NavBar from "../Header/Navbar.jsx";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get("/bookings/history");
      console.log("API Response:", response.data);
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      setError("Failed to load appointment history");
      setLoading(false);
      toast.error("Failed to load appointment history");
    }
  };

  const openCancelModal = (bookingId) => {
    setCancelBookingId(bookingId);
    setCancelReason(""); // Reset reason input
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelBookingId(null);
    setCancelReason("");
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    try {
      // Send cancellation request with reason
      await axiosInstance.put(`/bookings/${cancelBookingId}/cancel`, {
        data: { reason: cancelReason },
      });
      // Update appointment status and reason in state
      setAppointments(
        appointments.map((appt) =>
          appt._id === cancelBookingId
            ? { ...appt, status: "Cancelled", cancellationReason: cancelReason }
            : appt
        )
      );
      toast.success("Appointment canceled successfully");
      closeCancelModal();
    } catch (err) {
      console.error("Cancel Error:", err.response?.data || err.message);
      toast.error("Failed to cancel appointment");
      closeCancelModal();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-400";
      case "Confirmed":
        return "bg-green-400";
      case "Completed":
        return "bg-blue-400";
      case "Cancelled":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-green-100">
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
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
              {appointments.map((appt) => {
                let imageUrl = appt.veterinarianId?.image
                  ? `${import.meta.env.VITE_API_URL}${appt.veterinarianId.image}`
                  : "https://placehold.co/40x40";
                
                if (imageUrl.includes("/api/uploads/")) {
                  imageUrl = imageUrl.replace("/api/uploads/", "/uploads/");
                }

                console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
                console.log("Veterinarian Image Path:", appt.veterinarianId?.image);
                console.log("Constructed Image URL:", imageUrl);

                return (
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
                            {new Date(appt.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                              <img
                                src={imageUrl}
                                alt={appt.veterinarianId?.name || "Doctor"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error(`Image failed to load: ${imageUrl}`);
                                  e.target.src = "https://placehold.co/40x40";
                                }}
                                onLoad={() => console.log(`Image loaded successfully: ${imageUrl}`)}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Doctor</p>
                              <p className="text-gray-800">{appt.veterinarianId?.name || "N/A"}</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 text-teal-600"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Date</p>
                              <p className="text-gray-800">{appt.date}</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 text-emerald-600"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Time</p>
                              <p className="text-gray-800">{appt.time}</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 text-purple-600"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Pet</p>
                              <p className="text-gray-800">
                                {appt.petName} ({appt.petType})
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 text-yellow-600"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Status</p>
                              <p className="text-gray-800">{appt.status}</p>
                            </div>
                          </div>

                          {appt.status === "Cancelled" && appt.cancellationReason && (
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  className="w-4 h-4 text-red-600"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Cancellation Reason</p>
                                <p className="text-gray-800">{appt.cancellationReason}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {["Pending"].includes(appt.status) && (
                          <button
                            onClick={() => openCancelModal(appt._id)}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700"
                          >
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Cancel Appointment</h2>
            <p className="text-gray-600 mb-4">Please provide a reason for canceling this appointment.</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="4"
              placeholder="Enter cancellation reason..."
            />
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AppointmentHistory;