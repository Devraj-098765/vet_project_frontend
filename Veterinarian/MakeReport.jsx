import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Dog, Stethoscope, CheckCircle2, FileText, X, ClipboardList, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import SideBarVeterinarian from './SideBarVeterinarian/SideBarVeterinarian.jsx';
import axiosInstance from '../src/api/axios.js';

const MakeReport = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    diagnosis: '',
    treatment: '',
    recommendations: '',
    followUpDate: '',
    weight: '',
    temperature: '',
    vaccinations: '',
    medications: ''
  });
  const [showReportForm, setShowReportForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        console.log('Fetching booking with ID:', bookingId);
        const { data } = await axiosInstance.get(`/bookings/${bookingId}`);
        console.log('Booking data:', data);
        setBooking(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking:', error.response?.status, error.response?.data, error.message);
        setBooking(null);
        setLoading(false);
        toast.error("Failed to load booking details");
      }
    };
    if (bookingId) fetchBooking();
    else {
      console.error('No bookingId provided');
      toast.error("No booking ID provided");
      setLoading(false);
    }
  }, [bookingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!reportData.diagnosis.trim()) errors.diagnosis = 'Diagnosis is required';
    if (!reportData.treatment.trim()) errors.treatment = 'Treatment details are required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { data } = await axiosInstance.post(`/bookings/${bookingId}/report`, reportData);
      console.log('Report Submitted:', data);
      setSubmitted(true);
      toast.success("Report submitted successfully!");
      setTimeout(() => {
        setSubmitted(false);
        setShowReportForm(false);
        setReportData({
          diagnosis: '',
          treatment: '',
          recommendations: '',
          followUpDate: '',
          weight: '',
          temperature: '',
          vaccinations: '',
          medications: ''
        });
        navigate('/Totalappointment');
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error.response?.status, error.response?.data, error.message);
      toast.error("Failed to submit report");
    }
  };

  const handleClose = () => {
    const hasContent = Object.values(reportData).some(value => value.trim() !== '');
    if (hasContent && !submitted) {
      const confirmClose = window.confirm("Unsaved changes will be lost. Are you sure you want to close?");
      if (!confirmClose) return;
    }
    setShowReportForm(false);
    setReportData({
      diagnosis: '',
      treatment: '',
      recommendations: '',
      followUpDate: '',
      weight: '',
      temperature: '',
      vaccinations: '',
      medications: ''
    });
    setValidationErrors({});
  };

  if (loading) {
    return (
      <div className="flex">
        <SideBarVeterinarian />
        <div className="bg-gray-50 min-h-screen p-6 flex-1">
          <p className="text-gray-500">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex">
        <SideBarVeterinarian />
        <div className="bg-gray-50 min-h-screen p-6 flex-1">
          <p className="text-red-500">Booking not found or failed to load.</p>
          <button
            onClick={() => navigate('/Totalappointment')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideBarVeterinarian />
      <div className="bg-gray-50 min-h-screen p-6 flex-1">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
          <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
            <h2 className="text-3xl font-bold flex items-center">
              <ClipboardList className="mr-3" size={32} />
              Veterinary Consultation Report
            </h2>
            <div className="text-sm font-semibold bg-green-500 px-3 py-1 rounded-full">
              {booking.status}
            </div>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">Patient Details</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="mr-3 text-blue-600" />
                  <span className="font-semibold">Owner:</span>
                  <span className="ml-2">{booking.userId?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <Dog className="mr-3 text-blue-600" />
                  <span className="font-semibold">Pet Name:</span>
                  <span className="ml-2">{booking.petName}</span>
                </div>
                <div className="flex items-center">
                  <Stethoscope className="mr-3 text-blue-600" />
                  <span className="font-semibold">Service:</span>
                  <span className="ml-2">{booking.service}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">Appointment Details</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="mr-3 text-blue-600" />
                  <span className="font-semibold">Date:</span>
                  <span className="ml-2">{booking.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-3 text-blue-600" />
                  <span className="font-semibold">Time:</span>
                  <span className="ml-2">{booking.time}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3 text-blue-600" />
                  <span className="font-semibold">Contact:</span>
                  <span className="ml-2">{booking.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t">
            <button
              onClick={() => setShowReportForm(true)}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <FileText className="mr-2" /> Create Comprehensive Consultation Report
            </button>
          </div>
        </div>

        {showReportForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-6 text-blue-600 flex items-center">
                  <ClipboardList className="mr-3" /> Veterinary Consultation Report
                </h3>
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold">Diagnosis *</label>
                      <textarea
                        name="diagnosis"
                        value={reportData.diagnosis}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${validationErrors.diagnosis ? 'border-red-500' : 'border-gray-300'}`}
                        rows="3"
                        placeholder="Enter diagnosis details"
                      />
                      {validationErrors.diagnosis && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertTriangle className="mr-1" size={16} /> {validationErrors.diagnosis}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold">Treatment *</label>
                      <textarea
                        name="treatment"
                        value={reportData.treatment}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${validationErrors.treatment ? 'border-red-500' : 'border-gray-300'}`}
                        rows="3"
                        placeholder="Describe treatment plan"
                      />
                      {validationErrors.treatment && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertTriangle className="mr-1" size={16} /> {validationErrors.treatment}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={reportData.weight}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded border-gray-300"
                        placeholder="Pet's weight"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold">Temperature (°C)</label>
                      <input
                        type="number"
                        name="temperature"
                        value={reportData.temperature}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded border-gray-300"
                        placeholder="Body temperature"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold">Follow-up Date</label>
                      <input
                        type="date"
                        name="followUpDate"
                        value={reportData.followUpDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold">Vaccinations</label>
                      <textarea
                        name="vaccinations"
                        value={reportData.vaccinations}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded border-gray-300"
                        rows="2"
                        placeholder="Vaccination details"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold">Medications</label>
                      <textarea
                        name="medications"
                        value={reportData.medications}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded border-gray-300"
                        rows="2"
                        placeholder="Prescribed medications"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">Recommendations</label>
                    <textarea
                      name="recommendations"
                      value={reportData.recommendations}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded border-gray-300"
                      rows="3"
                      placeholder="Additional recommendations for pet care"
                    />
                  </div>
                  {submitted && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 flex items-center">
                      <CheckCircle2 className="mr-2" /> Report submitted successfully!
                    </div>
                  )}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                    >
                      <Save className="mr-2" /> Save Report
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeReport;