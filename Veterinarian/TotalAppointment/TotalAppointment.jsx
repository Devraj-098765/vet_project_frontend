import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SideBarVeterinarian from "../SideBarVeterinarian/SideBarVeterinarian";
import axiosInstance from "../../src/api/axios";
import { FileText, Eye } from "lucide-react";

const TotalAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [displayedAppointments, setDisplayedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentReport, setCurrentReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
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
        setDisplayedAppointments(sortedAppointments.slice(0, appointmentsPerPage));
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

      setDisplayedAppointments((prevDisplayed) =>
        prevDisplayed.map((appt) =>
          appt._id === bookingId ? { ...appt, status } : appt
        )
      );

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

    // Get the next set of appointments
    const nextAppointments = appointments.slice(startIndex, endIndex);

    // Append to displayed appointments
    setDisplayedAppointments([...displayedAppointments, ...nextAppointments]);
    setCurrentPage(nextPage);
  };

  if (loading)
    return (
      <div className="flex h-screen">
        <SideBarVeterinarian />
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Loading appointments...
        </div>
      </div>
    );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SideBarVeterinarian />
      <div className="flex-1 p-6">
        <div className="bg-white shadow-sm rounded p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Total Appointments</h2>
        </div>

        {appointments && appointments.length > 0 ? (
          <div className="space-y-4">
            {displayedAppointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white shadow-sm rounded-lg overflow-hidden"
              >
                <table className="w-full table-fixed border-collapse">
                  <thead>
                    <tr className="bg-green-700 text-white">
                      <th className="py-3 px-4 text-left font-medium">Pet Details</th>
                      <th className="py-3 px-4 text-left font-medium">Service</th>
                      <th className="py-3 px-4 text-left font-medium">Schedule</th>
                      <th className="py-3 px-4 text-left font-medium">Owner</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-center font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 border-b">
                        <div className="font-medium text-gray-800">{appt.petName}</div>
                        <div className="text-sm text-gray-500">{appt.petType}</div>
                      </td>
                      <td className="py-4 px-4 border-b text-gray-600">{appt.service}</td>
                      <td className="py-4 px-4 border-b text-gray-600">
                        <div>{appt.date}</div>
                        <div className="text-sm text-gray-500">{appt.time}</div>
                      </td>
                      <td className="py-4 px-4 border-b">
                        <div className="text-gray-600">{appt.userId?.name || "N/A"}</div>
                        <div className="text-sm text-gray-500">{appt.userId?.email || "N/A"}</div>
                      </td>
                      <td className="py-4 px-4 border-b">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appt.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appt.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : appt.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 border-b text-center">
                        {appt.status === "Pending" ? (
                          <div className="flex flex-col space-y-2 items-center">
                            <button
                              onClick={() => handleConfirm(appt._id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm w-full max-w-xs"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleCancel(appt._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm w-full max-w-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col space-y-2 items-center">
                            {appt.hasReport ? (
                              <button
                                onClick={() => handleViewReport(appt._id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm w-full max-w-xs flex items-center justify-center"
                              >
                                <Eye className="h-4 w-4 mr-1" /> View Report
                              </button>
                            ) : (
                              <button
                                onClick={() => handleCreateReport(appt._id)}
                                className={`px-4 py-2 rounded text-sm w-full max-w-xs flex items-center justify-center ${
                                  appt.status === "Cancelled" || appt.status === "Completed"
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600 text-white"
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
                                <FileText className="h-4 w-4 mr-1" /> Create Report
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}

            {/* Load More button (only show if there are more appointments to load) */}
            {displayedAppointments.length < appointments.length && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition"
                >
                  Load More Appointments
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg text-center shadow-sm">
            <p className="text-gray-500">No appointments scheduled.</p>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && currentReport && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Report for {currentReport.petName}
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
                    <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-1">
                      Patient Information
                    </h3>
                    <div className="space-y-3">
                      <p><span className="font-medium">Pet Name:</span> {currentReport.petName}</p>
                      <p><span className="font-medium">Pet Type:</span> {currentReport.petType}</p>
                      <p><span className="font-medium">Weight:</span> {currentReport.weight || 'N/A'}</p>
                      <p><span className="font-medium">Temperature:</span> {currentReport.temperature || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-1">
                      Report Details
                    </h3>
                    <div className="space-y-3">
                      <p><span className="font-medium">Created:</span> {formatDate(currentReport.createdAt)}</p>
                      <p><span className="font-medium">Follow-up Date:</span> {currentReport.followUpDate || 'None'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-semibold text-blue-700">Diagnosis</h4>
                    <p className="mt-1 bg-blue-50 p-3 rounded-lg">{currentReport.diagnosis}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-700">Treatment</h4>
                    <p className="mt-1 bg-blue-50 p-3 rounded-lg">{currentReport.treatment}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-700">Medications</h4>
                      <p className="mt-1 bg-blue-50 p-3 rounded-lg min-h-16">
                        {currentReport.medications || 'None prescribed'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700">Vaccinations</h4>
                      <p className="mt-1 bg-blue-50 p-3 rounded-lg min-h-16">
                        {currentReport.vaccinations || 'None administered'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-700">Recommendations</h4>
                    <p className="mt-1 bg-blue-50 p-3 rounded-lg">
                      {currentReport.recommendations || 'No specific recommendations provided'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t flex justify-end">
                <button
                  onClick={closeReportModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
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