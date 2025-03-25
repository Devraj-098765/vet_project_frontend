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

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'border-purple-300 text-purple-300',
      'Confirmed': 'border-green-300 text-green-300',
      'Completed': 'border-blue-300 text-blue-300',
      'Cancelled': 'border-red-300 text-red-300'
    };
    return statusColors[status] || 'border-gray-300 text-gray-300';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
      <AdminNavbar />
      <div className="p-8 w-full overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-purple-800 mb-2">
              Admin Booking Dashboard
            </h2>
            <p className="text-purple-600 text-lg">Manage veterinary appointments with ease</p>
          </div>

          {adminAppointments.length > 0 ? (
            <div className="space-y-8">
              {adminAppointments.map((vet) => (
                <div 
                  key={vet.veterinarian._id} 
                  className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-200 overflow-hidden"
                >
                  <div className="bg-purple-500 p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-white">
                        Dr. {vet.veterinarian?.name ?? 'Unknown Veterinarian'}
                      </h3>
                      <div className="bg-white/20 px-4 py-2 rounded-full text-white">
                        {vet.totalAppointments} Appointments
                      </div>
                    </div>
                  </div>
                  <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {vet.appointments.map((appt) => (
                      <div 
                        key={appt._id} 
                        className="bg-white/70 rounded-2xl p-6 space-y-4 border-l-4 hover:scale-105 transition-all duration-300 ease-in-out relative"
                        style={{
                          borderLeftColor: appt.status === 'Pending' ? '#d8b4fe' :
                                           appt.status === 'Confirmed' ? '#86efac' :
                                           appt.status === 'Completed' ? '#93c5fd' :
                                           appt.status === 'Cancelled' ? '#fca5a5' : '#d1d5db'
                        }}
                      >
                        <div className={`${getStatusColor(appt.status)} font-bold text-sm bg-purple-50 px-3 py-1 rounded-full inline-block`}>
                          {appt.status}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-purple-800">
                            {appt.userId ? appt.userId.name : 'Unknown User'}
                          </p>
                          <p className="text-purple-600 text-sm">
                            {appt.userId ? appt.userId.email : 'No email'}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-purple-500">Date</p>
                            <p className="text-purple-800">{formatDate(appt.date)}</p>
                          </div>
                          <div>
                            <p className="text-purple-500">Time</p>
                            <p className="text-purple-800">{appt.time}</p>
                          </div>
                          <div>
                            <p className="text-purple-500">Pet</p>
                            <p className="text-purple-800">{appt.petName} ({appt.petType})</p>
                          </div>
                          <div>
                            <p className="text-purple-500">Service</p>
                            <p className="text-purple-800">{appt.service}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-lg p-12 rounded-2xl text-center">
              <p className="text-2xl text-purple-600 font-medium">
                No bookings found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminAppointments;