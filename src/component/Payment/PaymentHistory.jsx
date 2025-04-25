import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import NavBar from "../Header/NavBar";
import Footer from "../Footer/Footer";
import { FaReceipt, FaCalendarAlt, FaStethoscope, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/payments/history");
      console.log("Payment history response:", response.data);
      setPayments(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Payment History Error:", err.response?.data || err.message);
      setError("Failed to load payment history");
      setLoading(false);
      toast.error("Failed to load payment history");
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time to 12-hour format
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    
    // If it's already in a proper format, return it
    if (timeString.includes(":")) {
      return timeString;
    }
    
    // Return as is if we can't parse it
    return timeString;
  };

  // Add this helper function somewhere in your component, outside of the render method
  const getVeterinarianName = (payment) => {
    // First try from booking if available
    if (payment.bookingId?.veterinarianId?.name) {
      return payment.bookingId.veterinarianId.name;
    }
    
    // Then try from booking direct property
    if (payment.bookingId?.veterinarianName) {
      return payment.bookingId.veterinarianName;
    }
    
    // Then try from payment metadata
    if (payment.metadata?.veterinarianName) {
      return payment.metadata.veterinarianName;
    }
    
    // Fallback
    return "Veterinarian";
  };

  return (
    <>
      {/* Hero Section with Background */}
      <div className="relative bg-green-50">
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/60 to-green-50/60 z-0" />
        
        <div className="flex justify-center items-center">
          <NavBar />
        </div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent">
                Payment History
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-teal-400 mx-auto mt-2 rounded-full"></div>
              <p className="text-gray-600 mt-4">
                View all your payment transactions
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-16 h-16 border-4 border-t-green-600 border-b-teal-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
                <p className="text-red-600 font-medium text-center">{error}</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-xl border border-green-100 text-center">
                <FaReceipt className="text-5xl text-green-400 mx-auto mb-6" />
                <p className="text-xl text-gray-600 font-medium">No payment records found.</p>
                <p className="text-gray-500 mt-2">Your payment history will appear here once you make a payment.</p>
                <Link to="/" className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                  Go to Homepage
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-green-600 text-white font-medium">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-2">Date</div>
                      <div className="col-span-3">Service</div>
                      <div className="col-span-3">Veterinarian</div>
                      <div className="col-span-2">Amount</div>
                      <div className="col-span-2 text-right">Details</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {payments.map((payment) => {
                      // Get service info either from metadata or booking
                      const service = payment.metadata?.service || payment.bookingId?.service || "Service";
                      const date = payment.metadata?.date || (payment.bookingId?.date ? payment.bookingId.date : formatDate(payment.createdAt));
                      const time = payment.metadata?.time || payment.bookingId?.time || "";
                      const veterinarian = getVeterinarianName(payment);

                      return (
                        <div key={payment._id} className="px-6 py-4 hover:bg-green-50 transition-colors">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-2">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                  <FaCalendarAlt className="text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{date}</p>
                                  <p className="text-xs text-gray-500">at {formatTime(time)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                  <FaStethoscope className="text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{service}</p>
                                  <p className="text-xs text-gray-500">
                                    {payment.bookingId ? `Booking #${payment.bookingId._id.substring(0, 8)}` : "Direct payment"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                  <FaStethoscope className="text-indigo-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{veterinarian}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <p className="text-lg font-bold text-gray-900">${payment.amount.toFixed(2)}</p>
                            </div>
                            <div className="col-span-2 text-right">
                              <Link
                                to={`/payments/${payment.paymentIntentId || payment._id}`}
                                className="inline-flex items-center px-3 py-1 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm"
                              >
                                <FaReceipt className="mr-1" />
                                Receipt
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentHistory; 