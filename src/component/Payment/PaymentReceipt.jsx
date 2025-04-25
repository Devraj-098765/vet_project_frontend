import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import NavBar from "../Header/NavBar";
import Footer from "../Footer/Footer";
import { FaCheckCircle, FaPrint, FaArrowLeft, FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";

const PaymentReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentDetails();
  }, [id]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      console.log(`Fetching payment details for ID: ${id}`);
      const response = await axiosInstance.get(`/payments/${id}`);
      console.log("Payment details:", response.data);
      setPayment(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Payment Details Error:", err);
      // Provide more detailed error message based on the error
      const errorMessage = err.response?.status === 404 
        ? "Payment not found" 
        : err.response?.data?.error || "Failed to load payment details";
      
      setError(errorMessage);
      setLoading(false);
      toast.error(errorMessage);
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate("/payments/history");
  };

  if (loading) {
    return (
      <>
        <div className="relative bg-green-50">
          <div className="absolute inset-0 bg-gradient-to-r from-green-100/60 to-green-50/60 z-0" />
          
          <div className="flex justify-center items-center">
            <NavBar />
          </div>
          
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-t-green-600 border-b-teal-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !payment) {
    return (
      <>
        <div className="relative bg-green-50">
          <div className="absolute inset-0 bg-gradient-to-r from-green-100/60 to-green-50/60 z-0" />
          
          <div className="flex justify-center items-center">
            <NavBar />
          </div>
          
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
                <p className="text-red-600 font-medium text-center">{error || "Payment not found"}</p>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleBack}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to Payment History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Get booking details if available
  const booking = payment.bookingId;
  // Get service info from metadata or booking
  const service = payment.metadata?.service || (booking?.service) || "Service";
  
  // Extract veterinarian name with enhanced fallbacks
  console.log("Payment data:", payment);
  console.log("Booking data:", booking);
  console.log("Payment metadata:", payment.metadata);
  
  // Enhanced fallbacks for veterinarian name
  let veterinarianName = "Your Veterinarian";
  
  // Try to get name from booking veterinarianId
  if (booking?.veterinarianId?.name) {
    veterinarianName = booking.veterinarianId.name;
    console.log("Using veterinarian name from booking.veterinarianId:", veterinarianName);
  } 
  // Try to get name from booking.veterinarianName
  else if (booking?.veterinarianName) {
    veterinarianName = booking.veterinarianName;
    console.log("Using veterinarianName from booking:", veterinarianName);
  }
  // Try to get name from payment metadata
  else if (payment.metadata?.veterinarianName) {
    veterinarianName = payment.metadata.veterinarianName;
    console.log("Using veterinarianName from payment metadata:", veterinarianName);
  }
  // Extract from metadata
  else if (payment.metadata?.veterinarianId) {
    veterinarianName = `Dr. ${payment.metadata.veterinarianId}`;
    console.log("Using veterinarianId from payment metadata:", veterinarianName);
  }
                          
  console.log("Final veterinarian name:", veterinarianName);

  return (
    <>
      <div className="relative bg-green-50">
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/60 to-green-50/60 z-0" />
        
        <div className="flex justify-center items-center">
          <NavBar />
        </div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Action Bar - Hidden during print */}
            <div className="flex justify-between items-center mb-6 print:hidden">
              <button
                onClick={handleBack}
                className="bg-white border border-green-600 text-green-600 px-4 py-2 rounded-lg flex items-center hover:bg-green-50 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={handlePrint}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
                >
                  <FaPrint className="mr-2" />
                  Print Receipt
                </button>
              </div>
            </div>

            {/* Receipt Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden print:shadow-none print:border-0">
              {/* Receipt Header */}
              <div className="p-6 bg-green-600 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold">Payment Receipt</h1>
                    <p className="text-green-100">Transaction ID: {payment.paymentIntentId.substring(0, 15)}...</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">${payment.amount.toFixed(2)}</div>
                    <div className="flex items-center justify-end text-sm">
                      <FaCheckCircle className="mr-1" />
                      Paid
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Date</h3>
                    <p className="text-lg font-medium text-gray-900">{formatDate(payment.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
                    <p className="text-lg font-medium text-gray-900">Credit Card</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Paid
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Currency</h3>
                    <p className="text-lg font-medium text-gray-900">{payment.currency?.toUpperCase() || "USD"}</p>
                  </div>
                </div>

                <hr className="my-6" />

                {/* Service Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Service Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500">Service</h4>
                      <p className="text-lg font-medium text-gray-900">{service}</p>
                    </div>

                    {booking && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Date</h4>
                            <p className="text-gray-900">{booking.date || payment.metadata?.date || "N/A"}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Time</h4>
                            <p className="text-gray-900">{booking.time || payment.metadata?.time || "N/A"}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Veterinarian</h4>
                            <p className="text-gray-900">
                              {veterinarianName}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Pet</h4>
                            <p className="text-gray-900">
                              {booking.petName ? `${booking.petName} (${booking.petType || "Pet"})` : "N/A"}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <hr className="my-6" />

                {/* Payment Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-left text-gray-900">{service}</td>
                          <td className="px-4 py-3 text-right text-gray-900">${payment.amount.toFixed(2)}</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-4 py-3 text-left font-medium text-gray-900">Total Paid</td>
                          <td className="px-4 py-3 text-right font-bold text-green-600">${payment.amount.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                  <p>Thank you for your payment. This receipt was generated on {new Date().toLocaleDateString()}.</p>
                  <p className="mt-1">If you have any questions, please contact our support team.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
};

export default PaymentReceipt; 