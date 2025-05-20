import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { FaReceipt, FaSearch, FaMoneyBillWave, FaUsers, FaUserMd, FaDownload } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalPayments: 0,
    uniqueUsers: 0,
    uniqueVets: 0
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosInstance.get("/payments/admin/all");
        setPayments(response.data || []);
        setFilteredPayments(response.data || []);
        calculateStats(response.data || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payments");
        setPayments([]);
        setFilteredPayments([]);
      }
    };
    fetchPayments();
  }, []);

  const calculateStats = (paymentData) => {
    const totalAmount = paymentData.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPayments = paymentData.length;
    
    // Count unique users
    const userIds = new Set();
    paymentData.forEach(payment => {
      if (payment.userId?._id) {
        userIds.add(payment.userId._id);
      }
    });

    // Count unique veterinarians
    const vetIds = new Set();
    paymentData.forEach(payment => {
      const vetId = payment.bookingId?.veterinarianId?._id || payment.metadata?.veterinarianId;
      if (vetId) {
        vetIds.add(vetId);
      }
    });

    setStats({
      totalAmount,
      totalPayments,
      uniqueUsers: userIds.size,
      uniqueVets: vetIds.size
    });
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPayments(payments);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = payments.filter(payment => {
      const user = payment.userId?.name || payment.userId?.email || "";
      const vet = payment.bookingId?.veterinarianId?.name || payment.metadata?.veterinarianName || "";
      const service = payment.metadata?.service || payment.bookingId?.service || "";
      
      return (
        user.toLowerCase().includes(lowercaseSearch) ||
        vet.toLowerCase().includes(lowercaseSearch) ||
        service.toLowerCase().includes(lowercaseSearch) ||
        payment.amount.toString().includes(lowercaseSearch)
      );
    });

    setFilteredPayments(filtered);
  }, [searchTerm, payments]);

  const handleExportCSV = () => {
    // Create CSV content
    const header = "Date,User,Veterinarian,Service,Amount\n";
    const rows = filteredPayments.map(payment => {
      const date = new Date(payment.createdAt).toLocaleDateString();
      const user = payment.userId?.name || payment.userId?.email || "User";
      const vet = payment.bookingId?.veterinarianId?.name || payment.metadata?.veterinarianName || "Veterinarian";
      const service = payment.metadata?.service || payment.bookingId?.service || "Service";
      const amount = payment.amount.toFixed(2);
      return `"${date}","${user}","${vet}","${service}","$${amount}"`;
    }).join("\n");
    
    const csvContent = header + rows;
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'payment_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNavbar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-800 mb-4 md:mb-0">Payment Management</h1>
            
            <div className="w-full md:w-auto flex items-center">
              <div className="relative w-full md:w-64 mr-4">
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button 
                onClick={handleExportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
              >
                <FaDownload className="mr-2" />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <FaMoneyBillWave className="text-indigo-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${stats.totalAmount.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <FaReceipt className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Payments</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalPayments}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Unique Customers</p>
                <p className="text-2xl font-bold text-gray-800">{stats.uniqueUsers}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <FaUserMd className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Veterinarians Paid</p>
                <p className="text-2xl font-bold text-gray-800">{stats.uniqueVets}</p>
              </div>
            </div>
          </div>
          
          {error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
              <p className="text-red-600 font-medium text-center">{error}</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-xl border border-indigo-100 text-center">
              <FaReceipt className="text-5xl text-indigo-400 mx-auto mb-6" />
              <p className="text-xl text-gray-600 font-medium">
                {searchTerm ? "No payment records match your search." : "No payment records found."}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")} 
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Veterinarian</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Service</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => {
                      const user = payment.userId?.name || payment.userId?.email || "User";
                      const vet = payment.bookingId?.veterinarianId?.name || payment.metadata?.veterinarianName || "Veterinarian";
                      const service = payment.metadata?.service || payment.bookingId?.service || "Service";
                      const date = new Date(payment.createdAt).toLocaleDateString();
                      return (
                        <tr key={payment._id} className="hover:bg-indigo-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user}</div>
                            <div className="text-xs text-gray-500">{payment.userId?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vet}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{service}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-indigo-700">${payment.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {payment.status || "Succeeded"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayments; 