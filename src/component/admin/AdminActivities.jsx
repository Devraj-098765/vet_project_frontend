import React, { useState, useEffect } from "react";
import { 
  FiCalendar, 
  FiDollarSign, 
  FiFilter, 
  FiChevronDown, 
  FiSearch, 
  FiActivity,
  FiClock,
  FiUser
} from "react-icons/fi";
import AdminNavbar from "./AdminNavbar";
import useUserInfo from "../../hooks/userUserInfo";
import useAppointmentHistory from "../../hooks/useAppointmentHistory";
import usePaymentInfo from "../../hooks/usePaymentInfo";
import { format, subDays, isAfter, parseISO } from "date-fns";

const AdminActivities = () => {
  const { users } = useUserInfo();
  const { adminAppointments } = useAppointmentHistory();
  const { recentPayments } = usePaymentInfo(true);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all-time");

  useEffect(() => {
    const loadAllActivities = async () => {
      try {
        // Get appointment activities
        const appointmentActivities = adminAppointments
          .flatMap((vet) =>
            vet.appointments.map((appt) => ({
              id: appt._id,
              type: "appointment",
              message: `${appt.status} appointment for ${appt.petName} with Dr. ${vet.veterinarian?.name || "Unknown"}`,
              time: new Date(appt.date).toLocaleTimeString(),
              date: new Date(appt.date),
              rawDate: appt.date,
              userName: appt.name || "Patient",
              serviceName: appt.service || "Consultation",
              status: appt.status || "Scheduled"
            }))
          );
          
        // Get payment activities
        const paymentActivities = recentPayments
          ? recentPayments.map(payment => ({
              id: payment._id || payment.paymentIntentId,
              type: "payment",
              message: `Payment of $${payment.amount?.toFixed(2) || '0.00'} received${payment.bookingId ? ` for appointment` : ''}`,
              time: new Date(payment.createdAt).toLocaleTimeString(),
              date: new Date(payment.createdAt),
              rawDate: payment.createdAt,
              userName: payment.userId?.name || "Client",
              amount: payment.amount || 0,
              status: payment.status || "processed"
            }))
          : [];
          
        // Combine and sort activities by date (newest first)
        const allActivities = [...appointmentActivities, ...paymentActivities]
          .sort((a, b) => b.date - a.date);
          
        setActivities(allActivities);
        setFilteredActivities(allActivities);
      } catch (error) {
        console.error("Error loading activities:", error);
      }
    };

    loadAllActivities();
  }, [adminAppointments, recentPayments]);

  // Handle search
  useEffect(() => {
    filterActivities();
  }, [searchTerm, selectedFilter, timeFilter, activities]);

  const filterActivities = () => {
    let filtered = [...activities];
    
    // Apply type filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(activity => activity.type === selectedFilter);
    }
    
    // Apply time filter
    if (timeFilter !== "all-time") {
      const cutoffDate = getCutoffDate(timeFilter);
      filtered = filtered.filter(activity => 
        activity.date && isAfter(activity.date, cutoffDate)
      );
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.message.toLowerCase().includes(term) ||
        (activity.userName && activity.userName.toLowerCase().includes(term))
      );
    }
    
    setFilteredActivities(filtered);
  };
  
  const getCutoffDate = (filter) => {
    const today = new Date();
    switch (filter) {
      case "today":
        return new Date(today.setHours(0, 0, 0, 0));
      case "yesterday":
        return subDays(new Date(today.setHours(0, 0, 0, 0)), 1);
      case "week":
        return subDays(new Date(), 7);
      case "month":
        return subDays(new Date(), 30);
      default:
        return new Date(0); // Beginning of time
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setFilterOpen(false);
  };
  
  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM dd, yyyy, h:mm a");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNavbar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow rounded-xl px-8 py-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Activity History</h1>
            <span className="text-gray-500 text-sm mt-1 block">View all recent activities in your system</span>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-gray-600 text-sm">
              {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow mb-8">
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 block w-full"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-4 mt-4 md:mt-0 w-full md:w-auto self-end">
              {/* Activity Type Filter */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <FiFilter className="text-gray-500" />
                  <span>
                    {selectedFilter === "all" 
                      ? "All Types" 
                      : selectedFilter === "appointment" 
                        ? "Appointments" 
                        : "Payments"}
                  </span>
                  <FiChevronDown className="text-gray-500" />
                </button>
                
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border border-gray-200">
                    <button
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedFilter === "all" ? "bg-green-50 text-green-700" : ""}`}
                      onClick={() => handleFilterChange("all")}
                    >
                      All Types
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedFilter === "appointment" ? "bg-green-50 text-green-700" : ""}`}
                      onClick={() => handleFilterChange("appointment")}
                    >
                      Appointments
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedFilter === "payment" ? "bg-green-50 text-green-700" : ""}`}
                      onClick={() => handleFilterChange("payment")}
                    >
                      Payments
                    </button>
                  </div>
                )}
              </div>
              
              {/* Time Period Filter */}
              <div className="flex space-x-1 border border-gray-300 rounded-lg overflow-hidden">
                <button
                  className={`px-3 py-2 text-xs font-medium ${timeFilter === "today" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => handleTimeFilterChange("today")}
                >
                  Today
                </button>
                <button
                  className={`px-3 py-2 text-xs font-medium ${timeFilter === "week" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => handleTimeFilterChange("week")}
                >
                  Week
                </button>
                <button
                  className={`px-3 py-2 text-xs font-medium ${timeFilter === "month" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => handleTimeFilterChange("month")}
                >
                  Month
                </button>
                <button
                  className={`px-3 py-2 text-xs font-medium ${timeFilter === "all-time" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => handleTimeFilterChange("all-time")}
                >
                  All
                </button>
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="divide-y divide-gray-100">
            {filteredActivities.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiActivity className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-gray-800 text-lg font-medium">No activities found</h3>
                <p className="text-gray-500 mt-2">
                  {searchTerm
                    ? "Try a different search term or filter"
                    : selectedFilter !== "all"
                    ? `No ${selectedFilter} activities in the selected time period`
                    : "There are no activities in the selected time period"}
                </p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex items-center justify-center h-12 w-12 rounded-full shadow-sm flex-shrink-0
                      ${activity.type === "payment" 
                        ? "bg-teal-100 text-teal-600" 
                        : "bg-green-100 text-green-600"}`}
                    >
                      {activity.type === "payment" ? (
                        <FiDollarSign className="text-xl" />
                      ) : (
                        <FiCalendar className="text-xl" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-gray-800">
                            {activity.userName || "User"}
                          </span>
                          <p className="text-gray-700 mt-1">{activity.message}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-gray-500 text-sm">
                            <FiClock className="mr-1" />
                            <span>{formatDate(activity.rawDate)}</span>
                          </div>
                          <span className={`mt-2 px-2 py-1 text-xs rounded-full font-medium
                            ${activity.type === "payment" 
                              ? "bg-teal-100 text-teal-800" 
                              : activity.status === "confirmed" 
                                ? "bg-green-100 text-green-800"
                                : activity.status === "pending" 
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"}`}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activity.type === "appointment" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            {activity.serviceName}
                          </span>
                        )}
                        {activity.type === "payment" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                            ${activity.amount.toFixed(2)}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {activity.type === "payment" ? "Payment" : "Appointment"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Bottom counter */}
          {filteredActivities.length > 0 && (
            <div className="p-5 border-t border-gray-100 text-center text-sm text-gray-500">
              Showing {filteredActivities.length} activities
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminActivities; 