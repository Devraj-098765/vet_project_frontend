import { useState, useEffect } from "react";
import axiosInstance from "../../src/api/axios.js"; // Adjust path to your axios file
import { toast } from "react-toastify";
import VeterinarianNavbar from "../SideBarVeterinarian/SideBarVeterinarian";

const TotalAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("TotalAppointment", appointments);

  // Fetch appointments for the veterinarian
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log(
          "Fetching appointments with token:",
          localStorage.getItem("vetapp-token")
        );
        const { data } = await axiosInstance.get("/bookings/veterinarian");
        console.log("Appointments data:", data);
        setAppointments(data.bookings || []); // Access the bookings array from response
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
  }, []);

  // Handle confirming or canceling an appointment
  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const { data } = await axiosInstance.put(`/bookings/${bookingId}/status`, {
        status,
      });
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === bookingId ? { ...appt, status } : appt
        )
      );
      toast.success(data.message);
    } catch (error) {
      console.error(
        error.response?.status,
        error.response?.data
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

  if (loading) return <p className="p-5 text-gray-500">Loading appointments...</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <VeterinarianNavbar />

      {/* Main Content */}
      <div className="p-5 flex-1">
        <h2 className="text-2xl font-semibold mb-5">Total Appointments</h2>
        {appointments && appointments.length > 0 ? (
          <div className="grid gap-6">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                {/* Appointment and User Details */}
                <div className="flex-1">
                  <div className="mb-3">
                    <h3 className="text-lg font-medium text-gray-800">
                      {appt.petName} ({appt.petType})
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Service:</span>{" "}
                      {appt.service}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Date:</span> {appt.date} at{" "}
                      {appt.time}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded text-white text-sm ${
                          appt.status === "Pending"
                            ? "bg-yellow-500"
                            : appt.status === "Confirmed"
                            ? "bg-green-500"
                            : appt.status === "Completed"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </p>
                  </div>

                  {/* User Profile */}
                  <div className="border-t pt-3">
                    <h4 className="text-md font-medium text-gray-700">
                      Booked by:
                    </h4>
                    <p className="text-gray-600">
                      <span className="font-medium">Name:</span>{" "}
                      {appt.userId?.name || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span>{" "}
                      {appt.userId?.email || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 md:mt-0 md:ml-4 flex space-x-3">
                  {appt.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleConfirm(appt._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleCancel(appt._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {appt.status !== "Pending" && (
                    <p className="text-gray-500 italic">Status: {appt.status}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No appointments scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default TotalAppointment;