import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

const usePaymentInfo = (isAdmin = true) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        // Use different endpoint for admin users
        const endpoint = isAdmin ? "/payments/admin/all" : "/payments/history";
        
        const response = await axiosInstance.get(endpoint);
        console.log("Payment data:", response.data);
        
        // Handle case where response is empty or invalid
        if (!response.data || !Array.isArray(response.data)) {
          console.error("Invalid payment data format:", response.data);
          setPayments([]);
          setTotalRevenue(0);
          setRecentPayments([]);
          setLoading(false);
          return;
        }
        
        setPayments(response.data);
        
        // Calculate total revenue
        const total = response.data.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        setTotalRevenue(total);
        
        // Get recent payments (sorted by date)
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
        );
        setRecentPayments(sorted.slice(0, 10)); // Get 10 most recent payments
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err.message || "Failed to fetch payments");
        setLoading(false);
        toast.error("Failed to fetch payment information");
        
        // Set empty data on error
        setPayments([]);
        setTotalRevenue(0);
        setRecentPayments([]);
      }
    };

    fetchPayments();
  }, [isAdmin]);

  return { payments, loading, error, totalRevenue, recentPayments };
};

export default usePaymentInfo; 