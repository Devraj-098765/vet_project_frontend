import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SideBarVeterinarian from "../SideBarVeterinarian/SideBarVeterinarian";
import axiosInstance from "../../src/api/axios";
import { FileText, Eye, Phone, Calendar, User, Clock, MessageCircle, Filter } from "lucide-react";

const TotalAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [displayedAppointments, setDisplayedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentReport, setCurrentReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  console.log("TotalAppointment", appointments);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log(
          "Fetching appointments with token:",
          localStorage.getItem("vetapp-token")
        );
        const { data } = await axiosInstance.get("/bookings/veterinarian");
        console.log("Appointments data:", data);

        // Sort appointments by date (newest first)
        const sortedAppointments = (data.bookings || []).sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });

        setAppointments(sortedAppointments);
        applyFilters(sortedAppointments);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching appointments:",
          error.response?.status,
          error.response?.data,
          error.message
        );
        setLoading(false);
        toast.error("Failed to load appointments");
      }
    };
    fetchAppointments();
  }, [appointmentsPerPage]);

  // Apply filters based on the current status filter
  const applyFilters = (appointmentsToFilter) => {
    let filtered = [...appointmentsToFilter];
    
    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(appt => 
        appt.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    setDisplayedAppointments(filtered.slice(0, appointmentsPerPage));
    setCurrentPage(1);
  };

  // Effect to reapply filters when statusFilter changes
  useEffect(() => {
    if (!loading && appointments.length > 0) {
      applyFilters(appointments);
    }
  }, [statusFilter, loading]);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const { data } = await axiosInstance.put(`/bookings/${bookingId}/status`, {
        status,
      });

      // Update both appointments arrays with the new status
      const updatedAppointments = appointments.map((appt) =>
        appt._id === bookingId ? { ...appt, status } : appt
      );
      setAppointments(updatedAppointments);

      // Reapply filters with updated appointments
      applyFilters(updatedAppointments);

      toast.success(data.message);
    } catch (error) {
      console.error(
        "Error updating appointment status:",
        error.response?.status,
        error.response?.data,
        error.message
      );
      toast.error(`Failed to update appointment to ${status}`);
    }
  };

  const handleConfirm = (bookingId) => {
    if (window.confirm("Are you sure you want to confirm this appointment?")) {
      handleStatusUpdate(bookingId, "Confirmed");
    }
  };

  const handleCancel = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      handleStatusUpdate(bookingId, "Cancelled");
    }
  };

  const handleCreateReport = (bookingId) => {
    const appointment = appointments.find((appt) => appt._id === bookingId);
    if (appointment.hasReport) {
      toast.error("A report already exists for this appointment");
      return;
    }
    if (appointment.status === "Completed") {
      toast.error("Cannot create report for completed appointments");
      return;
    }
    console.log("Navigating to MakeReport with ID:", bookingId);
    navigate(`/booking-report/${bookingId}`);
  };

  const handleViewReport = async (bookingId) => {
    try {
      const response = await axiosInstance.get(`/bookings/report-by-booking/${bookingId}`);
      setCurrentReport(response.data);
      setShowReportModal(true);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to fetch appointment report");
    }
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setCurrentReport(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = currentPage * appointmentsPerPage;
    const endIndex = startIndex + appointmentsPerPage;

    // Apply filter to all appointments
    let filtered = [...appointments];
    if (statusFilter !== "All") {
      filtered = filtered.filter(appt => 
        appt.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Get the next set of filtered appointments
    const nextAppointments = filtered.slice(startIndex, endIndex);

    // Append to displayed appointments
    setDisplayedAppointments([...displayedAppointments, ...nextAppointments]);
    setCurrentPage(nextPage);
  };

  // Handle filter button clicks
  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };

  const getFilterButtonClass = (status) => {
    return statusFilter === status
      ? "bg-green-600 text-white" 
      : "bg-white text-green-700 hover:bg-green-50";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-200 text-amber-900 border border-amber-400";
      case "Confirmed":
        return "bg-green-200 text-green-900 border border-green-400";
      case "Completed":
        return "bg-blue-200 text-blue-900 border border-blue-400";
      case "Cancelled":
        return "bg-red-200 text-red-900 border border-red-400";
      default:
        return "bg-gray-200 text-gray-900 border border-gray-400";
    }
  };

  if (loading)
    return (
      <div className="flex h-screen">
        <SideBarVeterinarian />
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-green-800 font-medium">Loading appointments...</p>
          </div>
        </div>
      </div>
    );

  // Count number of appointments for each status
  const pendingCount = appointments.filter(a => a.status === "Pending").length;
  const confirmedCount = appointments.filter(a => a.status === "Confirmed").length;
  const cancelledCount = appointments.filter(a => a.status === "Cancelled").length;

  return (
    <div className="flex bg-green-50 min-h-screen">
      <SideBarVeterinarian />
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 border-l-4 border-green-700">
          <h2 className="text-2xl font-semibold text-green-800">Appointment Management</h2>
          <p className="text-green-600 mt-1">View and manage all your veterinary appointments</p>
        </div>

        {/* Status Filter Buttons */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2 text-green-700" />
            <h3 className="text-lg font-medium text-green-800">Filter Appointments by Status</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange("All")}
              className={`px-4 py-2 rounded-lg transition-colors ${getFilterButtonClass("All")}`}
            >
              All Appointments ({appointments.length})
            </button>
            <button
              onClick={() => handleFilterChange("Pending")}
              className={`px-4 py-2 rounded-lg transition-colors ${getFilterButtonClass("Pending")}`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => handleFilterChange("Confirmed")}
              className={`px-4 py-2 rounded-lg transition-colors ${getFilterButtonClass("Confirmed")}`}
            >
              Confirmed ({confirmedCount})
            </button>
            <button
              onClick={() => handleFilterChange("Cancelled")}
              className={`px-4 py-2 rounded-lg transition-colors ${getFilterButtonClass("Cancelled")}`}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>
        </div>

        {displayedAppointments && displayedAppointments.length > 0 ? (
          <div className="space-y-6">
            {displayedAppointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white shadow-md rounded-lg overflow-hidden border border-green-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-white rounded-full p-2 mr-3">
                        {appt.petType === "Dog" ? (
                          <span className="text-green-700 text-xl">🐕</span>
                        ) : appt.petType === "Cat" ? (
                          <span className="text-green-700 text-xl">🐈</span>
                        ) : (
                          <span className="text-green-700 text-xl">🐾</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{appt.petName}</h3>
                        <p className="text-green-100 text-sm">{appt.petType}</p>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(appt.status)}`}
                      >
                        {appt.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 grid md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-800 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-green-600" />
                      Appointment Details
                    </h4>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-700 mb-1">
                        <span className="font-medium">Service:</span> {appt.service}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <span className="font-medium">Date:</span> {appt.date}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Time:</span> {appt.time}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-green-800 flex items-center">
                      <User className="h-4 w-4 mr-2 text-green-600" />
                      Owner Information
                    </h4>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-700 mb-1">
                        <span className="font-medium">Name:</span> {appt.userId?.name || "N/A"}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <span className="font-medium">Email:</span> {appt.userId?.email || "N/A"}
                      </p>
                      <p className="text-gray-700 flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-green-600" />
                        {appt.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-green-800 flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                      Actions
                    </h4>
                    <div className="bg-green-50 p-3 rounded-lg">
                      {appt.status === "Pending" ? (
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleConfirm(appt._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-all duration-200 flex items-center justify-center"
                          >
                            <Clock className="h-4 w-4 mr-1" /> Confirm Appointment
                          </button>
                          <button
                            onClick={() => handleCancel(appt._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-all duration-200 flex items-center justify-center"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Appointment
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-2">
                          {appt.hasReport ? (
                            <button
                              onClick={() => handleViewReport(appt._id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-all duration-200 flex items-center justify-center"
                            >
                              <Eye className="h-4 w-4 mr-1" /> View Medical Report
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCreateReport(appt._id)}
                              className={`px-4 py-2 rounded-md text-sm transition-all duration-200 flex items-center justify-center ${
                                appt.status === "Cancelled" || appt.status === "Completed"
                                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-700 text-white"
                              }`}
                              disabled={appt.status === "Cancelled" || appt.status === "Completed"}
                              title={
                                appt.status === "Cancelled"
                                  ? "Cannot create report for cancelled appointments"
                                  : appt.status === "Completed"
                                  ? "Cannot create report for completed appointments"
                                  : ""
                              }
                            >
                              <FileText className="h-4 w-4 mr-1" /> Create Medical Report
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Load More button (only show if there are more appointments to load) */}
            {(() => {
              // Get current filtered appointments
              let filteredAppointments = appointments;
              if (statusFilter !== "All") {
                filteredAppointments = appointments.filter(
                  appt => appt.status.toLowerCase() === statusFilter.toLowerCase()
                );
              }
              
              return displayedAppointments.length < filteredAppointments.length && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md shadow-md transition-all duration-200 flex items-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    Load More Appointments
                  </button>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg text-center shadow-md border border-green-100">
            <div className="flex flex-col items-center">
              <div className="text-green-600 mb-4">
                <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-green-800 mb-2">
                {statusFilter === "All" 
                  ? "No Appointments Yet" 
                  : `No ${statusFilter} Appointments`}
              </h3>
              <p className="text-gray-500">
                {statusFilter === "All"
                  ? "There are currently no appointments scheduled in your calendar."
                  : `There are currently no appointments with status "${statusFilter}".`}
              </p>
              {statusFilter !== "All" && (
                <button
                  onClick={() => handleFilterChange("All")}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Show All Appointments
                </button>
              )}
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && currentReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-green-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-green-800">
                    Medical Report for {currentReport.petName}
                  </h2>
                  <button
                    onClick={closeReportModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-700 border-b border-green-200 pb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Patient Information
                    </h3>
                    <div className="space-y-3 bg-green-50 p-4 rounded-lg">
                      <p className="flex justify-between border-b border-green-100 pb-2">
                        <span className="font-medium text-green-800">Pet Name:</span> 
                        <span className="text-gray-700">{currentReport.petName}</span>
                      </p>
                      <p className="flex justify-between border-b border-green-100 pb-2">
                        <span className="font-medium text-green-800">Pet Type:</span> 
                        <span className="text-gray-700">{currentReport.petType}</span>
                      </p>
                      <p className="flex justify-between border-b border-green-100 pb-2">
                        <span className="font-medium text-green-800">Weight:</span> 
                        <span className="text-gray-700">{currentReport.weight || 'N/A'}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-green-800">Temperature:</span> 
                        <span className="text-gray-700">{currentReport.temperature || 'N/A'}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-700 border-b border-green-200 pb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Report Details
                    </h3>
                    <div className="space-y-3 bg-green-50 p-4 rounded-lg">
                      <p className="flex justify-between border-b border-green-100 pb-2">
                        <span className="font-medium text-green-800">Created:</span> 
                        <span className="text-gray-700">{formatDate(currentReport.createdAt)}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-green-800">Follow-up Date:</span> 
                        <span className="text-gray-700">{currentReport.followUpDate || 'None'}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Diagnosis
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                      <p className="text-gray-700">{currentReport.diagnosis}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Treatment
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                      <p className="text-gray-700">{currentReport.treatment}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Medications
                      </h4>
                      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600 min-h-16">
                        <p className="text-gray-700">{currentReport.medications || 'None prescribed'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Vaccinations
                      </h4>
                      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600 min-h-16">
                        <p className="text-gray-700">{currentReport.vaccinations || 'None administered'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Recommendations
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                      <p className="text-gray-700">{currentReport.recommendations || 'No specific recommendations provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-green-100 flex justify-end bg-green-50">
                <button
                  onClick={closeReportModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-3 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalAppointment;