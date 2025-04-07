import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FileText, Download, Printer, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import SideBarVeterinarian from "./SideBarVeterinarian/SideBarVeterinarian";
import axiosInstance from "../src/api/axios";

const VeterinarianReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log("Fetching veterinarian reports with token:", localStorage.getItem("vetapp-token"));
        const { data } = await axiosInstance.get("/bookings/veterinarian/reports");
        console.log("Reports data:", data);
        setReports(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error.response?.status, error.response?.data, error.message);
        setLoading(false);
        toast.error("Failed to load reports");
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

  if (loading) return <p className="p-5 text-gray-500">Loading reports...</p>;

  return (
    <div className="flex">
      <SideBarVeterinarian />
      <div className="p-5 flex-1">
        <h2 className="text-2xl font-semibold mb-5">Veterinarian Reports</h2>
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
        {reports.length > 0 ? (
          <>
            <div className="grid gap-6">
              {currentReports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
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
                      <span className="font-medium">Owner:</span> {report.userId?.name || "N/A"}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 flex space-x-3">
                    <button
                      onClick={() => downloadReportAsPDF(report)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      <Download className="inline mr-2" size={16} /> Download
                    </button>
                    <button
                      onClick={() => printReport(report)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      <Printer className="inline mr-2" size={16} /> Print
                    </button>
                  </div>
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
          <p className="text-gray-500">No reports available.</p>
        )}
      </div>
    </div>
  );
};

export default VeterinarianReports;