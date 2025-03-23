import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axios';
import AdminNavbar from '../AdminNavbar';
import { toast } from 'react-toastify';
import useAppointmentHistory from '../../../hooks/useAppointmentHistory';

const AdminAppointments = () => {
  const [vetBookings, setVetBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const { adminAppointments, error } = useAppointmentHistory();

  console.log("AdminAppointments", adminAppointments);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        setCancelLoading(bookingId);
        await axiosInstance.delete(`/bookings/admin/${bookingId}`);
        setVetBookings(prevBookings =>
          prevBookings
            .map(vet => ({
              ...vet,
              appointments: vet.appointments.filter(appt => appt._id !== bookingId),
              totalAppointments: vet.appointments.length - 1,
            }))
            .filter(vet => vet.appointments.length > 0)
        );
        toast.success('Appointment canceled successfully');
      } catch (err) {
        console.error('Cancel Error:', err.response?.data || err.message);
        toast.error('Failed to cancel appointment');
      } finally {
        setCancelLoading(null);
      }
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-400',
      'Confirmed': 'bg-green-400',
      'Completed': 'bg-blue-400',
      'Cancelled': 'bg-red-400'
    };
    return statusColors[status] || 'bg-gray-400';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // if (loading) {
  //   return (
  //     <div className="flex h-screen justify-center items-center">
  //       <div className="w-16 h-16 border-4 border-t-purple-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-100 to-blue-100">
      <AdminNavbar />
      <div className="p-8 w-full overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">Admin Booking Dashboard</h2>

        {adminAppointments.length > 0 ? (
          <div className="space-y-8">
            {adminAppointments.map((vet) => (
              <div key={vet.veterinarian._id} className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
                <h3 className="text-2xl font-semibold text-purple-700 mb-4">
                  Dr. {vet.veterinarian?.name ?? 'Unknown Veterinarian'} ({vet.totalAppointments} Appointments)
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {vet.appointments.map((appt) => (
                    <div key={appt._id} className="bg-gray-50 rounded-xl p-4 shadow-inner border border-gray-200">
                      <div className={`w-full h-2 ${getStatusColor(appt.status)} mb-4`}></div>
                      <p>
                        <strong>User:</strong>{' '}
                        {appt.userId ? `${appt.userId.name} (${appt.userId.email})` : 'Unknown User'}
                      </p>
                      <p><strong>Date:</strong> {formatDate(appt.date)}</p>
                      <p><strong>Time:</strong> {appt.time}</p>
                      <p><strong>Pet:</strong> {appt.petName} ({appt.petType})</p>
                      <p><strong>Service:</strong> {appt.service}</p>
                      <p><strong>Status:</strong> {appt.status}</p>
                      {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                        <button
                          onClick={() => handleCancel(appt._id)}
                          disabled={cancelLoading === appt._id}
                          className={`mt-4 w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 ${
                            cancelLoading === appt._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {cancelLoading === appt._id ? 'Cancelling...' : 'Cancel Appointment'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
          : (
            <div className="bg-white p-12 rounded-2xl shadow-xl border border-purple-100 text-center">
              <p className="text-xl text-gray-600 font-medium">No bookings found.</p>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default AdminAppointments;