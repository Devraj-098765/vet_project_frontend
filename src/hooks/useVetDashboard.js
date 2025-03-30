import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

const VET_DASH_lOGIN = "/bookings/veterinarian"

const useVetDashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchStats = async () => {
        setIsLoading(true);
        try {
          const { data } = await axiosInstance.get(VET_DASH_lOGIN);
          setStats(data.stats);
<<<<<<< HEAD
          localStorage.setItem("veterinarian-stats", JSON.stringify(data.stats))
=======
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
        } catch (error) {
          console.error("Error fetching dashboard stats:", error.response?.status, error.response?.data, error.message);
          toast.error("Failed to load dashboard stats");
        } finally {
          setIsLoading(false);
        }
      };
      fetchStats();
    }, []);

    return { stats, isLoading }
};


export default useVetDashboard;