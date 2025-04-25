import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LabelList
} from "recharts";
import VeterinarianNavbar from "../SideBarVeterinarian/SideBarVeterinarian";
import TotalAppointment from "../TotalAppointment/TotalAppointment.jsx";
import VeterinarianReports from "../VeterinarianReports.jsx";
import VetBlogPage from "../Blog.jsx";
import useVetDashboard from "../../src/hooks/useVetDashboard.js";

const VetDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();
  const { stats, isLoading } = useVetDashboard();

  // Refetch stats when refreshVetDashboardStats event is triggered
  useEffect(() => {
    const handleStatsRefresh = () => {
      // Trigger a refetch by calling the hook's internal logic
    };
    window.addEventListener("refreshVetDashboardStats", handleStatsRefresh);
    return () => {
      window.removeEventListener("refreshVetDashboardStats", handleStatsRefresh);
    };
  }, []);

  const Dashboard = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      );
    }

    if (!stats) {
      return <div className="text-red-500">Failed to load stats</div>;
    }

    const appointmentData = [
      { name: "Completed", value: stats.completed || 0, fill: "#3B82F6" },
      { name: "Pending", value: stats.pending || 0, fill: "#F97316" },
      { 
        name: "Other", 
        value: (stats.total || 0) - ((stats.completed || 0) + (stats.pending || 0)), 
        fill: "#10B981" 
      }
    ].filter(item => item.value > 0);

    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-2 border border-gray-200 shadow-md rounded text-sm">
            <p className="font-medium text-gray-800">{`${payload[0].payload.name}: ${payload[0].value} appointments`}</p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="p-6 bg-white min-h-full rounded-xl shadow-sm border border-green-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-green-800">
            Veterinary Dashboard
          </h2>
          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-300">
            Last Updated: Just Now
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Stats Cards - Only take 3 columns on large screens */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Total Appointments",
                value: stats.total || 0,
                bgClass: "bg-green-50 text-green-600",
                iconClass: "text-green-500",
                onClick: () => navigate("/Totalappointment"),
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 3 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 3 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5"
                    />
                  </svg>
                ),
              },
              {
                title: "Completed Appointments",
                value: stats.completed || 0,
                bgClass: "bg-blue-50 text-blue-600",
                iconClass: "text-blue-500",
                onClick: () => navigate("/Totalappointment"),
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                ),
              },
              {
                title: "Pending Requests",
                value: stats.pending || 0,
                bgClass: "bg-orange-50 text-orange-600",
                iconClass: "text-orange-500",
                onClick: () => navigate("/Totalappointment"),
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                ),
              },
              {
                title: "Blog Posts",
                value: stats.blogs || 0,
                bgClass: "bg-purple-50 text-purple-600",
                iconClass: "text-purple-500",
                onClick: () => navigate("/blog"),
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                    />
                  </svg>
                ),
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
                  ${onClick ? "cursor-pointer" : ""}
                `}
              >
                <div>
                  <h3 className="text-sm font-medium opacity-70 mb-2">{title}</h3>
                  <p className="text-4xl font-bold">{value}</p>
                </div>
                <div className={`${iconClass} opacity-70`}>{icon}</div>
              </div>
            ))}
          </div>

          {/* Bar Chart - Take 2 columns on large screens */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-green-100">
            <h3 className="text-lg font-semibold text-green-800 mb-6">Appointment Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={appointmentData}
                  layout="horizontal"
                  margin={{
                    top: 5,
                    right: 15,
                    left: 5,
                    bottom: 20,
                  }}
                  barCategoryGap={10}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={{ stroke: '#D1D5DB' }}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    wrapperStyle={{ paddingBottom: 10 }}
                  />
                  <Bar 
                    dataKey="value" 
                    name="Appointments" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                    animationDuration={800}
                  >
                    <LabelList 
                      dataKey="value" 
                      position="top" 
                      fill="#333333" 
                      style={{ fontSize: '12px', fontWeight: 'bold' }} 
                      formatter={(value) => value}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleNavigation = (route, name) => {
    switch (name) {
      case "Dashboard":
        setActivePage("dashboard");
        navigate("/vetdashboard");
        break;
      case "Appointments":
        setActivePage("appointments");
        navigate("/Totalappointment");
        break;
      case "Reports":
        setActivePage("reports");
        navigate("/VeterinarianReports");
        break;
      case "Blog":
        setActivePage("blog");
        navigate("/blog");
        break;
      case "Profile":
        setActivePage("profile");
        navigate("/vetprofile");
        break;
      default:
        setActivePage("dashboard");
        navigate("/vetdashboard");
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50">
      <VeterinarianNavbar onNavigate={handleNavigation} />
      <div className="flex-1 p-8 overflow-auto">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "appointments" && <TotalAppointment />}
        {activePage === "reports" && <VeterinarianReports />}
        {activePage === "blog" && <VetBlogPage />}
        {activePage === "profile" && (
          <div className="p-6 bg-white rounded-xl shadow-sm border border-green-100">
            Profile Placeholder
          </div>
        )}
      </div>
    </div>
  );
};

export default VetDashboard;
