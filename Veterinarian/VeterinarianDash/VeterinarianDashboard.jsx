import { useState, useEffect } from "react";
import axiosInstance from "../../src/api/axios.js";
import { useNavigate } from "react-router-dom";
import VeterinarianNavbar from "../SideBarVeterinarian/SideBarVeterinarian"; // Adjust path
import { toast } from "react-toastify";
import TotalAppointment from "../TotalAppointment/TotalAppointment.jsx"; // Import the new TotalAppointment component

const VetDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  // Dashboard Component (Inline)
  const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, upcoming: 0, pending: 0 });
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
      const fetchStats = async () => {
        try {
          console.log("Testing if the appointments while logging in")
          console.log("Fetching stats from:", `${import.meta.env.VITE_API_URL}/bookings/veterinarian`);
          console.log("Token:", localStorage.getItem("vetapp-token"));
          const { data } = await axiosInstance.get("/bookings/veterinarian");
          console.log(data)
          console.log("Stats data:", data);
          const total = data.length;
          const upcoming = data.filter(appt => 
            new Date(`${appt.date} ${appt.time}`) > new Date() && 
            ['Pending', 'Confirmed'].includes(appt.status)
          ).length;
          const pending = data.filter(appt => appt.status === 'Pending').length;
          setStats({ total, upcoming, pending });
        } catch (error) {
          console.error("Error fetching dashboard stats:", error.response?.status, error.response?.data, error.message);
          toast.error("Failed to load dashboard stats");
        }
      };
      fetchStats();
    }, [refresh]);

    return (
      <div className="p-5">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <button onClick={()=>setRefresh(!refresh)}>refresh</button>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {[
            { title: "Total Appointments", value: stats.total },
            { title: "Upcoming Appointments", value: stats.upcoming },
            { title: "Pending Requests", value: stats.pending },
          ].map(({ title, value }) => (
            <div key={title} className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-gray-600">{title}</h3>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleNavigation = (route, name) => {
    switch (name) {
      case "Appointments":
        setActivePage("appointments");
        break;
      case "Pet List":
        setActivePage("petlist");
        break;
      case "Reports":
        setActivePage("reports");
        break;
      case "Profile":
        setActivePage("profile");
        break;
      default:
        setActivePage("dashboard");
    }
    navigate(route);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <VeterinarianNavbar onNavigate={handleNavigation} />
      <div className="flex-1 p-5">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "appointments" && <TotalAppointment />}
        {activePage === "petlist" && <div className="p-5">Pet List Placeholder</div>}
        {activePage === "reports" && <div className="p-5">Reports Placeholder</div>}
        {activePage === "profile" && <div className="p-5">Profile Placeholder</div>}
      </div>
     
    </div>
  );
};

export default VetDashboard;