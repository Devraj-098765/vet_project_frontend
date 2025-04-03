import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Dog, Stethoscope, FileText, Download, Printer, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import NavBar from "../Header/Navbar";

const ViewVeterinaryReports = () => {
  // Sample reports data (in a real app, this would come from an API)
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentReport, setCurrentReport] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  useEffect(() => {
    // Simulate loading data from an API
    setTimeout(() => {
      const sampleReports = [
        {
          id: 'VR001',
          bookingId: '12345',
          petName: 'Buddy',
          petType: 'Dog',
          ownerName: 'John Doe',
          phone: '123-456-7890',
          date: '2025-04-15',
          time: '10:00 AM',
          service: 'Check-up',
          veterinarianName: 'Dr. Emily Smith',
          diagnosis: 'Seasonal allergies causing skin irritation',
          treatment: 'Prescribed antihistamines and medicated shampoo for weekly baths',
          recommendations: 'Keep indoors during high pollen days, consider air purifier',
          followUpDate: '2025-05-15',
          weight: '24.5',
          temperature: '38.2',
          vaccinations: 'Rabies booster given',
          medications: 'Apoquel 16mg - 1 tablet daily for 14 days',
          createdAt: '2025-04-15'
        },
        {
          id: 'VR002',
          bookingId: '12346',
          petName: 'Luna',
          petType: 'Cat',
          ownerName: 'Sarah Johnson',
          phone: '555-123-4567',
          date: '2025-04-14',
          time: '2:30 PM',
          service: 'Dental Cleaning',
          veterinarianName: 'Dr. Michael Rodriguez',
          diagnosis: 'Mild gingivitis and tartar build-up',
          treatment: 'Full dental cleaning performed under anesthesia. Two small extractions of damaged teeth.',
          recommendations: 'Daily dental treats and weekly tooth brushing',
          followUpDate: '2025-07-14',
          weight: '4.8',
          temperature: '38.5',
          vaccinations: 'FVRCP up to date',
          medications: 'Amoxicillin 50mg - 1 capsule twice daily for 7 days',
          createdAt: '2025-04-14'
        },
        {
          id: 'VR003',
          bookingId: '12347',
          petName: 'Max',
          petType: 'Dog',
          ownerName: 'David Williams',
          phone: '444-555-6666',
          date: '2025-04-12',
          time: '11:15 AM',
          service: 'Vaccination',
          veterinarianName: 'Dr. Emily Smith',
          diagnosis: 'Healthy annual check-up',
          treatment: 'Administered DHPP booster and Bordetella vaccine',
          recommendations: 'Continue current diet and exercise regimen',
          followUpDate: '2026-04-12',
          weight: '32.1',
          temperature: '38.3',
          vaccinations: 'DHPP booster, Bordetella',
          medications: 'None prescribed',
          createdAt: '2025-04-12'
        },
        {
          id: 'VR004',
          bookingId: '12348',
          petName: 'Bella',
          petType: 'Dog',
          ownerName: 'John Doe',
          phone: '123-456-7890',
          date: '2025-04-02',
          time: '3:45 PM',
          service: 'Skin Condition',
          veterinarianName: 'Dr. Lisa Wong',
          diagnosis: 'Hotspot on left hind leg, likely due to excessive licking',
          treatment: 'Area cleaned and treated. Cone of shame provided to prevent further irritation.',
          recommendations: 'Monitor for signs of spreading. Keep the area dry.',
          followUpDate: '2025-04-09',
          weight: '18.7',
          temperature: '38.6',
          vaccinations: 'All up to date',
          medications: 'Antibiotics and anti-inflammatory medication for 7 days',
          createdAt: '2025-04-02'
        },
        {
          id: 'VR005',
          bookingId: '12349',
          petName: 'Oliver',
          petType: 'Cat',
          ownerName: 'Emma Brown',
          phone: '777-888-9999',
          date: '2025-03-28',
          time: '9:30 AM',
          service: 'Annual Exam',
          veterinarianName: 'Dr. Michael Rodriguez',
          diagnosis: 'Slightly overweight but otherwise healthy',
          treatment: 'No immediate treatment needed',
          recommendations: 'Gradual diet change to weight management food. Increase play time.',
          followUpDate: '2025-06-28',
          weight: '6.8',
          temperature: '38.1',
          vaccinations: 'Rabies and FVRCP updated',
          medications: 'None prescribed',
          createdAt: '2025-03-28'
        },
        {
          id: 'VR006',
          bookingId: '12350',
          petName: 'Buddy',
          petType: 'Dog',
          ownerName: 'John Doe',
          phone: '123-456-7890',
          date: '2025-03-15',
          time: '1:15 PM',
          service: 'Ear Infection',
          veterinarianName: 'Dr. Emily Smith',
          diagnosis: 'Bacterial infection in both ears',
          treatment: 'Ears cleaned thoroughly. Showed owner proper cleaning technique.',
          recommendations: 'Weekly ear cleaning to prevent future infections',
          followUpDate: '2025-03-29',
          weight: '24.3',
          temperature: '38.7',
          vaccinations: 'All up to date',
          medications: 'Ear drops twice daily for 14 days',
          createdAt: '2025-03-15'
        }
      ];

      setReports(sampleReports);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter reports based on search term
  const filteredReports = reports.filter(report => 
    report.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.veterinarianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current reports for pagination
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
    // In a real application, this would use jsPDF or similar library
    // For this frontend-only version, we'll just show an alert
    alert(`Report for ${currentReport.petName} is being downloaded as PDF`);
  };

  const printReport = () => {
    // For demonstration purposes
    alert(`Preparing to print report for ${currentReport.petName}`);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <UserNavbar />

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen p-6 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">Your Veterinary Reports</h1>
          
          {/* Search bar */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by pet name, service, veterinarian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <p className="text-lg text-gray-600">You don't have any veterinary reports yet.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {currentReports.map((report) => (
                  <div key={report.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                    <div className="md:flex md:justify-between md:items-center">
                      <div className="md:flex md:items-center md:space-x-4">
                        <div className="mb-2 md:mb-0">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            {report.service}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 md:mb-0 flex items-center">
                          <Dog className="h-5 w-5 mr-2 text-blue-600" />
                          {report.petName}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {report.date}
                        </div>
                        <button
                          onClick={() => viewReport(report)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Report
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p className="line-clamp-1"><strong>Diagnosis:</strong> {report.diagnosis}</p>
                      <p className="mt-1 flex items-center">
                        <Stethoscope className="h-4 w-4 mr-1 text-gray-500" />
                        <strong>Dr:</strong> {report.veterinarianName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
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
                    <span className="mx-4 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
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
          )}
        </div>

        {/* Detailed Report Modal */}
        {showReportDetails && currentReport && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-90vh overflow-y-auto">
              <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Veterinary Report #{currentReport.id}</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={downloadReportAsPDF}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md"
                    title="Download PDF"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={printReport}
                    className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-md"
                    title="Print Report"
                  >
                    <Printer className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={closeReportDetails}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Header Information */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-1">Patient Information</h3>
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <Dog className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="font-medium">Pet Name:</span>
                        <span className="ml-2">{currentReport.petName}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium ml-7">Pet Type:</span>
                        <span className="ml-2">{currentReport.petType}</span>
                      </p>
                      <p className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="font-medium">Owner:</span>
                        <span className="ml-2">{currentReport.ownerName}</span>
                      </p>
                      <p className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="font-medium">Contact:</span>
                        <span className="ml-2">{currentReport.phone}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-1">Appointment Details</h3>
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="font-medium">Date:</span>
                        <span className="ml-2">{currentReport.date}</span>
                      </p>
                      <p className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="font-medium">Time:</span>
                        <span className="ml-2">{currentReport.time}</span>
                      </p>
                      <p className="flex items-center">
                        <Stethoscope className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="font-medium">Service:</span>
                        <span className="ml-2">{currentReport.service}</span>
                      </p>
                      <p className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="font-medium">Veterinarian:</span>
                        <span className="ml-2">{currentReport.veterinarianName}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-1">Medical Report</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Weight</p>
                      <p className="text-lg font-semibold">{currentReport.weight} kg</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Temperature</p>
                      <p className="text-lg font-semibold">{currentReport.temperature} °C</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Follow-up Date</p>
                      <p className="text-lg font-semibold">{currentReport.followUpDate || 'None scheduled'}</p>
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

                {/* Footer */}
                <div className="mt-8 pt-4 border-t text-sm text-gray-500 flex justify-between items-center">
                  <p>Report created on: {currentReport.createdAt}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={downloadReportAsPDF}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </button>
                    <button
                      onClick={printReport}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </button>
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