import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../../api/axios";
import { FaCreditCard, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";

const stripePromise = loadStripe("pk_test_51RGwgh4KTIpQj1q88uvksqlkdLfbPKzaPGVqYeZ5rsQFOAwA1Zm5KivNnfBhwbF08ptEkYs7RFqS1OLza9Bbm3Xx00KFJzsdwz");

const CardForm = ({ appointmentDetails, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const navigate = useNavigate();

  // Log the appointmentDetails for debugging
  useEffect(() => {
    console.log("Payment form appointmentDetails:", appointmentDetails);
  }, [appointmentDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setCardError("Stripe hasn't loaded yet. Please try again.");
      return;
    }

    setLoading(true);
    setCardError("");

    try {
      console.log("Creating payment intent");
      
      // Create payment intent without requiring a booking ID
      const { data: clientSecret } = await axiosInstance.post("/payments/create-payment-intent", {
        appointmentDetails
      });
      
      console.log("Payment intent created, confirming card payment");

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: appointmentDetails.name || "Customer",
          },
        }
      });

      if (result.error) {
        console.error("Payment confirmation error:", result.error);
        setCardError(result.error.message);
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded with ID:", result.paymentIntent.id);
        
        // Record the payment in the database
        try {
          const paymentData = {
            paymentIntentId: result.paymentIntent.id,
            amount: clientSecret.amount,
            status: 'succeeded',
            service: appointmentDetails.service // Send service even if no appointment ID
          };
          
          // Add appointment ID if available
          if (appointmentDetails.id) {
            paymentData.appointmentId = appointmentDetails.id;
          } else {
            console.log("No appointment ID available - will be linked later", appointmentDetails);
          }
          
          console.log("Recording payment with data:", paymentData);
          
          const response = await axiosInstance.post("/payments/record", paymentData);
          console.log("Payment record response:", response.data);
          
          toast.success("Payment successful and recorded!");
          
          // Call the onSuccess callback with just the payment intent ID - for backward compatibility
          onSuccess(result.paymentIntent.id);
        } catch (recordError) {
          console.error("Error recording payment:", recordError);
          console.error("Error response data:", recordError.response?.data);
          
          // Get more specific error message if available
          const errorMessage = recordError.response?.data?.error || 
                             recordError.response?.data?.details || 
                             "There was an issue saving your payment record.";
          
          // Even if recording fails, we still proceed as the payment was successful
          toast.warning(`Payment successful but ${errorMessage}`);
          // Pass just the ID to the callback for consistency
          onSuccess(result.paymentIntent.id);
        }
      } else {
        console.warn("Payment not succeeded:", result.paymentIntent.status);
        setCardError(`Payment status: ${result.paymentIntent.status}. Please try again.`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      console.error("Error details:", error.response?.data);
      setCardError(error.response?.data?.error || "An error occurred while processing your payment.");
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-green-700 text-sm font-medium">
              <FaCreditCard className="inline mr-2" /> Card Information
            </label>
            <div className="flex items-center text-xs text-green-600">
              <FaLock className="mr-1" /> Secure payment
            </div>
          </div>
          <div className="p-3 border rounded-md bg-gray-50 focus-within:ring-2 focus-within:ring-green-500">
            <CardElement options={cardElementOptions} />
          </div>
          {cardError && <p className="text-red-500 text-xs mt-1">{cardError}</p>}
          <p className="mt-2 text-xs text-gray-500">
            Your card information is securely processed and never stored on our servers.
          </p>
          
          {/* Test Card Information */}
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="text-sm font-medium text-blue-700 mb-1">🔍 Test Mode - Use these test cards:</h4>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>💳 Success: 4242 4242 4242 4242</li>
              <li>💳 Decline: 4000 0000 0000 0002</li>
              <li>📅 Any future date, Any 3 digits for CVC, Any ZIP code</li>
            </ul>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between py-2 border-t border-b border-gray-100">
            <span className="font-medium">Total Amount:</span>
            <span className="font-semibold text-green-700">
              ${appointmentDetails?.amount?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-green-600 text-white p-3 rounded-md font-medium hover:bg-green-700 transition-colors disabled:bg-green-400 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    </form>
  );
};

const PaymentForm = ({ appointmentDetails, onPaymentSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CardForm appointmentDetails={appointmentDetails} onSuccess={onPaymentSuccess} />
    </Elements>
  );
};

export default PaymentForm; 