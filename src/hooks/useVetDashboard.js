// import { useEffect, useState } from "react";
// import axiosInstance from "../api/axios";
// import { toast } from "react-toastify";

// const VET_DASH_lOGIN = "/bookings/veterinarian"

// const useVetDashboard = () => {
//     const [stats, setStats] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//       const fetchStats = async () => {
//         setIsLoading(true);
//         try {
//           const { data } = await axiosInstance.get(VET_DASH_lOGIN);
//           setStats(data.stats);
//           localStorage.setItem("veterinarian-stats", JSON.stringify(data.stats))
//         } catch (error) {
//           console.error("Error fetching dashboard stats:", error.response?.status, error.response?.data, error.message);
//           toast.error("Failed to load dashboard stats");
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchStats();
//     }, []);

//     return { stats, isLoading }
// };


// export default useVetDashboard;
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

const VET_DASH_LOGIN = "/bookings/veterinarian";
const BLOGS_ENDPOINT = "/blogs/my-blogs";

const useVetDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch appointments and blogs concurrently
        const [appointmentsRes, blogsRes] = await Promise.all([
          axiosInstance.get(VET_DASH_LOGIN),
          axiosInstance.get(BLOGS_ENDPOINT),
        ]);

        // Extract data
        const appointments = appointmentsRes.data.bookings || [];
        const blogs = blogsRes.data || [];

        // Calculate stats
        const calculatedStats = {
          total: appointments.length,
          completed: appointments.filter((appt) => appt.status === "Completed")
            .length,
          pending: appointments.filter((appt) => appt.status === "Pending")
            .length,
          blogs: blogs.length,
        };

        // Update state and localStorage
        setStats(calculatedStats);
        localStorage.setItem(
          "veterinarian-stats",
          JSON.stringify(calculatedStats)
        );
      } catch (error) {
        console.error(
          "Error fetching dashboard stats:",
          error.response?.status,
          error.response?.data,
          error.message
        );
        toast.error("Failed to load dashboard stats");
        // Fallback to localStorage or empty stats
        const cachedStats = JSON.parse(
          localStorage.getItem("veterinarian-stats")
        ) || {
          total: 0,
          completed: 0,
          pending: 0,
          blogs: 0,
        };
        setStats(cachedStats);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, isLoading };
};

export default useVetDashboard;