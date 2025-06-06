import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "./useAuth"; 
import axiosInstance from "../api/axios";

const APPOINTMENT_URL = "/bookings";
// Custom hook to fetch appointment history for both user and admin
const useAppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { auth } = useAuth(); // Get auth context (e.g., { userId: "123" })

  useEffect(() => {
    const fetchAppointmentHistory = async (id) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${APPOINTMENT_URL}/${id}`);
        setAppointments(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch appointments");
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch appointments only if user ID is available
    if (auth?.userId) {
      fetchAppointmentHistory(auth.userId);
    } else {
      setError("User not authenticated");
    }
  }, [auth?.userId]); // Re-run if userId changes

  useEffect(() => {
    const fetchAdminAppointments = async () => {
      // Don't show loading state for admin appointments to prevent UI delays
      try {
        const response = await axiosInstance.get(`${APPOINTMENT_URL}/admin/bookings`);
        setAdminAppointments(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch admin appointments");
        console.error("Error fetching admin appointments:", err);
        setAdminAppointments([]);
      }
    };

    fetchAdminAppointments();
  }, []); // Run once on mount

  return { appointments, loading, error, adminAppointments };
};

export default useAppointmentHistory;