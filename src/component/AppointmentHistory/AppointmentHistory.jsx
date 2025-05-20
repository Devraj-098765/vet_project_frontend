import React, { useState, useEffect, Suspense, lazy } from "react";
import axiosInstance, { getBaseUrl } from "../../api/axios.js";
import NavBar from "../Header/NavBar";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";
import { FaMoneyBill, FaCheck, FaClock } from "react-icons/fa";

// Create a separate appointment card component
const AppointmentCard = ({ appt, payments, openCancelModal, getStatusColor, getStatusIcon, baseUrl }) => {
  let imageUrl = appt.veterinarianId?.image
    ? `${baseUrl}${appt.veterinarianId.image}`
    : "/assets/default-profile.png";
  
  const payment = payments[appt._id];
  
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
                    e.target.src = "/assets/default-profile.png";
                  }}
                  loading="lazy"
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
            
            {/* Payment Information */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <FaMoneyBill className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Payment</p>
                {payment ? (
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="text-gray-800">${payment.amount.toFixed(2)}</span>
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Paid</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {payment.formattedDate} 
                      {payment.metadata?.service && ` • ${payment.metadata.service}`}
                    </p>
                  </div>
                ) : appt.paymentCompleted ? (
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="text-gray-800">Payment received</span>
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Paid</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Not paid yet</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                {getStatusIcon(appt.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Status</p>
                <p className="text-gray-800">{appt.status}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-green-100 pt-4">
            <button
              onClick={() => openCancelModal(appt._id)}
              disabled={appt.status === "Cancelled" || appt.status === "Completed" || appt.status === "Confirmed"}
              className={`w-full py-2 rounded-lg text-center text-sm font-medium ${
                appt.status === "Cancelled" || appt.status === "Completed" || appt.status === "Confirmed"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              }`}
            >
              {appt.status === "Cancelled"
                ? "Cancelled"
                : appt.status === "Completed"
                ? "Completed"
                : appt.status === "Confirmed"
                ? "Cannot Cancel Confirmed"
                : "Cancel Appointment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    // Show page content after a short delay even if data is still loading
    const timer = setTimeout(() => {
      setPageReady(true);
    }, 300);
    
    // Load data in parallel
    Promise.all([
      fetchAppointments(),
      fetchPayments()
    ]).then(() => {
      setLoading(false);
      clearTimeout(timer);
      setPageReady(true);
    }).catch(err => {
      console.error("Error loading data:", err);
      setLoading(false);
      clearTimeout(timer);
      setPageReady(true);
    });

    return () => clearTimeout(timer);
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get("/bookings/history");
      setAppointments(response.data);
      return response.data;
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      setError("Failed to load appointment history");
      toast.error("Failed to load appointment history");
      throw err;
    }
  };
  
  const fetchPayments = async () => {
    try {
      const response = await axiosInstance.get("/payments/history");
      
      // Create a map of booking ID to payment
      const paymentsMap = {};
      response.data.forEach(payment => {
        // Carefully handle different response structures for bookingId
        let bookingId;
        if (payment.bookingId) {
          if (typeof payment.bookingId === 'object' && payment.bookingId._id) {
            // If bookingId is populated as an object
            bookingId = payment.bookingId._id;
          } else if (typeof payment.bookingId === 'string') {
            // If bookingId is just a string ID
            bookingId = payment.bookingId;
          } else {
            // Use the toString() method for ObjectId instances
            bookingId = payment.bookingId.toString();
          }
          
          paymentsMap[bookingId] = {
            ...payment,
            // Format the date for easier display
            formattedDate: new Date(payment.createdAt).toLocaleDateString()
          };
        }
      });
      setPayments(paymentsMap);
      return paymentsMap;
    } catch (err) {
      console.error("Payment Fetch Error:", err.response?.data || err.message);
      // Don't set error here as we still want to show appointments even if payments fail
      return {};
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
      // Display the specific error message from the backend
      toast.error(err.response?.data?.error || "Failed to cancel appointment");
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
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaClock className="text-yellow-500" />;
      case "Confirmed":
        return <FaCheck className="text-green-500" />;
      case "Completed":
        return <FaCheck className="text-blue-500" />;
      case "Cancelled":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  // Show skeleton loader while initial loading
  const LoadingSkeleton = () => (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array(3).fill().map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-100 animate-pulse">
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!pageReady) {
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
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-t-green-600 border-b-teal-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            <LoadingSkeleton />
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
                <AppointmentCard 
                  key={appt._id}
                  appt={appt}
                  payments={payments}
                  openCancelModal={openCancelModal}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  baseUrl={getBaseUrl()}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
            <div className="h-2 bg-red-500 w-full absolute top-0"></div>
            <div className="p-6 pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Cancel Appointment</h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for cancellation.
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className="w-full p-3 mb-4 rounded-lg border border-gray-300 resize-none"
                rows={4}
              ></textarea>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeCancelModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AppointmentHistory;