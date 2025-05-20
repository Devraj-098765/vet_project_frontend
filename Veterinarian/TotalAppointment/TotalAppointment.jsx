import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SideBarVeterinarian from "../SideBarVeterinarian/SideBarVeterinarian";
import axiosInstance from "../../src/api/axios";
import { Calendar, User, Clock, FileText, Eye, Filter, Check, X, AlertCircle, MessageCircle, Phone, Clipboard, ChevronDown } from "lucide-react";

const TotalAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [displayedAppointments, setDisplayedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState([]);
  const [appointmentsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentReport, setCurrentReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    if (processingIds.includes(bookingId)) {
      return;
    }

    try {
      setProcessingIds(prev => [...prev, bookingId]);
      
      const updatedAppointments = appointments.map((appt) =>
        appt._id === bookingId ? { ...appt, status } : appt
      );
      setAppointments(updatedAppointments);
      
      let filtered = [...updatedAppointments];
      if (statusFilter !== "All") {
        filtered = filtered.filter(appt => 
          appt.status.toLowerCase() === statusFilter.toLowerCase()
        );
      }
      
      const startIndex = 0;
      const endIndex = currentPage * appointmentsPerPage;
      setDisplayedAppointments(filtered.slice(startIndex, endIndex));

      const { data } = await axiosInstance.put(`/bookings/${bookingId}/status`, {
        status,
      });

      toast.success(data.message);
    } catch (error) {
      console.error(
        "Error updating appointment status:",
        error.response?.status,
        error.response?.data,
        error.message
      );
      
      const originalAppointments = appointments.map((appt) =>
        appt._id === bookingId ? { ...appt, status: appt.status } : appt
      );
      setAppointments(originalAppointments);
      applyFilters(originalAppointments);
      
      toast.error(`Failed to update appointment to ${status}`);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== bookingId));
    }
  };

  const handleConfirm = (bookingId) => {
    if (processingIds.includes(bookingId)) {
      toast.info("Already processing this request...");
      return;
    }
    
    if (window.confirm("Are you sure you want to confirm this appointment?")) {
      handleStatusUpdate(bookingId, "Confirmed");
    }
  };

  const handleCancel = (bookingId) => {
    if (processingIds.includes(bookingId)) {
      toast.info("Already processing this request...");
      return;
    }
    
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
      ? "bg-teal-600 text-white" 
      : "bg-white text-teal-700 hover:bg-teal-50 border border-teal-100";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border border-amber-300";
      case "Confirmed":
        return "bg-teal-100 text-teal-800 border border-teal-300";
      case "Completed":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />;
      case "Confirmed":
        return <Check className="h-4 w-4 mr-1 text-teal-500" />;
      case "Completed":
        return <Check className="h-4 w-4 mr-1 text-blue-500" />;
      case "Cancelled":
        return <X className="h-4 w-4 mr-1 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="flex h-screen bg-teal-50">
        <SideBarVeterinarian onToggleCollapse={(collapsed) => setSidebarCollapsed(collapsed)} />
        <div className={`flex-1 transition-all duration-300`} style={{ marginLeft: "4.5rem" }}>
          <div className="max-w-7xl mx-auto p-4">
            <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-teal-700 font-medium">Loading appointments...</p>
            </div>
          </div>
        </div>
      </div>
    );

  // Count number of appointments for each status
  const pendingCount = appointments.filter(a => a.status === "Pending").length;
  const confirmedCount = appointments.filter(a => a.status === "Confirmed").length;
  const cancelledCount = appointments.filter(a => a.status === "Cancelled").length;

  return (
    <div className="flex min-h-screen bg-teal-50">
      <SideBarVeterinarian onToggleCollapse={(collapsed) => setSidebarCollapsed(collapsed)} />
      <main className={`flex-1 transition-all duration-300`} style={{ marginLeft: "4.5rem" }}>
        <div className="max-w-7xl mx-auto p-4">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
            <p className="text-gray-500">View and manage all your veterinary appointments</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
              <div className="flex items-center mb-2">
                <div className="text-teal-500">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="ml-2 text-sm text-gray-500">Total Appointments</span>
              </div>
              <span className="text-3xl font-bold text-gray-800">{appointments.length}</span>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
              <div className="flex items-center mb-2">
                <div className="text-amber-500">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="ml-2 text-sm text-gray-500">Pending</span>
              </div>
              <span className="text-3xl font-bold text-gray-800">{pendingCount}</span>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
              <div className="flex items-center mb-2">
                <div className="text-blue-500">
                  <Check className="h-5 w-5" />
                </div>
                <span className="ml-2 text-sm text-gray-500">Confirmed</span>
              </div>
              <span className="text-3xl font-bold text-gray-800">{confirmedCount}</span>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
              <div className="flex items-center mb-2">
                <div className="text-red-500">
                  <X className="h-5 w-5" />
                </div>
                <span className="ml-2 text-sm text-gray-500">Cancelled</span>
              </div>
              <span className="text-3xl font-bold text-gray-800">{cancelledCount}</span>
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div className="mb-6">
            <div className="mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-teal-600" />
              <h3 className="text-lg font-medium text-gray-800">Filter Appointments</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange("All")}
                className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === "All" ? "bg-teal-600 text-white" : "bg-white text-gray-700"}`}
              >
                All Appointments ({appointments.length})
              </button>
              <button
                onClick={() => handleFilterChange("Pending")}
                className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === "Pending" ? "bg-amber-500 text-white" : "bg-white text-gray-700"}`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => handleFilterChange("Confirmed")}
                className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === "Confirmed" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
              >
                Confirmed ({confirmedCount})
              </button>
              <button
                onClick={() => handleFilterChange("Cancelled")}
                className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === "Cancelled" ? "bg-red-500 text-white" : "bg-white text-gray-700"}`}
              >
                Cancelled ({cancelledCount})
              </button>
            </div>
          </div>

          {/* Appointment Cards */}
          {displayedAppointments && displayedAppointments.length > 0 ? (
            <div className="space-y-4">
              {displayedAppointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="mr-4">
                          {appt.petType === "Dog" ? (
                            <span className="text-2xl">🐕</span>
                          ) : appt.petType === "Cat" ? (
                            <span className="text-2xl">🐈</span>
                          ) : (
                            <span className="text-2xl">🐾</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{appt.petName}</h3>
                          <p className="text-gray-500 text-sm">{appt.petType}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          appt.status === "Pending" 
                            ? "bg-amber-100 text-amber-800" 
                            : appt.status === "Confirmed" 
                            ? "bg-blue-100 text-blue-800" 
                            : appt.status === "Cancelled" 
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appt.status === "Pending" && <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />}
                        {appt.status === "Confirmed" && <Check className="h-4 w-4 mr-1 text-blue-500" />}
                        {appt.status === "Cancelled" && <X className="h-4 w-4 mr-1 text-red-500" />}
                        {appt.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          Appointment Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Service:</span>
                            <span className="text-gray-700 font-medium text-sm">{appt.service}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Date:</span>
                            <span className="text-gray-700 font-medium text-sm">{appt.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Time:</span>
                            <span className="text-gray-700 font-medium text-sm">{appt.time}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          Owner Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Name:</span>
                            <span className="text-gray-700 font-medium text-sm">{appt.userId?.name || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Email:</span>
                            <span className="text-gray-700 font-medium text-sm">{appt.userId?.email || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Phone:</span>
                            <span className="text-gray-700 font-medium text-sm">{appt.phone || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <MessageCircle className="h-4 w-4 mr-2 text-gray-400" />
                          Actions
                        </h4>
                        <div className="space-y-2">
                          {appt.status === "Pending" ? (
                            <>
                              <button
                                onClick={() => handleConfirm(appt._id)}
                                disabled={processingIds.includes(appt._id)}
                                className={`w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-center ${
                                  processingIds.includes(appt._id) ? "opacity-75 cursor-wait" : ""
                                }`}
                              >
                                {processingIds.includes(appt._id) ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-1" /> Confirm
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleCancel(appt._id)}
                                disabled={processingIds.includes(appt._id)}
                                className={`w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-center ${
                                  processingIds.includes(appt._id) ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              {appt.hasReport ? (
                                <button
                                  onClick={() => handleViewReport(appt._id)}
                                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-center"
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View Report
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleCreateReport(appt._id)}
                                  className={`w-full px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-center ${
                                    appt.status === "Cancelled" || appt.status === "Completed"
                                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                                      : "bg-teal-600 hover:bg-teal-700 text-white"
                                  }`}
                                  disabled={appt.status === "Cancelled" || appt.status === "Completed"}
                                >
                                  <FileText className="h-4 w-4 mr-1" /> Create Report
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More button */}
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
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl flex items-center"
                    >
                      <ChevronDown className="h-5 w-5 mr-2" />
                      Load More
                    </button>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-xl text-center shadow-sm">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full text-gray-400 mb-4">
                  <Calendar className="h-16 w-16" strokeWidth={1} />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  {statusFilter === "All" 
                    ? "No Appointments Yet" 
                    : `No ${statusFilter} Appointments`}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {statusFilter === "All"
                    ? "There are currently no appointments scheduled in your calendar."
                    : `There are currently no appointments with status "${statusFilter}".`}
                </p>
                {statusFilter !== "All" && (
                  <button
                    onClick={() => handleFilterChange("All")}
                    className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
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
              <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Medical Report: {currentReport.petName}
                  </h2>
                  <button
                    onClick={closeReportModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Patient Information
                      </h3>
                      <div className="space-y-3">
                        <p className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-medium text-gray-800">Pet Name:</span> 
                          <span className="text-gray-700">{currentReport.petName}</span>
                        </p>
                        <p className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-medium text-gray-800">Pet Type:</span> 
                          <span className="text-gray-700">{currentReport.petType}</span>
                        </p>
                        <p className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-medium text-gray-800">Weight:</span> 
                          <span className="text-gray-700">{currentReport.weight || 'N/A'}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-800">Temperature:</span> 
                          <span className="text-gray-700">{currentReport.temperature || 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Report Details
                      </h3>
                      <div className="space-y-3">
                        <p className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-medium text-gray-800">Created:</span> 
                          <span className="text-gray-700">{formatDate(currentReport.createdAt)}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-800">Follow-up Date:</span> 
                          <span className="text-gray-700">{currentReport.followUpDate || 'None'}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6 mt-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Diagnosis
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{currentReport.diagnosis}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Treatment
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{currentReport.treatment}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                          <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Medications
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg min-h-16">
                          <p className="text-gray-700">{currentReport.medications || 'None prescribed'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                          <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Vaccinations
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg min-h-16">
                          <p className="text-gray-700">{currentReport.vaccinations || 'None administered'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Recommendations
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{currentReport.recommendations || 'No specific recommendations provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50">
                  <button
                    onClick={closeReportModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-3"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
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
      </main>
    </div>
  );
};

export default TotalAppointment;