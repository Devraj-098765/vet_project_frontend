import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const PaymentSuccess = ({ paymentInfo, appointmentDetails }) => {
  const navigate = useNavigate();
  const hasError = appointmentDetails?.error || false;
  const [isNavigating, setIsNavigating] = useState(false);

  const handleViewReceipt = () => {
    // Navigate directly to the payment receipt page with the payment ID
    if (paymentInfo && paymentInfo.id) {
      navigate(`/payments/${paymentInfo.id}`);
    } else {
      // If payment ID is not available, go to payment history
      navigate('/payments/history');
    }
  };

  const handleViewAppointments = () => {
    setIsNavigating(true);
    // Use the appointments route directly instead of appointmenthistory/:id
    navigate('/appointments');
  };

  const handleContactSupport = () => {
    // You can replace this with actual support contact functionality
    window.location.href = 'mailto:support@vetproject.com?subject=Booking Error&body=Payment ID: ' + 
      (paymentInfo?.id || 'Unknown');
  };

  return (
    <div className="container mx-auto max-w-md py-8 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md border border-green-100 flex flex-col items-center text-center">
        {hasError ? (
          <>
            <FaExclamationTriangle className="text-amber-500 text-6xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful, But...</h2>
            <p className="mb-2">
              Your payment has been processed successfully, but we had trouble creating your appointment.
            </p>
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex items-start gap-2 mb-4 mt-2 text-left">
              <FaExclamationTriangle className="text-amber-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                Error: {appointmentDetails?.errorMessage || "Unknown error occurred"}
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Your payment is safely recorded. Please contact our support team or try again.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              <button 
                className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
                onClick={handleViewReceipt}
                disabled={isNavigating}
              >
                View Receipt
              </button>
              <button 
                className="border border-amber-600 text-amber-600 px-4 py-2 rounded-md font-medium hover:bg-amber-50 transition-colors"
                onClick={handleContactSupport}
                disabled={isNavigating}
              >
                Contact Support
              </button>
            </div>
          </>
        ) : (
          <>
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="mb-2">
              Your payment has been processed successfully.
            </p>
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 flex items-start gap-2 mb-4 mt-2 text-left">
              <FaClock className="text-yellow-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                Your appointment with <span className="font-medium">Dr. {appointmentDetails?.veterinarianName || "your veterinarian"}</span> is awaiting confirmation. You'll receive a notification once it's confirmed.
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-2 mb-4">
              <div className="text-left">
                <p className="text-sm text-gray-600"><span className="font-medium">Service:</span> {appointmentDetails?.service || "Consultation"}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Date:</span> {appointmentDetails?.date || "Scheduled date"}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Time:</span> {appointmentDetails?.time || "Scheduled time"}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Veterinarian:</span> Dr. {appointmentDetails?.veterinarianName || "Assigned veterinarian"}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              A confirmation email with your appointment details has been sent to your registered email address.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              <button 
                className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
                onClick={handleViewReceipt}
                disabled={isNavigating}
              >
                {isNavigating ? 'Please wait...' : 'View Receipt'}
              </button>
              <button 
                className="border border-green-600 text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-50 transition-colors"
                onClick={handleViewAppointments}
                disabled={isNavigating}
              >
                {isNavigating ? 'Loading...' : 'View My Appointments'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess; 