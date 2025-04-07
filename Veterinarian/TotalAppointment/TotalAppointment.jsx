// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import SideBarVeterinarian from "../SideBarVeterinarian/SideBarVeterinarian";
// import axiosInstance from "../../src/api/axios";

// const TotalAppointment = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [displayedAppointments, setDisplayedAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [appointmentsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();

//   console.log("TotalAppointment", appointments);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         console.log(
//           "Fetching appointments with token:",
//           localStorage.getItem("vetapp-token")
//         );
//         const { data } = await axiosInstance.get("/bookings/veterinarian");
//         console.log("Appointments data:", data);
        
//         // Sort appointments by date (newest first)
//         const sortedAppointments = (data.bookings || []).sort((a, b) => {
//           // First convert date strings to Date objects
//           const dateA = new Date(a.date);
//           const dateB = new Date(b.date);
//           // Sort in descending order (newest first)
//           return dateB - dateA;
//         });
        
//         setAppointments(sortedAppointments);
        
//         // Set initial displayed appointments
//         setDisplayedAppointments(sortedAppointments.slice(0, appointmentsPerPage));
//         setLoading(false);
//       } catch (error) {
//         console.error(
//           "Error fetching appointments:",
//           error.response?.status,
//           error.response?.data,
//           error.message
//         );
//         setLoading(false);
//         toast.error("Failed to load appointments");
//       }
//     };
//     fetchAppointments();
//   }, [appointmentsPerPage]);

//   const handleStatusUpdate = async (bookingId, status) => {
//     try {
//       const { data } = await axiosInstance.put(`/bookings/${bookingId}/status`, {
//         status,
//       });
      
//       // Update both appointments arrays with the new status
//       const updatedAppointments = appointments.map((appt) =>
//         appt._id === bookingId ? { ...appt, status } : appt
//       );
//       setAppointments(updatedAppointments);
      
//       setDisplayedAppointments(prevDisplayed => 
//         prevDisplayed.map((appt) =>
//           appt._id === bookingId ? { ...appt, status } : appt
//         )
//       );
      
//       toast.success(data.message);
//     } catch (error) {
//       console.error(
//         "Error updating appointment status:",
//         error.response?.status,
//         error.response?.data,
//         error.message
//       );
//       toast.error(`Failed to update appointment to ${status}`);
//     }
//   };

//   const handleConfirm = (bookingId) => {
//     if (window.confirm("Are you sure you want to confirm this appointment?")) {
//       handleStatusUpdate(bookingId, "Confirmed");
//     }
//   };

//   const handleCancel = (bookingId) => {
//     if (window.confirm("Are you sure you want to cancel this appointment?")) {
//       handleStatusUpdate(bookingId, "Cancelled");
//     }
//   };

//   const handleCreateReport = (bookingId) => {
//     console.log('Navigating to MakeReport with ID:', bookingId);
//     navigate(`/booking-report/${bookingId}`);
//   };
  
//   const handleLoadMore = () => {
//     const nextPage = currentPage + 1;
//     const startIndex = currentPage * appointmentsPerPage;
//     const endIndex = startIndex + appointmentsPerPage;
    
//     // Get the next set of appointments
//     const nextAppointments = appointments.slice(startIndex, endIndex);
    
//     // Append to displayed appointments
//     setDisplayedAppointments([...displayedAppointments, ...nextAppointments]);
//     setCurrentPage(nextPage);
//   };

//   if (loading) return (
//     <div className="flex h-screen">
//       <SideBarVeterinarian />
//       <div className="flex-1 flex items-center justify-center text-gray-500">
//         Loading appointments...
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex bg-gray-100 min-h-screen">
//       <SideBarVeterinarian />
//       <div className="flex-1 p-6">
//         <div className="bg-white shadow-sm rounded p-6 mb-6">
//           <h2 className="text-xl font-semibold text-gray-800">Total Appointments</h2>
//         </div>
        
//         {appointments && appointments.length > 0 ? (
//           <div className="space-y-4">
//             {displayedAppointments.map((appt) => (
//               <div 
//                 key={appt._id} 
//                 className="bg-white shadow-sm rounded-lg overflow-hidden"
//               >
//                 <table className="w-full table-fixed border-collapse">
//                   <thead>
//                     <tr className="bg-green-700 text-white">
//                       <th className="py-3 px-4 text-left font-medium">Pet Details</th>
//                       <th className="py-3 px-4 text-left font-medium">Service</th>
//                       <th className="py-3 px-4 text-left font-medium">Schedule</th>
//                       <th className="py-3 px-4 text-left font-medium">Owner</th>
//                       <th className="py-3 px-4 text-left font-medium">Status</th>
//                       <th className="py-3 px-4 text-center font-medium">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr className="hover:bg-gray-50">
//                       <td className="py-4 px-4 border-b">
//                         <div className="font-medium text-gray-800">{appt.petName}</div>
//                         <div className="text-sm text-gray-500">{appt.petType}</div>
//                       </td>
//                       <td className="py-4 px-4 border-b text-gray-600">
//                         {appt.service}
//                       </td>
//                       <td className="py-4 px-4 border-b text-gray-600">
//                         <div>{appt.date}</div>
//                         <div className="text-sm text-gray-500">{appt.time}</div>
//                       </td>
//                       <td className="py-4 px-4 border-b">
//                         <div className="text-gray-600">{appt.userId?.name || "N/A"}</div>
//                         <div className="text-sm text-gray-500">{appt.userId?.email || "N/A"}</div>
//                       </td>
//                       <td className="py-4 px-4 border-b">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           appt.status === "Pending" ? "bg-yellow-100 text-yellow-800" 
//                           : appt.status === "Confirmed" ? "bg-green-100 text-green-800"
//                           : appt.status === "Completed" ? "bg-blue-100 text-blue-800"
//                           : "bg-red-100 text-red-800"
//                         }`}>
//                           {appt.status}
//                         </span>
//                       </td>
//                       <td className="py-4 px-4 border-b text-center">
//                         {appt.status === "Pending" ? (
//                           <div className="flex justify-center gap-2">
//                             <button
//                               onClick={() => handleConfirm(appt._id)}
//                               className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
//                             >
//                               Confirm
//                             </button>
//                             <button
//                               onClick={() => handleCancel(appt._id)}
//                               className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         ) : (
//                           <button
//                             onClick={() => handleCreateReport(appt._id)}
//                             className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
//                           >
//                             Create Report
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             ))}
            
//             {/* Load More button (only show if there are more appointments to load) */}
//             {displayedAppointments.length < appointments.length && (
//               <div className="mt-6 flex justify-center">
//                 <button 
//                   onClick={handleLoadMore}
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition"
//                 >
//                   Load More Appointments
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="bg-white p-8 rounded-lg text-center shadow-sm">
//             <p className="text-gray-500">No appointments scheduled.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TotalAppointment;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SideBarVeterinarian from "../SideBarVeterinarian/SideBarVeterinarian";
import axiosInstance from "../../src/api/axios";

const TotalAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [displayedAppointments, setDisplayedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  console.log("TotalAppointment", appointments);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log(
          "Fetching appointments with token:",
          localStorage.getItem("vetapp-token")
        );
        const { data } = await axiosInstance.get("/bookings/veterinarian");
        console.log("Appointments data:", data);
        
        // Sort appointments by date (newest first)
        const sortedAppointments = (data.bookings || []).sort((a, b) => {
          // First convert date strings to Date objects
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          // Sort in descending order (newest first)
          return dateB - dateA;
        });
        
        setAppointments(sortedAppointments);
        
        // Set initial displayed appointments
        setDisplayedAppointments(sortedAppointments.slice(0, appointmentsPerPage));
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching appointments:",
          error.response?.status,
          error.response?.data,
          error.message
        );
        setLoading(false);
        toast.error("Failed to load appointments");
      }
    };
    fetchAppointments();
  }, [appointmentsPerPage]);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const { data } = await axiosInstance.put(`/bookings/${bookingId}/status`, {
        status,
      });
      
      // Update both appointments arrays with the new status
      const updatedAppointments = appointments.map((appt) =>
        appt._id === bookingId ? { ...appt, status } : appt
      );
      setAppointments(updatedAppointments);
      
      setDisplayedAppointments(prevDisplayed => 
        prevDisplayed.map((appt) =>
          appt._id === bookingId ? { ...appt, status } : appt
        )
      );
      
      toast.success(data.message);
    } catch (error) {
      console.error(
        "Error updating appointment status:",
        error.response?.status,
        error.response?.data,
        error.message
      );
      toast.error(`Failed to update appointment to ${status}`);
    }
  };

  const handleConfirm = (bookingId) => {
    if (window.confirm("Are you sure you want to confirm this appointment?")) {
      handleStatusUpdate(bookingId, "Confirmed");
    }
  };

  const handleCancel = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      handleStatusUpdate(bookingId, "Cancelled");
    }
  };

  const handleCreateReport = (bookingId) => {
    console.log('Navigating to MakeReport with ID:', bookingId);
    navigate(`/booking-report/${bookingId}`);
  };
  
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = currentPage * appointmentsPerPage;
    const endIndex = startIndex + appointmentsPerPage;
    
    // Get the next set of appointments
    const nextAppointments = appointments.slice(startIndex, endIndex);
    
    // Append to displayed appointments
    setDisplayedAppointments([...displayedAppointments, ...nextAppointments]);
    setCurrentPage(nextPage);
  };

  if (loading) return (
    <div className="flex h-screen">
      <SideBarVeterinarian />
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Loading appointments...
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SideBarVeterinarian />
      <div className="flex-1 p-6">
        <div className="bg-white shadow-sm rounded p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Total Appointments</h2>
        </div>
        
        {appointments && appointments.length > 0 ? (
          <div className="space-y-4">
            {displayedAppointments.map((appt) => (
              <div 
                key={appt._id} 
                className="bg-white shadow-sm rounded-lg overflow-hidden"
              >
                <table className="w-full table-fixed border-collapse">
                  <thead>
                    <tr className="bg-green-700 text-white">
                      <th className="py-3 px-4 text-left font-medium">Pet Details</th>
                      <th className="py-3 px-4 text-left font-medium">Service</th>
                      <th className="py-3 px-4 text-left font-medium">Schedule</th>
                      <th className="py-3 px-4 text-left font-medium">Owner</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-center font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 border-b">
                        <div className="font-medium text-gray-800">{appt.petName}</div>
                        <div className="text-sm text-gray-500">{appt.petType}</div>
                      </td>
                      <td className="py-4 px-4 border-b text-gray-600">
                        {appt.service}
                      </td>
                      <td className="py-4 px-4 border-b text-gray-600">
                        <div>{appt.date}</div>
                        <div className="text-sm text-gray-500">{appt.time}</div>
                      </td>
                      <td className="py-4 px-4 border-b">
                        <div className="text-gray-600">{appt.userId?.name || "N/A"}</div>
                        <div className="text-sm text-gray-500">{appt.userId?.email || "N/A"}</div>
                      </td>
                      <td className="py-4 px-4 border-b">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appt.status === "Pending" ? "bg-yellow-100 text-yellow-800" 
                          : appt.status === "Confirmed" ? "bg-green-100 text-green-800"
                          : appt.status === "Completed" ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 border-b text-center">
                        {appt.status === "Pending" && (
                          <div className="flex flex-col space-y-2 items-center">
                            <button
                              onClick={() => handleConfirm(appt._id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm w-full max-w-xs"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleCancel(appt._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm w-full max-w-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        {appt.status !== "Pending" && (
                          <button
                            onClick={() => handleCreateReport(appt._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                          >
                            Create Report
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
            
            {/* Load More button (only show if there are more appointments to load) */}
            {displayedAppointments.length < appointments.length && (
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={handleLoadMore}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition"
                >
                  Load More Appointments
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg text-center shadow-sm">
            <p className="text-gray-500">No appointments scheduled.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalAppointment;