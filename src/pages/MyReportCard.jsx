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
    
    // Set font styles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 100, 150); // Blue header color
    
    // Add title
    doc.text(`Veterinary Report for ${report.petName}`, 15, 15);
    
    // Add horizontal line
    doc.setDrawColor(0, 100, 150);
    doc.line(15, 17, 195, 17);
    
    // Reset to normal text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Patient and appointment information section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 150);
    doc.text("Patient Information", 15, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Pet Name: ${report.petName}`, 15, 35);
    doc.text(`Pet Type: ${report.petType || 'N/A'}`, 15, 45);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 150);
    doc.text("Appointment Details", 110, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${report.createdAt.split('T')[0]}`, 110, 35);
    doc.text(`Veterinarian: ${report.veterinarianId?.name || 'N/A'}`, 110, 45);
    
    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 55, 195, 55);
    
    // Medical details section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 150);
    doc.text("Medical Report", 15, 65);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Weight: ${report.weight || 'N/A'} kg`, 15, 75);
    doc.text(`Temperature: ${report.temperature || 'N/A'} °C`, 15, 85);
    doc.text(`Follow-up Date: ${report.followUpDate || 'None scheduled'}`, 15, 95);
    
    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 105, 195, 105);
    
    // Diagnostic section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 150);
    doc.text("Diagnosis", 15, 115);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Handle multiline text for diagnosis
    const diagnosisLines = doc.splitTextToSize(report.diagnosis || 'N/A', 180);
    doc.text(diagnosisLines, 15, 125);
    
    // Calculate next y position based on number of diagnosis lines
    let yPos = 125 + (diagnosisLines.length * 7);
    
    // Treatment section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 150);
    doc.text("Treatment", 15, yPos + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Handle multiline text for treatment
    const treatmentLines = doc.splitTextToSize(report.treatment || 'N/A', 180);
    doc.text(treatmentLines, 15, yPos + 20);
    
    // Update y position
    yPos = yPos + 20 + (treatmentLines.length * 7);
    
    // Medications section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 150);
    doc.text("Medications", 15, yPos + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(report.medications || 'None prescribed', 15, yPos + 20);
    
    // Vaccinations section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 150);
    doc.text("Vaccinations", 110, yPos + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(report.vaccinations || 'None administered', 110, yPos + 20);
    
    // Update y position
    yPos = yPos + 30;
    
    // Recommendations section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 150);
    doc.text("Recommendations", 15, yPos + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Handle multiline text for recommendations
    const recommendationsLines = doc.splitTextToSize(
      report.recommendations || 'No specific recommendations provided', 
      180
    );
    doc.text(recommendationsLines, 15, yPos + 20);
    
    // Add footer
    yPos = 270;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, 195, yPos);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report created on: ${report.createdAt.split('T')[0]}`, 15, yPos + 10);
    
    // Save the PDF
    doc.save(`${report.petName}_Report.pdf`);
  };

  const printReport = (report) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    // Generate styled HTML content that matches the view format
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Veterinary Report for ${report.petName}</title>
        <style>
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #047857;
          }
          .header h1 {
            color: #047857;
            margin-bottom: 5px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            color: #047857;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: bold;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .stat-box {
            background-color: #f0fdf4;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
          }
          .stat-box p {
            margin: 0;
          }
          .stat-label {
            color: #059669;
            font-size: 0.9em;
          }
          .stat-value {
            font-size: 1.2em;
            font-weight: bold;
          }
          .data-box {
            background-color: #f0fdf4;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 15px;
            border: 1px solid #d1fae5;
          }
          .data-title {
            font-weight: bold;
            color: #047857;
            margin-bottom: 5px;
          }
          .grid-2col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #777;
            text-align: center;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            @page {
              margin: 1.5cm;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Veterinary Report</h1>
          <p>Report ID: ${report._id}</p>
        </div>
        
        <div class="grid">
          <div class="section">
            <h2 class="section-title">Patient Information</h2>
            <p><strong>Pet Name:</strong> ${report.petName}</p>
            <p><strong>Pet Type:</strong> ${report.petType || 'N/A'}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">Appointment Details</h2>
            <p><strong>Date:</strong> ${report.createdAt.split('T')[0]}</p>
            <p><strong>Veterinarian:</strong> ${report.veterinarianId?.name || 'N/A'}</p>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">Medical Report</h2>
          
          <div class="grid grid-3col">
            <div class="stat-box">
              <p class="stat-label">Weight</p>
              <p class="stat-value">${report.weight || 'N/A'} kg</p>
            </div>
            <div class="stat-box">
              <p class="stat-label">Temperature</p>
              <p class="stat-value">${report.temperature || 'N/A'} °C</p>
            </div>
            <div class="stat-box">
              <p class="stat-label">Follow-up Date</p>
              <p class="stat-value">${report.followUpDate || 'None'}</p>
            </div>
          </div>
          
          <div class="section">
            <div class="data-title">Diagnosis</div>
            <div class="data-box">${report.diagnosis || 'N/A'}</div>
            
            <div class="data-title">Treatment</div>
            <div class="data-box">${report.treatment || 'N/A'}</div>
            
            <div class="grid-2col">
              <div>
                <div class="data-title">Medications</div>
                <div class="data-box">${report.medications || 'None'}</div>
              </div>
              <div>
                <div class="data-title">Vaccinations</div>
                <div class="data-box">${report.vaccinations || 'None'}</div>
              </div>
            </div>
            
            <div class="data-title">Recommendations</div>
            <div class="data-box">${report.recommendations || 'None'}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Report created on: ${report.createdAt.split('T')[0]}</p>
        </div>
        
        <script>
          // Auto print once loaded
          window.onload = function() {
            window.print();
            // Don't close immediately to allow cancellation
            setTimeout(function() {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;
    
    // Write to the new window and trigger print
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (loading) return (
    <div className="min-h-screen bg-green-50">
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-green-700 font-medium">Loading your reports...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
      
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <span className="inline-block bg-green-600 h-1 w-16 mb-4"></span>
          <h2 className="text-4xl font-extrabold text-green-900 tracking-tight">
            Pet Health Records
          </h2>
          <p className="text-green-600 mt-2 font-medium">Your complete pet medical history dashboard</p>
        </div>

        <div className="mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-green-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-full bg-white border-2 border-green-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base shadow-sm"
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
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.01] ${
                    expandedReportId === report._id ? "ring-4 ring-green-400 ring-opacity-50" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-700 p-5">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-white">
                          {report.petName}
                        </h3>
                        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm font-medium">
                          {report.petType}
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 left-6 w-8 h-8 bg-white rounded-full shadow-md"></div>
                    <div className="absolute -bottom-4 left-10 w-8 h-8 bg-white rounded-full shadow-md"></div>
                  </div>
                  
                  <div className="p-6 pt-8">
                    <div className="flex flex-col lg:flex-row justify-between">
                      <div className="space-y-5 flex-1">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 p-2.5 rounded-xl">
                            <Calendar className="h-5 w-5 text-green-700" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-green-500">Date</p>
                            <p className="font-semibold text-gray-800">{report.createdAt.split('T')[0]}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 p-2.5 rounded-xl">
                            <Weight className="h-5 w-5 text-green-700" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-green-500">Diagnosis</p>
                            <p className="font-semibold text-gray-800">{report.diagnosis || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 p-2.5 rounded-xl">
                            <Thermometer className="h-5 w-5 text-green-700" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-green-500">Veterinarian</p>
                            <p className="font-semibold text-gray-800">{report.veterinarianId?.name || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                        <button
                          onClick={() => toggleReportDetails(report._id)}
                          className={`${
                            expandedReportId === report._id 
                              ? "bg-green-700 text-white shadow-lg" 
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          } px-5 py-3 rounded-xl transition-all duration-200 flex items-center justify-center font-medium`}
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
                          className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-5 py-3 rounded-xl transition-all duration-200 flex items-center justify-center font-medium"
                        >
                          <Download className="mr-2" size={18} /> Download
                        </button>
                        
                        <button
                          onClick={() => printReport(report)}
                          className="bg-teal-100 text-teal-800 hover:bg-teal-200 px-5 py-3 rounded-xl transition-all duration-200 flex items-center justify-center font-medium"
                        >
                          <Printer className="mr-2" size={18} /> Print
                        </button>
                      </div>
                    </div>

                    {expandedReportId === report._id && (
                      <div className="mt-8 p-6 bg-gradient-to-b from-green-50 to-white rounded-xl border border-green-100 shadow-inner">
                        <h4 className="text-lg font-bold text-green-900 mb-5 flex items-center">
                          <span className="inline-block w-2 h-8 bg-green-600 rounded-full mr-3"></span>
                          Detailed Report
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-green-600">Treatment</p>
                            <p className="font-medium text-gray-800 bg-white p-3 rounded-lg border border-green-100">{report.treatment || "N/A"}</p>
                          </div>
                          
                          <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-green-600">Medications</p>
                            <p className="font-medium text-gray-800 bg-white p-3 rounded-lg border border-green-100">{report.medications || "None"}</p>
                          </div>
                          
                          <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-green-600">Vaccinations</p>
                            <p className="font-medium text-gray-800 bg-white p-3 rounded-lg border border-green-100">{report.vaccinations || "None"}</p>
                          </div>
                          
                          <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-green-600">Follow-up Date</p>
                            <p className="font-medium text-gray-800 bg-white p-3 rounded-lg border border-green-100">{report.followUpDate || "N/A"}</p>
                          </div>
                          
                          <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-green-600">Weight</p>
                            <p className="font-medium text-gray-800 bg-white p-3 rounded-lg border border-green-100">{report.weight || "N/A"} kg</p>
                          </div>
                          
                          <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-green-600">Temperature</p>
                            <p className="font-medium text-gray-800 bg-white p-3 rounded-lg border border-green-100">{report.temperature || "N/A"} °C</p>
                          </div>
                          
                          <div className="space-y-1.5 md:col-span-2">
                            <p className="text-sm font-semibold text-green-600">Recommendations</p>
                            <p className="font-medium text-gray-800 bg-white p-3 rounded-lg border border-green-100">{report.recommendations || "None"}</p>
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
                <div className="inline-flex bg-white shadow-lg rounded-full overflow-hidden">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center px-5 py-3 ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-700 hover:bg-green-50"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <div className="px-5 py-3 bg-green-600 text-white font-medium">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center px-5 py-3 ${
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
          <div className="bg-white p-12 rounded-2xl shadow-xl text-center">
            <div className="inline-block p-6 bg-green-100 rounded-full mb-5">
              <FileText className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900 mb-2">No reports available for your pets</p>
            <p className="text-green-600 mt-2">Reports will appear here after your vet visits</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyReportCard;