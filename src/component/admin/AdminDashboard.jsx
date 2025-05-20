import React, { useState, useEffect } from "react";
import { FiCalendar, FiHeart, FiUsers, FiActivity, FiLogOut, FiPieChart, FiDollarSign, FiCreditCard } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import useUserInfo from "../../hooks/userUserInfo";
import useAppointmentHistory from "../../hooks/useAppointmentHistory";
import usePaymentInfo from "../../hooks/usePaymentInfo";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { users } = useUserInfo();
  const { adminAppointments } = useAppointmentHistory();
  const { totalRevenue, recentPayments } = usePaymentInfo(true);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalVets: 0,
    totalRevenue: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch veterinarians
        const vetsResponse = await fetch("http://localhost:3001/api/veterinarians");
        const vetsData = await vetsResponse.json();

        // Set statistics
        const newStats = {
          totalUsers: users.length || 0,
          totalAppointments: adminAppointments.reduce((sum, vet) => sum + (vet.totalAppointments || 0), 0),
          totalVets: vetsData.length || 0,
          totalRevenue: totalRevenue || 0,
        };
        setStatistics(newStats);

        // Generate recent activities - ONLY FROM LAST 2 DAYS
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        // Appointment activities
        const appointmentActivities = adminAppointments
          .flatMap((vet) =>
            vet.appointments
              .filter(appt => new Date(appt.date) >= twoDaysAgo) // Only include last 2 days
              .map((appt) => ({
                id: appt._id,
                type: "appointment",
                message: `${appt.status} appointment for ${appt.petName} with Dr. ${vet.veterinarian?.name || "Unknown"}`,
                time: new Date(appt.date).toLocaleTimeString(),
                date: new Date(appt.date),
              }))
          );
          
        // Payment activities - format from recentPayments
        const paymentActivities = recentPayments
          ? recentPayments
              .filter(payment => payment && payment.createdAt && new Date(payment.createdAt) >= twoDaysAgo) // Only include last 2 days
              .map(payment => ({
                id: payment._id || payment.paymentIntentId,
                type: "payment",
                message: `Payment of $${payment.amount?.toFixed(2) || '0.00'} received${payment.bookingId ? ` for appointment` : ''}`,
                time: new Date(payment.createdAt).toLocaleTimeString(),
                date: new Date(payment.createdAt),
              }))
          : [];
          
        // Combine and sort activities
        const allActivities = [...appointmentActivities, ...paymentActivities]
          .sort((a, b) => b.date - a.date)
          .slice(0, 5);
          
        setRecentActivities(allActivities);

        // Generate weekly appointment data
        const weeklyData = Array(7)
          .fill(0)
          .map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dayAppointments = adminAppointments
              .flatMap((vet) => vet.appointments)
              .filter((appt) => new Date(appt.date).toDateString() === date.toDateString()).length;
            return {
              name: date.toLocaleDateString("en-US", { weekday: "short" }),
              value: dayAppointments,
            };
          });
        setAppointmentData(weeklyData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [users, adminAppointments, totalRevenue, recentPayments]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/admin");
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleStatClick = (route) => {
    navigate(route);
  };

  // Create pie chart data for users vs appointments
  const pieChartData = [
    { name: "Users", value: statistics.totalUsers, color: "#3B82F6" }, // Blue
    { name: "Appointments", value: statistics.totalAppointments, color: "#10B981" } // Green
  ];

  // Calculate total for percentage
  const pieTotal = pieChartData.reduce((sum, item) => sum + item.value, 0);

  // Calculate segments for pie chart
  const getPieChartSegments = () => {
    let cumulativePercentage = 0;
    return pieChartData.map((item) => {
      const percentage = pieTotal > 0 ? (item.value / pieTotal) * 100 : 0;
      const startAngle = cumulativePercentage;
      cumulativePercentage += percentage;
      const endAngle = cumulativePercentage;
      
      return {
        name: item.name,
        value: item.value,
        percentage,
        startAngle: (startAngle / 100) * 360,
        endAngle: (endAngle / 100) * 360,
        color: item.color
      };
    });
  };

  const pieSegments = getPieChartSegments();

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNavbar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow rounded-xl px-8 py-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <span className="text-gray-500 text-sm mt-1 block">Welcome back, Admin</span>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm text-white rounded-lg shadow transition-colors duration-300 mt-4 md:mt-0 flex items-center gap-2"
            onClick={handleLogoutClick}
          >
            <FiLogOut className="text-white" />
            <span>Log out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Users",
              count: statistics.totalUsers,
              color: "from-blue-400 to-blue-600",
              hoverColor: "from-blue-500 to-blue-700",
              icon: <FiUsers className="text-white text-2xl" />,
              route: "/UserList",
            },
            {
              title: "Total Appointments",
              count: statistics.totalAppointments,
              color: "from-green-400 to-green-600",
              hoverColor: "from-green-500 to-green-700",
              icon: <FiCalendar className="text-white text-2xl" />,
              route: "/adminAppointment",
            },
            {
              title: "Total Veterinarians",
              count: statistics.totalVets,
              color: "from-purple-400 to-purple-600",
              hoverColor: "from-purple-500 to-purple-700",
              icon: <FiHeart className="text-white text-2xl" />,
              route: "/admin/veterinarianlist",
            },
            {
              title: "Total Revenue",
              count: `$${(statistics.totalRevenue || 0).toFixed(2)}`,
              color: "from-teal-400 to-teal-600",
              hoverColor: "from-teal-500 to-teal-700",
              icon: <FiDollarSign className="text-white text-2xl" />,
              route: "/admin/payments",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow hover:shadow-lg transition-all rounded-xl overflow-hidden cursor-pointer hover:translate-y-px transform duration-300"
              onClick={() => handleStatClick(stat.route)}
            >
              <div className="flex items-center">
                <div className={`bg-gradient-to-br ${stat.color} hover:${stat.hoverColor} p-6 flex items-center justify-center transition-all duration-300`}>
                  <div className="text-2xl">{stat.icon}</div>
                </div>
                <div className="flex-1 p-5">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <span className="text-3xl font-bold text-gray-800 mt-1 block">
                    {stat.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow lg:col-span-2 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Users vs Appointments Distribution</h2>
              <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                <FiPieChart className="text-lg" />
              </div>
            </div>
            <div className="h-64 relative">
              {/* Pie Chart */}
              <div className="flex justify-center">
                <div className="relative w-64 h-64">
                  {/* Pie segments */}
                  {pieSegments.map((segment, index) => {
                    // Skip rendering if the segment is too small
                    if (segment.percentage < 0.5) return null;
                    
                    // Calculate SVG path for arc
                    const radius = 120;
                    const centerX = 128;
                    const centerY = 128;
                    
                    // Convert degrees to radians
                    const startRad = (segment.startAngle - 90) * Math.PI / 180;
                    const endRad = (segment.endAngle - 90) * Math.PI / 180;
                    
                    // Calculate points
                    const x1 = centerX + radius * Math.cos(startRad);
                    const y1 = centerY + radius * Math.sin(startRad);
                    const x2 = centerX + radius * Math.cos(endRad);
                    const y2 = centerY + radius * Math.sin(endRad);
                    
                    // Determine which arc to use (large or small)
                    const largeArc = segment.percentage > 50 ? 1 : 0;
                    
                    // Create path
                    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                    
                    return (
                      <svg key={index} className="absolute inset-0 transition-opacity duration-300 hover:opacity-90 cursor-pointer" viewBox="0 0 256 256">
                        <path
                          d={path}
                          fill={segment.color}
                          stroke="white"
                          strokeWidth="2"
                        >
                          <title>{segment.name}: {segment.value} ({segment.percentage.toFixed(1)}%)</title>
                        </path>
                      </svg>
                    );
                  })}
                  
                  {/* Center circle with total */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow">
                      <span className="text-2xl font-bold text-gray-800">{pieTotal}</span>
                      <span className="text-xs text-gray-500">Total</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center mt-6 gap-8">
                {pieSegments.map((segment, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">{segment.name}</span>
                      <span className="text-xs text-gray-500">{segment.value} ({segment.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
              <div className="bg-green-100 text-green-600 rounded-full p-2">
                <FiActivity className="text-lg" />
              </div>
            </div>
            <div className="space-y-5">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiActivity className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500">No recent activities found</p>
                </div>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-500 shadow-sm">
                      {activity.type === "payment" ? (
                        <FiDollarSign className="text-lg" />
                      ) : (
                        <FiCalendar className="text-lg" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-gray-700 font-medium">{activity.message}</span>
                      <span className="text-xs text-gray-500 mt-1 block">{activity.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              className="w-full mt-6 text-green-600 hover:text-green-800 text-sm font-medium bg-green-50 hover:bg-green-100 py-3 rounded-lg transition-colors duration-200"
              onClick={() => navigate('/admin/activities')}
            >
              View All Activity
            </button>
          </div>
        </div>

        {/* Payment Analytics Section */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Payment Analytics</h2>
            <div className="bg-teal-100 text-teal-600 rounded-full p-2">
              <FiDollarSign className="text-lg" />
            </div>
          </div>
          
          {!recentPayments || recentPayments.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
                <FiDollarSign className="text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Payment Data Available</h3>
              <p className="text-gray-500 mb-6">There are no payment records in the system yet.</p>
              <button 
                onClick={() => navigate('/admin/veterinarianlist')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
              >
                View Veterinarians
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-lg border border-teal-100">
                  <h3 className="text-sm font-medium text-teal-800 mb-2">Total Revenue</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-teal-700">${(statistics.totalRevenue || 0).toFixed(2)}</span>
                    <span className="ml-2 text-xs text-teal-600">USD</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Recent Payments</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-blue-700">{recentPayments.length}</span>
                    <span className="ml-2 text-xs text-blue-600">last 30 days</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
                  <h3 className="text-sm font-medium text-purple-800 mb-2">Average Payment</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-purple-700">
                      ${recentPayments.length > 0 
                          ? (recentPayments.reduce((sum, p) => sum + (p.amount || 0), 0) / recentPayments.length).toFixed(2) 
                          : '0.00'}
                    </span>
                    <span className="ml-2 text-xs text-purple-600">per transaction</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Payments</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentPayments.slice(0, 5).map((payment) => (
                        <tr key={payment._id || payment.paymentIntentId || Math.random()} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${(payment.amount || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.paymentIntentId ? payment.paymentIntentId.substring(0, 12) + '...' : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {payment.status || 'Unknown'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-right">
                  <button 
                    onClick={() => navigate('/admin/payments')}
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                  >
                    View All Payments →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logout Confirmation Popup */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-xl animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Logout</h3>
              <span className="text-gray-600 mb-8 block">Are you sure you want to log out?</span>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-5 py-2.5 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  onClick={cancelLogout}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm hover:shadow"
                  onClick={confirmLogout}
                >
                  Yes, Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;