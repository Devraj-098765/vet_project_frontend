import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axiosInstance from "../../api/axios";
import NavBar from "../Header/Navbar";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";

const AppointmentReport = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get("/bookings/history");
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      setError("Failed to load appointment history");
      setLoading(false);
      toast.error("Failed to load appointment history");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Appointment History Report", 20, 10);
    
    const tableData = appointments.map((appt, index) => [
      index + 1,
      appt.service,
      appt.veterinarianId?.name || "N/A",
      appt.petName,
      appt.date,
      appt.time,
      appt.status,
    ]);

    doc.autoTable({
      head: [["#", "Service", "Veterinarian", "Pet", "Date", "Time", "Status"]],
      body: tableData,
      startY: 20,
    });
    doc.save("appointment_history.pdf");
  };

  const csvHeaders = [
    { label: "Service", key: "service" },
    { label: "Veterinarian", key: "veterinarianId.name" },
    { label: "Pet Name", key: "petName" },
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Status", key: "status" },
  ];

  return (
    <div>
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-6">Appointment Report</h1>
        <div className="flex justify-end space-x-4 mb-4">
          <button onClick={downloadPDF} className="bg-red-500 text-white px-4 py-2 rounded">Download PDF</button>
          <CSVLink data={appointments} headers={csvHeaders} filename="appointment_history.csv" className="bg-blue-500 text-white px-4 py-2 rounded">Download CSV</CSVLink>
        </div>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Service</th>
                <th className="p-3 border">Veterinarian</th>
                <th className="p-3 border">Pet</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Time</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={index} className="border">
                  <td className="p-3 border">{appt.service}</td>
                  <td className="p-3 border">{appt.veterinarianId?.name || "N/A"}</td>
                  <td className="p-3 border">{appt.petName}</td>
                  <td className="p-3 border">{appt.date}</td>
                  <td className="p-3 border">{appt.time}</td>
                  <td className="p-3 border">{appt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentReport;
