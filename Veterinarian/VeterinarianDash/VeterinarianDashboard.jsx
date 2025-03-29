
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VeterinarianNavbar from "../SideBarVeterinarian/SideBarVeterinarian";
import TotalAppointment from "../TotalAppointment/TotalAppointment.jsx";
import useVetDashboard from "../../src/hooks/useVetDashboard.js";

const VetDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const Dashboard = () => {

    const { stats, isLoading } = useVetDashboard();
    console.log("here is your stats", stats)

    if (isLoading) {
      return <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
        ))}
      </div>;
    }
  
    if (!stats) {
      return <div className="text-red-500">Failed to load stats</div>;
    }

    return (
      <div className="p-6 bg-white min-h-full rounded-xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">Dashboard Overview</h2>
          <button 
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
          >
            Last Updated: Just Now
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {[
            { 
              title: "Total Appointments", 
              value: stats.total, 
              bgClass: "bg-blue-50 text-blue-600",
              iconClass: "text-blue-500",
              onClick: () => navigate("/Totalappointment"),
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 3 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 3 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5" />
                </svg>
              )
            },
            { 
              title: "Completed Appointments", 
              value: stats.upcoming, 
              bgClass: "bg-green-50 text-green-600",
              iconClass: "text-green-500",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )
            },
            { 
              title: "Pending Requests", 
              value: stats.pending, 
              bgClass: "bg-orange-50 text-orange-600",
              iconClass: "text-orange-500",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125V8.25m12.75 0h-6.375a1.125 1.125 0 0 1-1.125-1.125V5.25h6.75V7.5h3v-2.25c0-.621-.504-1.125-1.125-1.125H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V15" />
                </svg>
              )
            },
          ].map(({ title, value, bgClass, iconClass, icon, onClick }) => (
            <div 
              key={title} 
              onClick={onClick}
              className={`
                ${bgClass} 
                p-6 
                rounded-2xl 
                shadow-md 
                hover:shadow-lg 
                transition-all 
                duration-300 
                transform 
                hover:-translate-y-2
                flex 
                items-center 
                justify-between
                ${onClick ? 'cursor-pointer' : ''}
              `}
            >
              <div>
                <h3 className="text-sm font-medium opacity-70 mb-2">{title}</h3>
                <p className="text-4xl font-bold">{value}</p>
              </div>
              <div className={`${iconClass} opacity-70`}>
                {icon}
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
    <div className="flex h-screen bg-gray-100">
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