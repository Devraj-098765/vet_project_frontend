import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FileText, Download, Printer, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import axiosInstance from "../api/axios";
import NavBar from "../component/Header/NavBar";

const MyReportCard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReportId, setExpandedReportId] = useState(null);
  const reportsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("vetapp-token");
        console.log("Fetching user reports with token:", token);
        if (!token) {
          throw new Error("No authentication token found");
        }
        const { data } = await axiosInstance.get("bookings/reports"); // Relative path
        console.log("User reports data:", data);
        setReports(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          fullError: error
        });
        setLoading(false);
        toast.error(error.response?.data?.error || "Failed to load your reports");
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report =>
    report.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const toggleReportDetails = (reportId) => {
    setExpandedReportId(expandedReportId === reportId ? null : reportId);
  };

  const downloadReportAsPDF = (report) => {
    const doc = new jsPDF();
    doc.text(`Veterinary Report for ${report.petName}`, 10, 10);
    doc.text(`Date: ${report.createdAt.split('T')[0]}`, 10, 20);
    doc.text(`Diagnosis: ${report.diagnosis || 'N/A'}`, 10, 30);
    doc.text(`Treatment: ${report.treatment || 'N/A'}`, 10, 40);
    doc.text(`Medications: ${report.medications || 'None'}`, 10, 50);
    doc.text(`Vaccinations: ${report.vaccinations || 'None'}`, 10, 60);
    doc.text(`Recommendations: ${report.recommendations || 'None'}`, 10, 70);
    doc.save(`${report.petName}_Report.pdf`);
  };

  const printReport = (report) => {
    const printContent = `
      <h2>Veterinary Report for ${report.petName}</h2>
      <p><strong>Date:</strong> ${report.createdAt.split('T')[0]}</p>
      <p><strong>Diagnosis:</strong> ${report.diagnosis || 'N/A'}</p>
      <p><strong>Treatment:</strong> ${report.treatment || 'N/A'}</p>
      <p><strong>Medications:</strong> ${report.medications || 'None'}</p>
      <p><strong>Vaccinations:</strong> ${report.vaccinations || 'None'}</p>
      <p><strong>Recommendations:</strong> ${report.recommendations || 'None'}</p>
    `;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><body>' + printContent + '</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-5">
        <p className="text-gray-500">Loading your reports...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-5 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-5 text-gray-800">My Veterinary Reports</h2>

        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search by pet name or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredReports.length > 0 ? (
          <>
            <div className="grid gap-6">
              {currentReports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800">
                        {report.petName} ({report.petType})
                      </h3>
                      <p className="text-gray-600">
                        <span className="font-medium">Diagnosis:</span> {report.diagnosis || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Date:</span> {report.createdAt.split('T')[0]}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Veterinarian:</span> {report.veterinarianId?.name || "N/A"}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4 flex space-x-3">
                      <button
                        onClick={() => toggleReportDetails(report._id)}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition flex items-center"
                      >
                        <FileText className="mr-2" size={16} /> 
                        {expandedReportId === report._id ? "Hide Report" : "View Report"}
                      </button>
                      <button
                        onClick={() => downloadReportAsPDF(report)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center"
                      >
                        <Download className="mr-2" size={16} /> Download
                      </button>
                      <button
                        onClick={() => printReport(report)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center"
                      >
                        <Printer className="mr-2" size={16} /> Print
                      </button>
                    </div>
                  </div>

                  {expandedReportId === report._id && (
                    <div className="mt-4 border-t pt-4 text-gray-600">
                      <p><span className="font-medium">Treatment:</span> {report.treatment || "N/A"}</p>
                      <p><span className="font-medium">Medications:</span> {report.medications || "None"}</p>
                      <p><span className="font-medium">Vaccinations:</span> {report.vaccinations || "None"}</p>
                      <p><span className="font-medium">Recommendations:</span> {report.recommendations || "None"}</p>
                      <p><span className="font-medium">Follow-up Date:</span> {report.followUpDate || "N/A"}</p>
                      <p><span className="font-medium">Weight:</span> {report.weight || "N/A"} kg</p>
                      <p><span className="font-medium">Temperature:</span> {report.temperature || "N/A"} °C</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="mx-4 text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">No reports available for your pets.</p>
        )}
      </div>
    </div>
  );
};

export default MyReportCard;