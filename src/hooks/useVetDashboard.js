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