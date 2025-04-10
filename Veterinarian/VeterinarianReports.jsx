import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FileText, Download, Printer, Search, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { jsPDF } from 'jspdf';
import SideBarVeterinarian from "./SideBarVeterinarian/SideBarVeterinarian";
import axiosInstance from "../src/api/axios";

const VeterinarianReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingReportId, setEditingReportId] = useState(null);
  const [editForm, setEditForm] = useState({});
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

  const startEditing = (report) => {
    setEditingReportId(report._id);
    setEditForm({
      diagnosis: report.diagnosis || '',
      treatment: report.treatment || '',
      medications: report.medications || '',
      vaccinations: report.vaccinations || '',
      recommendations: report.recommendations || '',
      followUpDate: report.followUpDate || '',
      weight: report.weight || '',
      temperature: report.temperature || ''
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (reportId) => {
    try {
      const { data } = await axiosInstance.put(`/bookings/report/${reportId}`, editForm);
      setReports(reports.map(r => r._id === reportId ? data.report : r));
      setEditingReportId(null);
      toast.success('Report updated successfully');
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error(error.response?.data?.error || 'Failed to update report');
    }
  };

  const cancelEdit = () => {
    setEditingReportId(null);
    setEditForm({});
  };

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
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-pulse rounded-full bg-green-300 opacity-75"></div>
        <div className="h-4 w-4 animate-pulse rounded-full bg-green-300 opacity-75 delay-150"></div>
        <div className="h-4 w-4 animate-pulse rounded-full bg-green-300 opacity-75 delay-300"></div>
        <span className="text-sm font-medium text-green-700">Loading reports...</span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-green-50">
      <SideBarVeterinarian />
      <div className="flex-1 p-6">
        <div className="mb-8 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow p-6 border-l-4 border-green-300">
          <h2 className="text-2xl font-bold text-green-800">Veterinary Records</h2>
          <p className="mt-1 text-green-600">Access and manage comprehensive medical reports for your patients</p>
        </div>
        
        <div className="mb-8 relative">
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 border border-green-200 rounded-xl bg-white shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-300 focus:border-green-300 transition duration-200"
            placeholder="Search by pet name or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-green-400" />
          </div>
        </div>
        
        {reports.length > 0 ? (
          <>
            <div className="grid gap-4">
              {currentReports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white rounded-xl overflow-hidden shadow border border-green-100 hover:shadow-md transition duration-200"
                >
                  {editingReportId === report._id ? (
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-green-700 font-medium block mb-1 text-sm">Diagnosis</label>
                          <textarea
                            name="diagnosis"
                            value={editForm.diagnosis}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded-lg border-green-200 focus:ring-1 focus:ring-green-300 focus:border-green-300 text-sm"
                            rows="2"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-green-700 font-medium block mb-1 text-sm">Treatment</label>
                          <textarea
                            name="treatment"
                            value={editForm.treatment}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded-lg border-green-200 focus:ring-1 focus:ring-green-300 focus:border-green-300 text-sm"
                            rows="2"
                          />
                        </div>
                        <div>
                          <label className="text-green-700 font-medium block mb-1 text-sm">Medications</label>
                          <textarea
                            name="medications"
                            value={editForm.medications}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded-lg border-green-200 focus:ring-1 focus:ring-green-300 focus:border-green-300 text-sm"
                            rows="2"
                          />
                        </div>
                        <div>
                          <label className="text-green-700 font-medium block mb-1 text-sm">Vaccinations</label>
                          <textarea
                            name="vaccinations"
                            value={editForm.vaccinations}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded-lg border-green-200 focus:ring-1 focus:ring-green-300 focus:border-green-300 text-sm"
                            rows="2"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-green-700 font-medium block mb-1 text-sm">Recommendations</label>
                          <textarea
                            name="recommendations"
                            value={editForm.recommendations}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded-lg border-green-200 focus:ring-1 focus:ring-green-300 focus:border-green-300 text-sm"
                            rows="2"
                          />
                        </div>
                        <div>
                          <label className="text-green-700 font-medium block mb-1 text-sm">Follow-up Date</label>
                          <input
                            type="date"
                            name="followUpDate"
                            value={editForm.followUpDate}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded-lg border-green-200 focus:ring-1 focus:ring-green-300 focus:border-green-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-green-700 font-medium block mb-1 text-sm">Weight (kg)</label>
                          <input
                            type="text"
                            name="weight"
                            value={editForm.weight}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded-lg border-green-200 focus:ring-1 focus:ring-green-300 focus:border-green-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-green-700 font-medium block mb-1 text-sm">Temperature (°C)</label>
                          <input
                            type="text"
                            name="temperature"
                            value={editForm.temperature}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded-lg border-green-200 focus:ring-1 focus:ring-green-300 focus:border-green-300 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 space-x-3">
                        <button
                          onClick={() => saveEdit(report._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition shadow-sm text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 3-3 3 3"/><path d="M12 13V7"/></svg>
                            </div>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-medium text-green-800">
                              {report.petName}
                            </h3>
                            <div className="flex items-center mt-1">
                              <span className="text-sm font-normal text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                {report.petType}
                              </span>
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            </div>
                            <div className="ml-3">
                              <span className="text-sm font-medium text-green-700">Diagnosis:</span>
                              <p className="text-sm text-gray-800">{report.diagnosis || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            </div>
                            <div className="ml-3">
                              <span className="text-sm font-medium text-green-700">Date:</span>
                              <p className="text-sm text-gray-800">{report.createdAt.split('T')[0]}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            </div>
                            <div className="ml-3">
                              <span className="text-sm font-medium text-green-700">Owner:</span>
                              <p className="text-sm text-gray-800">{report.userId?.name || "N/A"}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            </div>
                            <div className="ml-3">
                              <span className="text-sm font-medium text-green-700">Treatment:</span>
                              <p className="text-sm text-gray-800">{report.treatment || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          onClick={() => downloadReportAsPDF(report)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200 flex items-center px-4 py-2 rounded-lg transition text-sm"
                        >
                          <Download className="mr-2" size={16} /> Download
                        </button>
                        <button
                          onClick={() => printReport(report)}
                          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg transition text-sm"
                        >
                          <Printer className="mr-2" size={16} /> Print
                        </button>
                        <button
                          onClick={() => startEditing(report)}
                          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center px-4 py-2 rounded-lg transition text-sm"
                        >
                          <Edit className="mr-2" size={16} /> Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="inline-flex items-center rounded-lg border border-green-200 bg-white shadow-sm">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 text-sm rounded-l-lg ${currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-green-600 hover:bg-green-50'}`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="px-4 py-2 text-sm font-medium text-green-700 border-l border-r border-green-200">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 text-sm rounded-r-lg ${
                      currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-green-600 hover:bg-green-50'}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl shadow-sm border border-green-100">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <FileText className="h-12 w-12 text-green-400" />
            </div>
            <p className="text-lg text-green-800 font-medium">No reports available yet</p>
            <p className="text-green-600 mt-2">Reports will appear here once created</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VeterinarianReports;