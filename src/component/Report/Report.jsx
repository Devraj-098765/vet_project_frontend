import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Dog, Stethoscope, FileText, Download, Printer, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import NavBar from "../Header/NavBar";
import { jsPDF } from 'jspdf';
import axiosInstance from '../../api/axios';

const ViewVeterinaryReports = () => {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axiosInstance.get('/bookings/reports');
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setReports([]);
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

  const viewReport = (report) => {
    setCurrentReport(report);
    setShowReportDetails(true);
  };

  const closeReportDetails = () => {
    setShowReportDetails(false);
  };

  const downloadReportAsPDF = () => {
    const doc = new jsPDF();
    
    // Set font styles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 100, 150); // Blue header color
    
    // Add title
    doc.text(`Veterinary Report for ${currentReport.petName}`, 15, 15);
    
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
    doc.text(`Pet Name: ${currentReport.petName}`, 15, 35);
    doc.text(`Pet Type: ${currentReport.petType || 'N/A'}`, 15, 45);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 150);
    doc.text("Appointment Details", 110, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${currentReport.createdAt.split('T')[0]}`, 110, 35);
    doc.text(`Veterinarian: ${currentReport.veterinarianId.name}`, 110, 45);
    
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
    doc.text(`Weight: ${currentReport.weight || 'N/A'} kg`, 15, 75);
    doc.text(`Temperature: ${currentReport.temperature || 'N/A'} °C`, 15, 85);
    doc.text(`Follow-up Date: ${currentReport.followUpDate || 'None scheduled'}`, 15, 95);
    
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
    const diagnosisLines = doc.splitTextToSize(currentReport.diagnosis, 180);
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
    const treatmentLines = doc.splitTextToSize(currentReport.treatment, 180);
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
    doc.text(currentReport.medications || 'None prescribed', 15, yPos + 20);
    
    // Vaccinations section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 150);
    doc.text("Vaccinations", 110, yPos + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(currentReport.vaccinations || 'None administered', 110, yPos + 20);
    
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
      currentReport.recommendations || 'No specific recommendations provided', 
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
    doc.text(`Report created on: ${currentReport.createdAt.split('T')[0]}`, 15, yPos + 10);
    
    // Save the PDF
    doc.save(`${currentReport.petName}_Report.pdf`);
  };

  const printReport = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    // Generate styled HTML content that matches the view format
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Veterinary Report for ${currentReport.petName}</title>
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
            border-bottom: 2px solid #1a73e8;
          }
          .header h1 {
            color: #1a73e8;
            margin-bottom: 5px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            color: #1a73e8;
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
            background-color: #f5f7fa;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
          }
          .stat-box p {
            margin: 0;
          }
          .stat-label {
            color: #777;
            font-size: 0.9em;
          }
          .stat-value {
            font-size: 1.2em;
            font-weight: bold;
          }
          .data-box {
            background-color: #e6f2ff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 15px;
          }
          .data-title {
            font-weight: bold;
            color: #1a73e8;
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
          <p>Report ID: ${currentReport._id}</p>
        </div>
        
        <div class="grid">
          <div class="section">
            <h2 class="section-title">Patient Information</h2>
            <p><strong>Pet Name:</strong> ${currentReport.petName}</p>
            <p><strong>Pet Type:</strong> ${currentReport.petType || 'N/A'}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">Appointment Details</h2>
            <p><strong>Date:</strong> ${currentReport.createdAt.split('T')[0]}</p>
            <p><strong>Veterinarian:</strong> ${currentReport.veterinarianId.name}</p>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">Medical Report</h2>
          
          <div class="grid grid-3col">
            <div class="stat-box">
              <p class="stat-label">Weight</p>
              <p class="stat-value">${currentReport.weight || 'N/A'} kg</p>
            </div>
            <div class="stat-box">
              <p class="stat-label">Temperature</p>
              <p class="stat-value">${currentReport.temperature || 'N/A'} °C</p>
            </div>
            <div class="stat-box">
              <p class="stat-label">Follow-up Date</p>
              <p class="stat-value">${currentReport.followUpDate || 'None'}</p>
            </div>
          </div>
          
          <div class="section">
            <div class="data-title">Diagnosis</div>
            <div class="data-box">${currentReport.diagnosis}</div>
            
            <div class="data-title">Treatment</div>
            <div class="data-box">${currentReport.treatment}</div>
            
            <div class="grid-2col">
              <div>
                <div class="data-title">Medications</div>
                <div class="data-box">${currentReport.medications || 'None'}</div>
              </div>
              <div>
                <div class="data-title">Vaccinations</div>
                <div class="data-box">${currentReport.vaccinations || 'None'}</div>
              </div>
            </div>
            
            <div class="data-title">Recommendations</div>
            <div class="data-box">${currentReport.recommendations || 'None'}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Report created on: ${currentReport.createdAt.split('T')[0]}</p>
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

  return (
    <div className="min-h-screen bg-green-100">
      <div className="flex justify-center items-center"><NavBar /></div>
      <div className="bg-gray-50 min-h-screen p-6 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">Your Veterinary Reports</h1>
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search by pet name or diagnosis..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {reports.length === 0 ? (
            <div className="bg-white shadow-lg rounded-lg p-6 text-center"><p className="text-lg text-gray-600">You don't have any veterinary reports yet.</p></div>
          ) : (
            <>
              <div className="grid gap-4">
                {currentReports.map((report) => (
                  <div key={report._id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                    <div className="md:flex md:justify-between md:items-center">
                      <div className="md:flex md:items-center md:space-x-4">
                        <h3 className="text-xl font-semibold mb-2 md:mb-0 flex items-center"><Dog className="h-5 w-5 mr-2 text-blue-600" /> {report.petName}</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500 flex items-center"><Calendar className="h-4 w-4 mr-1" /> {report.createdAt.split('T')[0]}</div>
                        <button onClick={() => viewReport(report)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"><FileText className="h-4 w-4 mr-1" /> View Report</button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p className="line-clamp-1"><strong>Diagnosis:</strong> {report.diagnosis}</p>
                      <p className="mt-1 flex items-center"><Stethoscope className="h-4 w-4 mr-1 text-gray-500" /> <strong>Dr:</strong> {report.veterinarianId.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center">
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}><ChevronLeft className="h-5 w-5" /></button>
                    <span className="mx-4 text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}><ChevronRight className="h-5 w-5" /></button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>

        {showReportDetails && currentReport && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-90vh overflow-y-auto">
              <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Veterinary Report #{currentReport._id}</h2>
                <div className="flex space-x-2">
                  <button onClick={downloadReportAsPDF} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md" title="Download PDF"><Download className="h-5 w-5" /></button>
                  <button onClick={printReport} className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-md" title="Print Report"><Printer className="h-5 w-5" /></button>
                  <button onClick={closeReportDetails} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md">✕</button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-1">Patient Information</h3>
                    <div className="space-y-2">
                      <p className="flex items-center"><Dog className="h-5 w-5 mr-2 text-blue-600" /> <span className="font-medium">Pet Name:</span> <span className="ml-2">{currentReport.petName}</span></p>
                      <p className="flex items-center"><span className="font-medium ml-7">Pet Type:</span> <span className="ml-2">{currentReport.petType}</span></p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-1">Appointment Details</h3>
                    <div className="space-y-2">
                      <p className="flex items-center"><Calendar className="h-5 w-5 mr-2 text-blue-600" /> <span className="font-medium">Date:</span> <span className="ml-2">{currentReport.createdAt.split('T')[0]}</span></p>
                      <p className="flex items-center"><User className="h-5 w-5 mr-2 text-blue-600" /> <span className="font-medium">Veterinarian:</span> <span className="ml-2">{currentReport.veterinarianId.name}</span></p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-1">Medical Report</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm font-medium text-gray-500">Weight</p><p className="text-lg font-semibold">{currentReport.weight || 'N/A'} kg</p></div>
                    <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm font-medium text-gray-500">Temperature</p><p className="text-lg font-semibold">{currentReport.temperature || 'N/A'} °C</p></div>
                    <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm font-medium text-gray-500">Follow-up Date</p><p className="text-lg font-semibold">{currentReport.followUpDate || 'None'}</p></div>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div><h4 className="font-semibold text-blue-700">Diagnosis</h4><p className="mt-1 bg-blue-50 p-3 rounded-lg">{currentReport.diagnosis}</p></div>
                    <div><h4 className="font-semibold text-blue-700">Treatment</h4><p className="mt-1 bg-blue-50 p-3 rounded-lg">{currentReport.treatment}</p></div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><h4 className="font-semibold text-blue-700">Medications</h4><p className="mt-1 bg-blue-50 p-3 rounded-lg min-h-16">{currentReport.medications || 'None'}</p></div>
                      <div><h4 className="font-semibold text-blue-700">Vaccinations</h4><p className="mt-1 bg-blue-50 p-3 rounded-lg min-h-16">{currentReport.vaccinations || 'None'}</p></div>
                    </div>
                    <div><h4 className="font-semibold text-blue-700">Recommendations</h4><p className="mt-1 bg-blue-50 p-3 rounded-lg">{currentReport.recommendations || 'None'}</p></div>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t text-sm text-gray-500 flex justify-between items-center">
                  <p>Report created on: {currentReport.createdAt.split('T')[0]}</p>
                  <div className="flex space-x-2">
                    <button onClick={downloadReportAsPDF} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center"><Download className="h-4 w-4 mr-1" /> Download PDF</button>
                    <button onClick={printReport} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center"><Printer className="h-4 w-4 mr-1" /> Print</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewVeterinaryReports;