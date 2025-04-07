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

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-green-50">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-pulse rounded-full bg-green-600"></div>
        <div className="h-4 w-4 animate-pulse rounded-full bg-green-600 animation-delay-200"></div>
        <div className="h-4 w-4 animate-pulse rounded-full bg-green-600 animation-delay-400"></div>
        <span className="text-lg font-medium text-green-800">Loading reports...</span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-green-50">
      <SideBarVeterinarian />
      <div className="flex-1 p-6">
        <div className="mb-6 rounded-lg bg-green-700 p-4 shadow-lg">
          <h2 className="text-2xl font-bold text-white">Veterinary Reports</h2>
          <p className="mt-1 text-green-100">View and manage your patient records</p>
        </div>
        
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-green-600" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border-2 border-green-200 rounded-lg bg-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
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
                  className="bg-white rounded-lg overflow-hidden shadow-md border-l-4 border-green-600 hover:shadow-lg transition duration-300"
                >
                  <div className="p-5 flex flex-col md:flex-row justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <h3 className="text-xl font-semibold text-green-800">
                          {report.petName} 
                          <span className="ml-2 text-sm font-normal text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            {report.petType}
                          </span>
                        </h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-x-4 gap-y-2 mt-3">
                        <p className="flex items-center text-green-700">
                          <span className="inline-block w-4 h-4 mr-2 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          </span>
                          <span className="font-medium">Diagnosis:</span> 
                          <span className="ml-1 text-gray-700">{report.diagnosis || 'N/A'}</span>
                        </p>
                        <p className="flex items-center text-green-700">
                          <span className="inline-block w-4 h-4 mr-2 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          </span>
                          <span className="font-medium">Date:</span> 
                          <span className="ml-1 text-gray-700">{report.createdAt.split('T')[0]}</span>
                        </p>
                        <p className="flex items-center text-green-700">
                          <span className="inline-block w-4 h-4 mr-2 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          </span>
                          <span className="font-medium">Owner:</span> 
                          <span className="ml-1 text-gray-700">{report.userId?.name || "N/A"}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex md:flex-col space-x-3 md:space-x-0 md:space-y-2">
                      <button
                        onClick={() => downloadReportAsPDF(report)}
                        className="bg-green-100 hover:bg-green-200 text-green-800 flex items-center justify-center px-4 py-2 rounded-lg transition shadow-sm"
                      >
                        <Download className="mr-2" size={16} /> Download
                      </button>
                      <button
                        onClick={() => printReport(report)}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center px-4 py-2 rounded-lg transition shadow-sm"
                      >
                        <Printer className="mr-2" size={16} /> Print
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex items-center rounded-lg bg-white shadow-md p-1">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${currentPage === 1 
                      ? 'text-green-300 cursor-not-allowed' 
                      : 'text-green-600 hover:bg-green-50'}`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="px-4 py-2 text-sm font-medium text-green-800 border-l border-r border-green-100">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages 
                      ? 'text-green-300 cursor-not-allowed' 
                      : 'text-green-600 hover:bg-green-50'}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-lg shadow-md">
            <FileText className="h-16 w-16 text-green-300 mb-4" />
            <p className="text-xl text-green-700 font-medium">No reports available yet</p>
            <p className="text-green-500 mt-2">Reports will appear here once created</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VeterinarianReports;