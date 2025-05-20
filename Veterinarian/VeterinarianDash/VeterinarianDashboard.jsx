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
  LabelList,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  LineChart,
  Line
} from "recharts";
import VeterinarianNavbar from "../SideBarVeterinarian/SideBarVeterinarian";
import TotalAppointment from "../TotalAppointment/TotalAppointment.jsx";
import VeterinarianReports from "../VeterinarianReports.jsx";
import VetBlogPage from "../Blog.jsx";
import Earning from "../Earning.jsx";
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
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      );
    }

    if (!stats) {
      return <div className="text-red-500">Failed to load stats</div>;
    }

    // Mock data for weekly activity
    const mockWeeklyData = [
      { day: 'Mon', value: 2 },
      { day: 'Tue', value: 1 },
      { day: 'Wed', value: 3 },
      { day: 'Thu', value: 2 },
      { day: 'Fri', value: 1 },
      { day: 'Sat', value: 0 },
      { day: 'Sun', value: 0 },
    ];

    // Mock data for appointment distribution
    const appointmentData = [
      { name: "Completed", value: stats.completed || 0, fill: "#0D9488" },
      { name: "Other", value: (stats.total || 0) - (stats.completed || 0), fill: "#F59E0B" },
    ];

    return (
      <div className="p-4">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-teal-800">Dashboard</h1>
          <div className="flex items-center">
            <span className="text-sm text-teal-700 flex items-center">
              <span className="h-2 w-2 bg-teal-500 rounded-full mr-2"></span>
              Last Updated: Just Now
            </span>
            <button 
              onClick={() => window.dispatchEvent(new Event("refreshVetDashboardStats"))}
              className="ml-3 p-2 bg-teal-500 text-white rounded-lg"
              aria-label="Refresh data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-teal-800 mb-6">Key Metrics</h2>
          
          <div className="space-y-6">
            {/* Total Appointments */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Total Appointments</span>
                <span className="text-sm font-medium text-teal-800">{stats.total || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            {/* Completed */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium text-blue-800">{stats.completed || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
            
            {/* Pending */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-medium text-amber-800">{stats.pending || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
            
            {/* Blog Posts */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Blog Posts</span>
                <span className="text-sm font-medium text-purple-800">{stats.blogs || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Completed Appointments Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-blue-500 p-4 text-white flex items-center">
              <h3 className="font-medium">Completed Appointments</h3>
              <svg className="w-6 h-6 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="p-8 flex justify-center items-center">
              <div className="text-6xl font-bold text-blue-500">{stats.completed || 0}</div>
            </div>
          </div>

          {/* Blog Posts Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-purple-500 p-4 text-white flex items-center">
              <h3 className="font-medium">Blog Posts</h3>
              <svg className="w-6 h-6 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="p-8 flex justify-center items-center">
              <div className="text-6xl font-bold text-purple-500">{stats.blogs || 0}</div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-teal-800 mb-4">Weekly Activity</h2>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockWeeklyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis hide={true} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0EA5E9" 
                  fill="url(#colorValue)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Grid - Appointment Distribution, Status, and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Appointment Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-teal-800 mb-2">Appointment Distribution</h3>
            <p className="text-sm text-teal-600 mb-4">Status breakdown</p>
            
            <div className="flex justify-center py-2">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appointmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {appointmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-teal-600">
                      {stats.completed ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm text-gray-600">Other</span>
              </div>
            </div>
          </div>

          {/* Appointment Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-teal-800 mb-2">Appointment Status</h3>
            <p className="text-sm text-teal-600 mb-4">Comparison view</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-sm font-medium text-teal-800">{stats.completed || 0}</span>
                </div>
                <div className="w-full bg-gray-100 h-6 rounded">
                  <div 
                    className="bg-teal-500 h-6 rounded" 
                    style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Other</span>
                  <span className="text-sm font-medium text-amber-800">
                    {(stats.total || 0) - (stats.completed || 0)}
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-6 rounded">
                  <div 
                    className="bg-amber-500 h-6 rounded" 
                    style={{ width: `${stats.total ? ((stats.total - stats.completed) / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-teal-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                {
                  title: "View Appointments",
                  description: "Check your schedule",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  onClick: () => navigate("/Totalappointment"),
                  bgColor: "bg-teal-50",
                  textColor: "text-teal-700",
                  iconColor: "text-teal-600",
                },
                {
                  title: "Manage Reports",
                  description: "View patient records",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                  onClick: () => navigate("/veterinarian-reports"),
                  bgColor: "bg-blue-50",
                  textColor: "text-blue-700",
                  iconColor: "text-blue-600",
                },
                {
                  title: "Write Blog Post",
                  description: "Share your expertise",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ),
                  onClick: () => navigate("/blog"),
                  bgColor: "bg-purple-50",
                  textColor: "text-purple-700",
                  iconColor: "text-purple-600",
                },
                {
                  title: "Check Earnings",
                  description: "View your income",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  onClick: () => navigate("/earning"),
                  bgColor: "bg-amber-50",
                  textColor: "text-amber-700",
                  iconColor: "text-amber-600",
                },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`w-full flex items-center p-3 rounded-xl transition-colors duration-200 ${action.bgColor} hover:bg-opacity-80`}
                >
                  <div className={`p-1 ${action.iconColor}`}>{action.icon}</div>
                  <div className="ml-3 text-left">
                    <p className={`font-medium ${action.textColor}`}>{action.title}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </button>
              ))}
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
        navigate("/veterinarian-reports");
        break;
      case "Blog":
        setActivePage("blog");
        navigate("/blog");
        break;
      case "Profile":
        setActivePage("profile");
        navigate("/vetprofile");
        break;
      case "Earning":
        setActivePage("earning");
        navigate("/earning");
        break;
      default:
        setActivePage("dashboard");
        navigate("/vetdashboard");
    }
  };

  return (
    <div className="flex bg-teal-50 min-h-screen">
      {/* Sidebar */}
      <VeterinarianNavbar onNavigate={handleNavigation} />

      {/* Main Content - Fixed the sidebar spacing issue */}
      <div className="flex-1" style={{ marginLeft: "4.5rem" }}>
        <div className="max-w-7xl mx-auto">
          {activePage === "dashboard" && <Dashboard />}
          {activePage === "appointments" && <TotalAppointment />}
          {activePage === "reports" && <VeterinarianReports />}
          {activePage === "blog" && <VetBlogPage />}
          {activePage === "profile" && (
            <div className="p-6 bg-white rounded-xl shadow-sm m-4">
              Profile Placeholder
            </div>
          )}
          {activePage === "earning" && <Earning />}
        </div>
      </div>
    </div>
  );
};

export default VetDashboard;
