import { useState, useEffect } from "react";
import axiosInstance from "../../src/api/axios.js";
import { useNavigate } from "react-router-dom";
import VeterinarianNavbar from "../SideBarVeterinarian/SideBarVeterinarian";
import { toast } from "react-toastify";
import TotalAppointment from "../TotalAppointment/TotalAppointment.jsx";

const VetDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, upcoming: 0, pending: 0 });
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
      const fetchStats = async () => {
        try {
          const { data } = await axiosInstance.get("/bookings/veterinarian");
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
      <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 min-h-full rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-emerald-800">Dashboard</h2>
          <button 
            onClick={() => setRefresh(!refresh)} 
            className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors duration-300 shadow-md"
          >
            Refresh Data
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {[
            { 
              title: "Total Appointments", 
              value: stats.total, 
              colorClass: "bg-emerald-500",
              onClick: () => {
                navigate("/Totalappointment");
              }
            },
            { 
              title: "Upcoming Appointments", 
              value: stats.upcoming, 
              colorClass: "bg-emerald-600" 
            },
            { 
              title: "Pending Requests", 
              value: stats.pending, 
              colorClass: "bg-emerald-700" 
            },
          ].map(({ title, value, colorClass, onClick }) => (
            <div 
              key={title} 
              onClick={onClick}
              className={`${colorClass} text-white p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm opacity-80 mb-2">{title}</h3>
                  <p className="text-4xl font-bold">{value}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-8 h-8 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
              </div>
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
    <div className="flex h-screen bg-emerald-50">
      <VeterinarianNavbar onNavigate={handleNavigation} />
      <div className="flex-1 p-8 overflow-auto">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "appointments" && <TotalAppointment />}
        {activePage === "petlist" && <div className="p-5 bg-white rounded-xl shadow-md">Pet List Placeholder</div>}
        {activePage === "reports" && <div className="p-5 bg-white rounded-xl shadow-md">Reports Placeholder</div>}
        {activePage === "profile" && <div className="p-5 bg-white rounded-xl shadow-md">Profile Placeholder</div>}
      </div>
    </div>
  );
};

export default VetDashboard;