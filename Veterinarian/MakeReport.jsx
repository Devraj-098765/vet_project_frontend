// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Calendar, Clock,User,Phone,Dog,
//   Stethoscope,
//   CheckCircle2,
//   FileText,
//   X,
//   ClipboardList,
//   Save,
//   AlertTriangle,
//   ChevronRight,
//   Clipboard,
//   Activity,
//   FlaskConical,
//   Pill,
//   Syringe,
//   CalendarClock,
//   BarChart3,
//   MessageSquarePlus,
//   Mail,
//   Lock
// } from "lucide-react";
// import { toast } from "react-toastify";
// import SideBarVeterinarian from "./SideBarVeterinarian/SideBarVeterinarian.jsx";
// import axiosInstance from "../src/api/axios.js";

// const MakeReport = () => {
//   const { bookingId } = useParams();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [reportData, setReportData] = useState({
//     diagnosis: "",
//     treatment: "",
//     recommendations: "",
//     followUpDate: "",
//     followUpTime: "",
//     weight: "",
//     temperature: "",
//     vaccinations: "",
//     medications: "",
//   });
//   const [showReportForm, setShowReportForm] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});
//   const [isAppointmentTimeReached, setIsAppointmentTimeReached] = useState(false);

//   useEffect(() => {
//     const fetchBooking = async () => {
//       try {
//         console.log("Fetching booking with ID:", bookingId);
//         const startTime = Date.now();
//         const { data } = await axiosInstance.get(`/bookings/${bookingId}`);
//         console.log("Booking fetch time:", Date.now() - startTime, "ms");
//         console.log("Booking data:", data);
        
//         if (data.status === 'Completed') {
//           toast.error("This appointment is already marked as completed");
//           navigate("/Totalappointment");
//           return;
//         }
        
//         if (data.hasReport) {
//           toast.error("A medical report already exists for this appointment");
//           navigate("/Totalappointment");
//           return;
//         }
        
//         setBooking(data);
//         setLoading(false);
//       } catch (error) {
//         console.error(
//           "Error fetching booking:",
//           error.response?.status,
//           error.response?.data,
//           error.message
//         );
//         setBooking(null);
//         setLoading(false);
//         toast.error("Unable to load appointment details. Please try again.");
//       }
//     };
//     if (bookingId) fetchBooking();
//     else {
//       console.error("No bookingId provided");
//       toast.error("Appointment information is missing. Please select an appointment from the list.");
//       setLoading(false);
//     }
//   }, [bookingId, navigate]);

//   useEffect(() => {
//     if (booking) {
//       const checkAppointmentTime = () => {
//         try {
//           const [time, period] = booking.time.split(' ');
//           let [hours, minutes] = time.split(':').map(Number);
          
//           if (period === 'PM' && hours < 12) hours += 12;
//           if (period === 'AM' && hours === 12) hours = 0;
          
//           const appointmentDate = new Date(`${booking.date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00+05:45`);
          
//           const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
//           const currentDate = new Date(now);
          
//           console.log('Current time (NPT):', currentDate.toISOString());
//           console.log('Appointment time (NPT):', appointmentDate.toISOString());
//           console.log('Is appointment time reached?', currentDate >= appointmentDate);
          
//           setIsAppointmentTimeReached(currentDate >= appointmentDate);
//         } catch (error) {
//           console.error('Error checking appointment time:', error);
//         }
//       };
      
//       checkAppointmentTime();
//       const intervalId = setInterval(checkAppointmentTime, 60000);
//       return () => clearInterval(intervalId);
//     }
//   }, [booking]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setReportData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!reportData.diagnosis.trim()) errors.diagnosis = "Diagnosis is required";
//     if (!reportData.treatment.trim())
//       errors.treatment = "Treatment details are required";
    
//     if (reportData.temperature) {
//       const temp = parseFloat(reportData.temperature);
//       if (isNaN(temp) || temp <= 0) {
//         errors.temperature = "Temperature must be a positive number";
//       }
//     }
    
//     if (reportData.followUpTime) {
//       const timeHour = parseInt(reportData.followUpTime.split(':')[0]);
//       if (timeHour < 9 || timeHour >= 18) {
//         errors.followUpTime = "Follow-up time must be between 9 AM and 6 PM";
//       }
//     }
    
//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const checkAndSendReminderIfNeeded = async () => {
//     if (reportData.followUpDate && reportData.followUpTime) {
//       const followUpDateTime = new Date(`${reportData.followUpDate}T${reportData.followUpTime}`);
//       const now = new Date();
      
//       const timeDifferenceInHours = (followUpDateTime - now) / (1000 * 60 * 60);
      
//       if (timeDifferenceInHours <= 48 && timeDifferenceInHours > 0) {
//         try {
//           const startTime = Date.now();
//           await axiosInstance.post('/bookings/notifications/send-reminder', {
//             bookingId,
//             petName: booking.petName,
//             ownerEmail: booking.userId?.email,
//             ownerName: booking.userId?.name,
//             followUpDateTime: followUpDateTime.toISOString(),
//             subject: "Upcoming Veterinary Follow-up Reminder",
//             message: `Dear ${booking.userId?.name},\n\nThis is a reminder that you have a follow-up appointment for ${booking.petName} scheduled in approximately ${Math.round(timeDifferenceInHours)} hours.\n\nThank you,\nPet Care Clinic`
//           });
//           console.log("Reminder email sent in:", Date.now() - startTime, "ms");
//           toast.success("Follow-up reminder email has been sent!");
//         } catch (error) {
//           console.error("Error sending reminder email:", error);
//           toast.error("Unable to send follow-up reminder email.");
//         }
//       }
//     }
//   };

//   const handleReportSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     try {
//       const startTime = Date.now();
      
//       // Run report submission and status update concurrently
//       const [reportResponse] = await Promise.all([
//         axiosInstance.post(`/bookings/${bookingId}/report`, reportData),
//         axiosInstance.put(`/bookings/${bookingId}/status`, { status: "Completed" })
//       ]);
      
//       console.log("Report submission and status update time:", Date.now() - startTime, "ms");
//       console.log("Report Submitted:", reportResponse.data);

//       // Send reminder email in parallel (non-blocking)
//       checkAndSendReminderIfNeeded();

//       setSubmitted(true);
//       toast.success("Medical report successfully submitted and appointment marked as completed!");

//       window.dispatchEvent(new Event("refreshVetDashboardStats"));

//       // Reduce redirect delay to 1 second
//       setTimeout(() => {
//         setSubmitted(false);
//         setShowReportForm(false);
//         setReportData({
//           diagnosis: "",
//           treatment: "",
//           recommendations: "",
//           followUpDate: "",
//           followUpTime: "",
//           weight: "",
//           temperature: "",
//           vaccinations: "",
//           medications: "",
//         });
//         navigate("/Totalappointment");
//       }, 1000);
//     } catch (error) {
//       console.error(
//         "Error submitting report or updating status:",
//         error.response?.status,
//         error.response?.data,
//         error.message
//       );
//       toast.error("Unable to save the medical report. Please check your connection and try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     const hasContent = Object.values(reportData).some(
//       (value) => value.trim() !== ""
//     );
//     if (hasContent && !submitted) {
//       const toastId = toast.info(
//         <div>
//           <p className="font-medium mb-2">Unsaved changes will be lost. Are you sure?</p>
//           <div className="flex justify-end space-x-2 mt-2">
//             <button 
//               onClick={() => {
//                 toast.dismiss(toastId);
//                 closeFormAndClearData();
//               }}
//               className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
//             >
//               Discard
//             </button>
//             <button 
//               onClick={() => toast.dismiss(toastId)}
//               className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
//             >
//               Keep Editing
//             </button>
//           </div>
//         </div>,
//         {
//           autoClose: false,
//           closeButton: false,
//           position: toast.POSITION.TOP_CENTER,
//           closeOnClick: false,
//           draggable: false,
//         }
//       );
//       return;
//     }
//     closeFormAndClearData();
//   };

//   const closeFormAndClearData = () => {
//     setShowReportForm(false);
//     setReportData({
//       diagnosis: "",
//       treatment: "",
//       recommendations: "",
//       followUpDate: "",
//       followUpTime: "",
//       weight: "",
//       temperature: "",
//       vaccinations: "",
//       medications: "",
//     });
//     setValidationErrors({});
//   };

//   if (loading) {
//     return (
//       <div className="flex">
//         <SideBarVeterinarian />
//         <div className="bg-teal-50 min-h-screen p-6 flex-1 flex items-center justify-center">
//           <div className="flex flex-col items-center text-center">
//             <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
//             <p className="text-teal-700 font-medium">Loading booking details...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!booking) {
//     return (
//       <div className="flex">
//         <SideBarVeterinarian />
//         <div className="bg-teal-50 min-h-screen p-6 flex-1 flex flex-col items-center justify-center">
//           <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
//             <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
//             <p className="text-xl font-bold text-gray-800 mb-2">Booking Not Found</p>
//             <p className="text-gray-600 mb-6">The appointment details could not be loaded or do not exist.</p>
//             <button
//               onClick={() => navigate("/Totalappointment")}
//               className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
//             >
//               Back to Appointments
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex">
//       <SideBarVeterinarian />
//       <div className="bg-teal-50/40 min-h-screen p-4 md:p-6 flex-1">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center text-sm text-teal-700 mb-6">
//             <button 
//               onClick={() => navigate("/Totalappointment")}
//               className="hover:text-teal-800 transition-colors"
//             >
//               Appointments
//             </button>
//             <ChevronRight size={16} className="mx-2" />
//             <span className="font-semibold">Create Report</span>
//           </div>

//           <div className="bg-white rounded-2xl overflow-hidden shadow-md">
//             <div className="p-6 md:p-8">
//               <h2 className="text-2xl font-bold text-teal-800 mb-6 flex items-center">
//                 <ClipboardList className="mr-3 text-teal-600" size={28} />
//                 Create Medical Report
//               </h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//                 <div>
//                   <div className="bg-teal-50 rounded-xl p-4">
//                     <h3 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
//                       <Dog className="mr-2 text-teal-600" size={20} />
//                       Patient Details
//                     </h3>
                    
//                     <div className="space-y-4">
//                       <div className="flex items-start space-x-4">
//                         <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
//                           <User className="text-teal-600" size={18} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-teal-600 font-medium">Owner</p>
//                           <p className="font-medium text-gray-800">{booking.userId?.name || "N/A"}</p>
//                         </div>
//                       </div>

//                       <div className="flex items-start space-x-4">
//                         <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
//                           <Dog className="text-teal-600" size={18} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-teal-600 font-medium">Pet Name</p>
//                           <p className="font-medium text-gray-800">{booking.petName}</p>
//                         </div>
//                       </div>

//                       <div className="flex items-start space-x-4">
//                         <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
//                           <Stethoscope className="text-teal-600" size={18} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-teal-600 font-medium">Service</p>
//                           <p className="font-medium text-gray-800">{booking.service}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <div className="bg-teal-50 rounded-xl p-4">
//                     <h3 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
//                       <Calendar className="mr-2 text-teal-600" size={20} />
//                       Appointment Details
//                     </h3>
                    
//                     <div className="space-y-4">
//                       <div className="flex items-start space-x-4">
//                         <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
//                           <Calendar className="text-teal-600" size={18} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-teal-600 font-medium">Date</p>
//                           <p className="font-medium text-gray-800">{booking.date}</p>
//                         </div>
//                       </div>

//                       <div className="flex items-start space-x-4">
//                         <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
//                           <Clock className="text-teal-600" size={18} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-teal-600 font-medium">Time</p>
//                           <p className="font-medium text-gray-800">{booking.time}</p>
//                         </div>
//                       </div>

//                       <div className="flex items-start space-x-4">
//                         <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
//                           <Phone className="text-teal-600" size={18} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-teal-600 font-medium">Contact</p>
//                           <p className="font-medium text-gray-800">{booking.phone || "N/A"}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <button
//                 onClick={() => isAppointmentTimeReached && setShowReportForm(true)}
//                 disabled={!isAppointmentTimeReached}
//                 className={`w-full ${
//                   isAppointmentTimeReached 
//                     ? "bg-teal-600 hover:bg-teal-700" 
//                     : "bg-gray-400 cursor-not-allowed"
//                 } text-white py-4 rounded-xl transition-all duration-200 flex items-center justify-center group shadow-sm`}
//               >
//                 {isAppointmentTimeReached ? (
//                   <FileText className="mr-2 group-hover:scale-110 transition-transform duration-200" />
//                 ) : (
//                   <Lock className="mr-2" />
//                 )}
//                 <span className="font-semibold text-lg">
//                   {isAppointmentTimeReached 
//                     ? "Create Medical Report" 
//                     : "Available After Appointment Time"}
//                 </span>
//               </button>
              
//               {!isAppointmentTimeReached && (
//                 <p className="text-amber-600 text-sm flex items-center justify-center mt-2">
//                   <AlertTriangle size={16} className="mr-1.5" />
//                   This button will become active at the scheduled appointment time: {booking.date} {booking.time}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {showReportForm && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm overflow-y-auto">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 relative">
//               <button
//                 onClick={handleClose}
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 z-10"
//               >
//                 <X size={24} />
//               </button>
              
//               <div className="p-6">
//                 <div className="mb-6 flex items-center border-b border-gray-100 pb-4">
//                   <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
//                     <ClipboardList className="text-teal-600" size={24} />
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-800">
//                       Medical Report
//                     </h3>
//                     <p className="text-sm text-teal-600">
//                       for {booking.petName} • {booking.date}
//                     </p>
//                   </div>
//                 </div>
                
//                 <form onSubmit={handleReportSubmit} className="space-y-6">
//                   <div className="grid md:grid-cols-2 gap-5">
//                     <div className="space-y-1">
//                       <label className="flex items-center text-teal-700 font-medium">
//                         <Activity size={16} className="mr-1.5" />
//                         Diagnosis *
//                       </label>
//                       <textarea
//                         name="diagnosis"
//                         value={reportData.diagnosis}
//                         onChange={handleInputChange}
//                         className={`w-full p-3 border rounded-lg ${
//                           validationErrors.diagnosis 
//                             ? "border-red-300 bg-red-50" 
//                             : "border-teal-100 focus:border-teal-300 bg-teal-50/50"
//                         } outline-none transition-colors`}
//                         rows="4"
//                         placeholder="Enter diagnosis details"
//                       />
//                       {validationErrors.diagnosis && (
//                         <p className="text-red-600 text-sm flex items-center mt-1">
//                           <AlertTriangle className="mr-1" size={14} />{" "}
//                           {validationErrors.diagnosis}
//                         </p>
//                       )}
//                     </div>
                    
//                     <div className="space-y-1">
//                       <label className="flex items-center text-teal-700 font-medium">
//                         <FlaskConical size={16} className="mr-1.5" />
//                         Treatment *
//                       </label>
//                       <textarea
//                         name="treatment"
//                         value={reportData.treatment}
//                         onChange={handleInputChange}
//                         className={`w-full p-3 border rounded-lg ${
//                           validationErrors.treatment 
//                             ? "border-red-300 bg-red-50" 
//                             : "border-teal-100 focus:border-teal-300 bg-teal-50/50"
//                         } outline-none transition-colors`}
//                         rows="4"
//                         placeholder="Describe treatment plan"
//                       />
//                       {validationErrors.treatment && (
//                         <p className="text-red-600 text-sm flex items-center mt-1">
//                           <AlertTriangle className="mr-1" size={14} />{" "}
//                           {validationErrors.treatment}
//                         </p>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="grid md:grid-cols-3 gap-5">
//                     <div className="space-y-1">
//                       <label className="flex items-center text-teal-700 font-medium">
//                         <BarChart3 size={16} className="mr-1.5" />
//                         Weight (kg)
//                       </label>
//                       <input
//                         type="number"
//                         name="weight"
//                         value={reportData.weight}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border border-teal-100 focus:border-teal-300 bg-teal-50/50 rounded-lg outline-none transition-colors"
//                         placeholder="Pet's weight"
//                         step="0.1"
//                       />
//                     </div>
                    
//                     <div className="space-y-1">
//                       <label className="flex items-center text-teal-700 font-medium">
//                         <Activity size={16} className="mr-1.5" />
//                         Temperature (°C)
//                       </label>
//                       <input
//                         type="number"
//                         name="temperature"
//                         value={reportData.temperature}
//                         onChange={handleInputChange}
//                         className={`w-full p-3 border ${
//                           validationErrors.temperature 
//                           ? "border-red-300 bg-red-50" 
//                           : "border-teal-100 focus:border-teal-300 bg-teal-50/50"
//                         } rounded-lg outline-none transition-colors`}
//                         placeholder="Body temperature"
//                         step="0.1"
//                         min="0.1"
//                       />
//                       {validationErrors.temperature && (
//                         <p className="text-red-600 text-sm flex items-center mt-1">
//                           <AlertTriangle className="mr-1" size={14} />{" "}
//                           {validationErrors.temperature}
//                         </p>
//                       )}
//                     </div>
                    
//                     <div className="space-y-1">
//                       <label className="flex items-center text-teal-700 font-medium">
//                         <CalendarClock size={16} className="mr-1.5" />
//                         Follow-up Date
//                       </label>
//                       <input
//                         type="date"
//                         name="followUpDate"
//                         value={reportData.followUpDate}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border border-teal-100 focus:border-teal-300 bg-teal-50/50 rounded-lg outline-none transition-colors"
//                         min={new Date().toISOString().split('T')[0]}
//                         placeholder="Select a follow-up date"
//                         title="Please select today or a future date for follow-up"
//                         onKeyDown={(e) => e.preventDefault()}
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="grid md:grid-cols-3 gap-5">
//                     <div className="space-y-1">
//                       <label className="flex items-center text-teal-700 font-medium">
//                         <Clock size={16} className="mr-1.5" />
//                         Follow-up Time
//                       </label>
//                       <input
//                         type="time"
//                         name="followUpTime"
//                         value={reportData.followUpTime}
//                         onChange={handleInputChange}
//                         className={`w-full p-3 border ${
//                           validationErrors.followUpTime 
//                           ? "border-red-300 bg-red-50" 
//                           : "border-teal-100 focus:border-teal-300 bg-teal-50/50"
//                         } rounded-lg outline-none transition-colors`}
//                         placeholder="Select a follow-up time"
//                         min="09:00"
//                         max="18:00"
//                       />
//                       {validationErrors.followUpTime && (
//                         <p className="text-red-600 text-sm flex items-center mt-1">
//                           <AlertTriangle className="mr-1" size={14} />{" "}
//                           {validationErrors.followUpTime}
//                         </p>
//                       )}
//                       <p className="text-xs flex items-center text-teal-600 mt-1">
//                         <Mail size={12} className="mr-1" /> Reminder sent if follow-up is in 48 hours
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="grid md:grid-cols-2 gap-5">
//                     <div className="space-y-1">
//                       <label className="flex items-center text-teal-700 font-medium">
//                         <Syringe size={16} className="mr-1.5" />
//                         Vaccinations
//                       </label>
//                       <textarea
//                         name="vaccinations"
//                         value={reportData.vaccinations}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border border-teal-100 focus:border-teal-300 bg-teal-50/50 rounded-lg outline-none transition-colors"
//                         rows="2"
//                         placeholder="Vaccination details"
//                       />
//                     </div>
                    
//                     <div className="space-y-1">
//                       <label className="flex items-center text-teal-700 font-medium">
//                         <Pill size={16} className="mr-1.5" />
//                         Medications
//                       </label>
//                       <textarea
//                         name="medications"
//                         value={reportData.medications}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border border-teal-100 focus:border-teal-300 bg-teal-50/50 rounded-lg outline-none transition-colors"
//                         rows="2"
//                         placeholder="Prescribed medications"
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="space-y-1">
//                     <label className="flex items-center text-teal-700 font-medium">
//                       <MessageSquarePlus size={16} className="mr-1.5" />
//                       Recommendations
//                     </label>
//                     <textarea
//                       name="recommendations"
//                       value={reportData.recommendations}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border border-teal-100 focus:border-teal-300 bg-teal-50/50 rounded-lg outline-none transition-colors"
//                       rows="3"
//                       placeholder="Additional recommendations for pet care"
//                     />
//                   </div>
                  
//                   {submitted && (
//                     <div className="bg-teal-50 border-l-4 border-teal-500 text-teal-700 p-4 rounded-r-lg flex items-center">
//                       <CheckCircle2 className="mr-2 text-teal-500" />
//                       <span>Report submitted successfully!</span>
//                     </div>
//                   )}
                  
//                   <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
//                     <button
//                       type="button"
//                       onClick={handleClose}
//                       className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center"
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                           <span>Submitting...</span>
//                         </>
//                       ) : (
//                         <>
//                           <Save className="mr-2" size={18} /> Save Report
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MakeReport;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar, Clock, User, Phone, Dog,
  Stethoscope,
  CheckCircle2,
  FileText,
  X,
  ClipboardList,
  Save,
  AlertTriangle,
  ChevronRight,
  Clipboard,
  Activity,
  FlaskConical,
  Pill,
  Syringe,
  CalendarClock,
  BarChart3,
  MessageSquarePlus,
  Mail,
  Lock
} from "lucide-react";
import { toast } from "react-toastify";
import SideBarVeterinarian from "./SideBarVeterinarian/SideBarVeterinarian.jsx";
import axiosInstance from "../src/api/axios.js";

const MakeReport = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    diagnosis: "",
    treatment: "",
    recommendations: "",
    followUpDate: "",
    followUpTime: "",
    weight: "",
    temperature: "",
    vaccinations: "",
    medications: "",
  });
  const [showReportForm, setShowReportForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isAppointmentTimeReached, setIsAppointmentTimeReached] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        console.log("Fetching booking with ID:", bookingId);
        const startTime = Date.now();
        const { data } = await axiosInstance.get(`/bookings/${bookingId}`);
        console.log("Booking fetch time:", Date.now() - startTime, "ms");
        console.log("Booking data:", data);
        
        if (data.status === 'Completed') {
          toast.error("This appointment is already marked as completed");
          navigate("/Totalappointment");
          return;
        }
        
        if (data.hasReport) {
          toast.error("A medical report already exists for this appointment");
          navigate("/Totalappointment");
          return;
        }
        
        setBooking(data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching booking:",
          error.response?.status,
          error.response?.data,
          error.message
        );
        setBooking(null);
        setLoading(false);
        toast.error("Unable to load appointment details. Please try again.");
      }
    };
    if (bookingId) fetchBooking();
    else {
      console.error("No bookingId provided");
      toast.error("Appointment information is missing. Please select an appointment from the list.");
      setLoading(false);
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    if (booking) {
      const checkAppointmentTime = () => {
        try {
          const [time, period] = booking.time.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          
          if (period === 'PM' && hours < 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          
          const appointmentDate = new Date(`${booking.date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00+05:45`);
          
          const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
          const currentDate = new Date(now);
          
          console.log('Current time (NPT):', currentDate.toISOString());
          console.log('Appointment time (NPT):', appointmentDate.toISOString());
          console.log('Is appointment time reached?', currentDate >= appointmentDate);
          
          setIsAppointmentTimeReached(currentDate >= appointmentDate);
        } catch (error) {
          console.error('Error checking appointment time:', error);
        }
      };
      
      checkAppointmentTime();
      const intervalId = setInterval(checkAppointmentTime, 60000);
      return () => clearInterval(intervalId);
    }
  }, [booking]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!reportData.diagnosis.trim()) errors.diagnosis = "Diagnosis is required";
    if (!reportData.treatment.trim()) errors.treatment = "Treatment details are required";
    
    if (reportData.temperature) {
      const temp = parseFloat(reportData.temperature);
      if (isNaN(temp) || temp <= 0) {
        errors.temperature = "Temperature must be a positive number";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkAndSendReminderIfNeeded = async () => {
    if (reportData.followUpDate && reportData.followUpTime) {
      const followUpDateTime = new Date(`${reportData.followUpDate}T${reportData.followUpTime}`);
      const now = new Date();
      
      const timeDifferenceInHours = (followUpDateTime - now) / (1000 * 60 * 60);
      
      if (timeDifferenceInHours <= 48 && timeDifferenceInHours > 0) {
        try {
          const startTime = Date.now();
          await axiosInstance.post('/bookings/notifications/send-reminder', {
            bookingId,
            petName: booking.petName,
            ownerEmail: booking.userId?.email,
            ownerName: booking.userId?.name,
            followUpDateTime: followUpDateTime.toISOString(),
            subject: "Upcoming Veterinary Follow-up Reminder",
            message: `Dear ${booking.userId?.name},\n\nThis is a reminder that you have a follow-up appointment for ${booking.petName} scheduled in approximately ${Math.round(timeDifferenceInHours)} hours.\n\nThank you,\nPet Care Clinic`
          });
          console.log("Reminder email sent in:", Date.now() - startTime, "ms");
          toast.success("Follow-up reminder email has been sent!");
        } catch (error) {
          console.error("Error sending reminder email:", error);
          toast.error("Unable to send follow-up reminder email.");
        }
      }
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const startTime = Date.now();
      
      // Run report submission and status update concurrently
      const [reportResponse] = await Promise.all([
        axiosInstance.post(`/bookings/${bookingId}/report`, reportData),
        axiosInstance.put(`/bookings/${bookingId}/status`, { status: "Completed" })
      ]);
      
      console.log("Report submission and status update time:", Date.now() - startTime, "ms");
      console.log("Report Submitted:", reportResponse.data);

      // Send reminder email in parallel (non-blocking)
      checkAndSendReminderIfNeeded();

      setSubmitted(true);
      toast.success("Medical report successfully submitted and appointment marked as completed!");

      window.dispatchEvent(new Event("refreshVetDashboardStats"));

      // Reduce redirect delay to 1 second
      setTimeout(() => {
        setSubmitted(false);
        setShowReportForm(false);
        setReportData({
          diagnosis: "",
          treatment: "",
          recommendations: "",
          followUpDate: "",
          followUpTime: "",
          weight: "",
          temperature: "",
          vaccinations: "",
          medications: "",
        });
        navigate("/Totalappointment");
      }, 1000);
    } catch (error) {
      console.error(
        "Error submitting report or updating status:",
        error.response?.status,
        error.response?.data,
        error.message
      );
      toast.error("Unable to save the medical report. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    const hasContent = Object.values(reportData).some(
      (value) => value.trim() !== ""
    );
    if (hasContent && !submitted) {
      const toastId = toast.info(
        <div>
          <p className="font-medium mb-2">Unsaved changes will be lost. Are you sure?</p>
          <div className="flex justify-end space-x-2 mt-2">
            <button 
              onClick={() => {
                toast.dismiss(toastId);
                closeFormAndClearData();
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
            >
              Discard
            </button>
            <button 
              onClick={() => toast.dismiss(toastId)}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
            >
              Keep Editing
            </button>
          </div>
        </div>,
        {
          autoClose: false,
          closeButton: false,
          position: toast.POSITION.TOP_CENTER,
          closeOnClick: false,
          draggable: false,
        }
      );
      return;
    }
    closeFormAndClearData();
  };

  const closeFormAndClearData = () => {
    setShowReportForm(false);
    setReportData({
      diagnosis: "",
      treatment: "",
      recommendations: "",
      followUpDate: "",
      followUpTime: "",
      weight: "",
      temperature: "",
      vaccinations: "",
      medications: "",
    });
    setValidationErrors({});
  };

  if (loading) {
    return (
      <div className="flex">
        <SideBarVeterinarian />
        <div className="bg-teal-50 min-h-screen p-6 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-teal-700 font-medium">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex">
        <SideBarVeterinarian />
        <div className="bg-teal-50 min-h-screen p-6 flex-1 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
            <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
            <p className="text-xl font-bold text-gray-800 mb-2">Booking Not Found</p>
            <p className="text-gray-600 mb-6">The appointment details could not be loaded or do not exist.</p>
            <button
              onClick={() => navigate("/Totalappointment")}
              className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Back to Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideBarVeterinarian />
      <div className="bg-teal-50/40 min-h-screen p-4 md:p-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center text-sm text-teal-700 mb-6">
            <button 
              onClick={() => navigate("/Totalappointment")}
              className="hover:text-teal-800 transition-colors"
            >
              Appointments
            </button>
            <ChevronRight size={16} className="mx-2" />
            <span className="font-semibold">Create Report</span>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-md">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-teal-800 mb-6 flex items-center">
                <ClipboardList className="mr-3 text-teal-600" size={28} />
                Create Medical Report
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="bg-teal-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                      <Dog className="mr-2 text-teal-600" size={20} />
                      Patient Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <User className="text-teal-600" size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-teal-600 font-medium">Owner</p>
                          <p className="font-medium text-gray-800">{booking.userId?.name || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Dog className="text-teal-600" size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-teal-600 font-medium">Pet Name</p>
                          <p className="font-medium text-gray-800">{booking.petName}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Stethoscope className="text-teal-600" size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-teal-600 font-medium">Service</p>
                          <p className="font-medium text-gray-800">{booking.service}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-teal-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                      <Calendar className="mr-2 text-teal-600" size={20} />
                      Appointment Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Calendar className="text-teal-600" size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-teal-600 font-medium">Date</p>
                          <p className="font-medium text-gray-800">{booking.date}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Clock className="text-teal-600" size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-teal-600 font-medium">Time</p>
                          <p className="font-medium text-gray-800">{booking.time}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Phone className="text-teal-600" size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-teal-600 font-medium">Contact</p>
                          <p className="font-medium text-gray-800">{booking.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => isAppointmentTimeReached && setShowReportForm(true)}
                disabled={!isAppointmentTimeReached}
                className={`w-full ${
                  isAppointmentTimeReached 
                    ? "bg-teal-600 hover:bg-teal-700" 
                    : "bg-gray-400 cursor-not-allowed"
                } text-white py-4 rounded-xl transition-all duration-200 flex items-center justify-center group shadow-sm`}
              >
                {isAppointmentTimeReached ? (
                  <FileText className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                ) : (
                  <Lock className="mr-2" />
                )}
                <span className="font-semibold text-lg">
                  {isAppointmentTimeReached 
                    ? "Create Medical Report" 
                    : "Available After Appointment Time"}
                </span>
              </button>
              
              {!isAppointmentTimeReached && (
                <p className="text-amber-600 text-sm flex items-center justify-center mt-2">
                  <AlertTriangle size={16} className="mr-1.5" />
                  This button will become active at the scheduled appointment time: {booking.date} {booking.time}
                </p>
              )}
            </div>
          </div>
        </div>

        {showReportForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 z-10"
              >
                <X size={24} />
              </button>
              
              <div className="p-6">
                <div className="mb-6 flex items-center border-b border-gray-100 pb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <ClipboardList className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Medical Report
                    </h3>
                    <p className="text-sm text-teal-600">
                      for {booking.petName} • {booking.date}
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleReportSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="flex items-center text-teal-700 font-medium">
                        <Activity size={16} className="mr-1.5" />
                        Diagnosis *
                      </label>
                      <textarea
                        name="diagnosis"
                        value={reportData.diagnosis}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg ${
                          validationErrors.diagnosis 
                            ? "border-red-300 bg-red-50" 
                            : "border-teal-100 focus:border-teal-300 bg-teal-50/50"
                        } outline-none transition-colors`}
                        rows="4"
                        placeholder="Enter diagnosis details"
                      />
                      {validationErrors.diagnosis && (
                        <p className="text-red-600 text-sm flex items-center mt-1">
                          <AlertTriangle className="mr-1" size={14} />{" "}
                          {validationErrors.diagnosis}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <label className="flex items-center text-teal-700 font-medium">
                        <FlaskConical size={16} className="mr-1.5" />
                        Treatment *
                      </label>
                      <textarea
                        name="treatment"
                        value={reportData.treatment}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg ${
                          validationErrors.treatment 
                            ? "border-red-300 bg-red-50" 
                            : "border-teal-100 focus:border-teal-300 bg-teal-50/50"
                        } outline-none transition-colors`}
                        rows="4"
                        placeholder="Describe treatment plan"
                      />
                      {validationErrors.treatment && (
                        <p className="text-red-600 text-sm flex items-center mt-1">
                          <AlertTriangle className="mr-1" size={14} />{" "}
                          {validationErrors.treatment}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                      <label className="flex items-center text-teal-700 font-medium">
                        <BarChart3 size={16} className="mr-1.5" />
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={reportData.weight}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-teal-100 focus:border-teal-300 bg-teal-50/50 rounded-lg outline-none transition-colors"
                        placeholder="Pet's weight"
                        step="0.1"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="flex items-center text-teal-700 font-medium">
                        <Activity size={16} className="mr-1.5" />
                        Temperature (°C)
                      </label>
                      <input
                        type="number"
                        name="temperature"
                        value={reportData.temperature}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${
                          validationErrors.temperature 
                          ? "border-red-300 bg-red-50" 
                          : "border-teal-100 focus:border-teal-300 bg-teal-50/50"
                        } rounded-lg outline-none transition-colors`}
                        placeholder="Body temperature"
                        step="0.1"
                        min="0.1"
                      />
                      {validationErrors.temperature && (
                        <p className="text-red-600 text-sm flex items-center mt-1">
                          <AlertTriangle className="mr-1" size={14} />{" "}
                          {validationErrors.temperature}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <label className="flex items-center text-teal-700 font-medium">
                        <CalendarClock size={16} className="mr-1.5" />
                        Follow-up Date
                      </label>
                      <input
                        type="date"
                        name="followUpDate"
                        value={reportData.followUpDate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-teal-100 focus:border-teal-300 bg-teal-50/50 rounded-lg outline-none transition-colors"
                        min={new Date().toISOString().split('T')[0]}
                        placeholder="Select a follow-up date"
                        title="Please select today or a future date for follow-up"
                        onKeyDown={(e) => e.preventDefault()}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                      <label className="flex items-center text-teal-700 font-medium">
                        <Clock size={16} className="mr-1.5" />
                        Follow-up Time
                      </label>
                      <input
                        type="time"
                        name="followUpTime"
                        value={reportData.followUpTime}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${
                          validationErrors.followUpTime 
                            ? "border-red-300 bg-red-50" 
                            : "border-teal-100 focus:border-teal-300 bg-teal-50/50"
                        } rounded-lg outline-none transition-colors`}
                        placeholder="Select a follow-up time"
                      />
                      {validationErrors.followUpTime && (
                        <p className="text-red-600 text-sm flex items-center mt-1">
                          <AlertTriangle className="mr-1" size={14} />{" "}
                          {validationErrors.followUpTime}
                        </p>
                      )}
                      <p className="text-xs flex items-center text-teal-600 mt-1">
                        <Mail size={12} className="mr-1" /> Reminder sent if follow-up is in 48 hours
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="flex items-center text-teal-700 font-medium">
                        <Syringe size={16} className="mr-1.5" />
                        Vaccinations
                      </label>
                      <textarea
                        name="vaccinations"
                        value={reportData.vaccinations}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-teal-100 focus:border-teal-300 bg-teal-50/50 rounded-lg outline-none transition-colors"
                        rows="2"
                        placeholder="Vaccination details"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="flex items-center text-teal-700 font-medium">
                        <Pill size={16} className="mr-1.5" />
                        Medications
                      </label>
                      <textarea
                        name="medications"
                        value={reportData.medications}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-teal-100 focus:border-teal-300 bg-teal-50/50 rounded-lg outline-none transition-colors"
                        rows="2"
                        placeholder="Prescribed medications"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="flex items-center text-teal-700 font-medium">
                      <MessageSquarePlus size={16} className="mr-1.5" />
                      Recommendations
                    </label>
                    <textarea
                      name="recommendations"
                      value={reportData.recommendations}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-teal-100 focus:border-teal-300 bg-teal-50/50 rounded-lg outline-none transition-colors"
                      rows="3"
                      placeholder="Additional recommendations for pet care"
                    />
                  </div>
                  
                  {submitted && (
                    <div className="bg-teal-50 border-l-4 border-teal-500 text-teal-700 p-4 rounded-r-lg flex items-center">
                      <CheckCircle2 className="mr-2 text-teal-500" />
                      <span>Report submitted successfully!</span>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Save className="mr-2" size={18} /> Save Report
                        </>
                      )}
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
