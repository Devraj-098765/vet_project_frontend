import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "./useAuth"; 
import axiosInstance from "../api/axios";

const APPOINTMENT_URL = "/bookings";

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
        console.log("I am from the useAppointmentHistory");
        const response = await axiosInstance.get(`${APPOINTMENT_URL}/${id}`);
        console.log("AppointmentHistory", response.data);
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
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${APPOINTMENT_URL}/admin/bookings`);
        console.log("AdminAppointments", response.data);
        setAdminAppointments(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch admin appointments");
        console.error("Error fetching admin appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminAppointments();
  }, []); // Run once on mount

  return { appointments, loading, error, adminAppointments };
};

export default useAppointmentHistory;