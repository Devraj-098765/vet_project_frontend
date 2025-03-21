import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "./useAuth";
import axiosInstance from "../api/axios";

const APPOINTMENT_URL = "/bookings";

const useAppointmentHistory = () => {
  const [ appointments, setAppointments ] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { 
    const fetchAppointmentHistory = async (id) => {
      try {
        const response = await axiosInstance.get(`${APPOINTMENT_URL}/${id}`);
        console.log("AppointmentHistory", response.data);
        setAppointments(response.data);
      } catch (err) {
        setError(err.message);
      } 
    };

    fetchAppointmentHistory();
  }, []);

  return { appointments, loading, error };
};

export default useAppointmentHistory;
