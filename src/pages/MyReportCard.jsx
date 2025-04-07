import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FileText, Download, Printer, Search, ChevronLeft, ChevronRight, Calendar, Thermometer, Weight, Clock, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import axiosInstance from "../api/axios";
import NavBar from "../component/Header/NavBar";
import Footer from "../component/Footer/Footer";

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
    <div className="min-h-screen bg-green-100">
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-green-800 font-medium">Loading your reports...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-green-100">
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
      
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-green-900 inline-block border-b-4 border-green-600 pb-2">
            Pet Health Records
          </h2>
          <p className="text-gray-600 mt-2">View and manage your pet's medical history</p>
        </div>

        <div className="mb-8 relative bg-white rounded-xl shadow-lg p-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-green-600" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-base"
            placeholder="Search by pet name or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredReports.length > 0 ? (
          <>
            <div className="grid gap-8">
              {currentReports.map((report) => (
                <div
                  key={report._id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                    expandedReportId === report._id ? "ring-4 ring-green-400 ring-opacity-50" : ""
                  }`}
                >
                  <div className="bg-gradient-to-r from-green-700 to-green-600 p-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                      {report.petName}
                    </h3>
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-sm">
                      {report.petType}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg">
                            <Calendar className="h-5 w-5 text-green-700" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium text-gray-800">{report.createdAt.split('T')[0]}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg">
                            <Weight className="h-5 w-5 text-green-700" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500">Diagnosis</p>
                            <p className="font-medium text-gray-800">{report.diagnosis || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg">
                            <Thermometer className="h-5 w-5 text-green-700" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500">Veterinarian</p>
                            <p className="font-medium text-gray-800">{report.veterinarianId?.name || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                        <button
                          onClick={() => toggleReportDetails(report._id)}
                          className={`${
                            expandedReportId === report._id 
                              ? "bg-green-700 text-white" 
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          } px-4 py-3 rounded-lg transition flex items-center justify-center font-medium`}
                        >
                          {expandedReportId === report._id ? (
                            <>
                              <X className="mr-2" size={18} /> Hide Details
                            </>
                          ) : (
                            <>
                              <FileText className="mr-2" size={18} /> View Details
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => downloadReportAsPDF(report)}
                          className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-4 py-3 rounded-lg transition flex items-center justify-center font-medium"
                        >
                          <Download className="mr-2" size={18} /> Download
                        </button>
                        
                        <button
                          onClick={() => printReport(report)}
                          className="bg-teal-100 text-teal-800 hover:bg-teal-200 px-4 py-3 rounded-lg transition flex items-center justify-center font-medium"
                        >
                          <Printer className="mr-2" size={18} /> Print
                        </button>
                      </div>
                    </div>

                    {expandedReportId === report._id && (
                      <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-100">
                        <h4 className="text-lg font-semibold text-green-800 mb-4">Detailed Report</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          <div className="space-y-1">
                            <p className="text-sm text-green-700">Treatment</p>
                            <p className="font-medium">{report.treatment || "N/A"}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-green-700">Medications</p>
                            <p className="font-medium">{report.medications || "None"}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-green-700">Vaccinations</p>
                            <p className="font-medium">{report.vaccinations || "None"}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-green-700">Follow-up Date</p>
                            <p className="font-medium">{report.followUpDate || "N/A"}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-green-700">Weight</p>
                            <p className="font-medium">{report.weight || "N/A"} kg</p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-green-700">Temperature</p>
                            <p className="font-medium">{report.temperature || "N/A"} °C</p>
                          </div>
                          
                          <div className="space-y-1 md:col-span-2">
                            <p className="text-sm text-green-700">Recommendations</p>
                            <p className="font-medium">{report.recommendations || "None"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="inline-flex bg-white shadow-md rounded-lg overflow-hidden">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center px-4 py-2 ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-700 hover:bg-green-50"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <div className="px-4 py-2 bg-green-100 text-green-800 font-medium">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center px-4 py-2 ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-700 hover:bg-green-50"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-10 rounded-xl shadow-lg text-center">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <FileText className="h-10 w-10 text-green-700" />
            </div>
            <p className="text-xl text-gray-600">No reports available for your pets.</p>
            <p className="text-gray-500 mt-2">Reports will appear here after your vet visits.</p>
          </div>
        )}
      </div>
       <Footer />
    </div>
  );
};

export default MyReportCard;