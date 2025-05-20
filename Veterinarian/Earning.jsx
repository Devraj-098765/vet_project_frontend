import React, { useEffect, useState } from "react";
import SideBarVeterinarian from "./SideBarVeterinarian/SideBarVeterinarian";
import axiosInstance from "../src/api/axios";
import { FiDollarSign, FiCalendar, FiSearch, FiBarChart2, FiFilter, FiCreditCard, FiArrowUp } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Earning = () => {
  const [earnings, setEarnings] = useState([]);
  const [filteredEarnings, setFilteredEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [showChart, setShowChart] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axiosInstance.get("/payments/veterinarian/earnings");
        setEarnings(data || []);
        setFilteredEarnings(data || []);
      } catch (err) {
        console.error("Error fetching earnings:", err);
        setError("Failed to load earnings");
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  useEffect(() => {
    let results = [...earnings];
    
    if (searchTerm) {
      results = results.filter(item => 
        (item.userName && item.userName.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (item.service && item.service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    const now = new Date();
    if (periodFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      results = results.filter(item => new Date(item.date) >= weekAgo);
    } else if (periodFilter === "month") {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      results = results.filter(item => new Date(item.date) >= monthAgo);
    } else if (periodFilter === "year") {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      results = results.filter(item => new Date(item.date) >= yearAgo);
    }
    
    results.sort((a, b) => {
      let comparison = 0;
      if (sortConfig.key === "date") {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortConfig.key === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortConfig.key === "client") {
        comparison = (a.userName || "").localeCompare(b.userName || "");
      } else if (sortConfig.key === "service") {
        comparison = (a.service || "").localeCompare(b.service || "");
      }
      
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
    
    setFilteredEarnings(results);
  }, [earnings, searchTerm, periodFilter, sortConfig]);

  const totalEarning = filteredEarnings.reduce((sum, item) => sum + (item.amount || 0), 0);
  
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getChartData = () => {
    const monthlyData = {};
    
    earnings.forEach(item => {
      if (!item.date) return;
      
      const date = new Date(item.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += (item.amount || 0);
    });
    
    return Object.entries(monthlyData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.name.split(' ');
        const [bMonth, bYear] = b.name.split(' ');
        return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
      });
  };

  const getServiceData = () => {
    const serviceData = {};
    
    filteredEarnings.forEach(item => {
      if (!item.service) return;
      
      if (!serviceData[item.service]) {
        serviceData[item.service] = 0;
      }
      serviceData[item.service] += (item.amount || 0);
    });
    
    return Object.entries(serviceData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const chartData = getChartData();
  const serviceData = getServiceData();
  const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1', '#F06292', '#3A86FF', '#8D6E63', '#43AA8B', '#F94144'];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-blue-50/50">
      <SideBarVeterinarian />
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-teal-800">Earnings Dashboard</h1>
            <p className="text-teal-600 mt-1">Track, analyze and manage your income</p>
          </div>

          <div className="mb-6 flex border-b border-teal-200">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 font-medium text-sm flex items-center ${
                activeTab === "overview" 
                  ? "text-teal-700 border-b-2 border-teal-600" 
                  : "text-teal-600 hover:text-teal-700"
              }`}
            >
              <FiBarChart2 className="mr-2" />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("transactions")}
              className={`px-4 py-2 font-medium text-sm flex items-center ${
                activeTab === "transactions" 
                  ? "text-teal-700 border-b-2 border-teal-600" 
                  : "text-teal-600 hover:text-teal-700"
              }`}
            >
              <FiCreditCard className="mr-2" />
              Transactions
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-60 bg-white rounded-xl shadow-sm">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-teal-700">Loading your earnings...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-6 rounded-xl shadow-sm m-6 text-center border border-red-100">
              <p className="font-medium">{error}</p>
              <button 
                className="mt-2 px-4 py-2 bg-white border border-red-300 rounded-lg hover:bg-red-50 text-red-600"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-teal-100 transition-all duration-200 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-teal-600 text-sm">Total Earnings</p>
                      <p className="text-2xl font-bold text-teal-800 mt-1">${totalEarning.toFixed(2)}</p>
                    </div>
                    <div className="bg-teal-100 p-2 rounded-lg">
                      <FiDollarSign className="text-teal-600 text-xl" />
                    </div>
                  </div>
                  <div className="text-xs text-teal-600 mt-3 flex items-center">
                    <span className="text-emerald-500 flex items-center mr-1">
                      <FiArrowUp className="mr-1" size={10} /> 2.5%
                    </span>
                    vs previous period
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-teal-100 transition-all duration-200 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-teal-600 text-sm">Transactions</p>
                      <p className="text-2xl font-bold text-teal-800 mt-1">{filteredEarnings.length}</p>
                    </div>
                    <div className="bg-teal-100 p-2 rounded-lg">
                      <FiCreditCard className="text-teal-600 text-xl" />
                    </div>
                  </div>
                  <div className="text-xs text-teal-600 mt-3 flex items-center">
                    <span className="text-emerald-500 flex items-center mr-1">
                      <FiArrowUp className="mr-1" size={10} /> 4.7%
                    </span>
                    vs previous period
                  </div>
                </div>
              </div>

              {activeTab === "overview" ? (
                <>
                  <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-teal-100 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-teal-500" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-teal-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Search client or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiFilter className="text-teal-500" />
                        </div>
                        <select
                          className="block w-full pl-10 pr-10 py-2 border border-teal-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 appearance-none"
                          value={periodFilter}
                          onChange={(e) => setPeriodFilter(e.target.value)}
                        >
                          <option value="all">All Time</option>
                          <option value="week">Last Week</option>
                          <option value="month">Last Month</option>
                          <option value="year">Last Year</option>
                        </select>
                      </div>
                      <button
                        className={`p-2 rounded-lg flex items-center justify-center ${showChart 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-white text-teal-600 border border-teal-200'}`}
                        onClick={() => setShowChart(!showChart)}
                        title="Toggle chart view"
                      >
                        <FiBarChart2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-teal-100 lg:col-span-2">
                      <h3 className="text-lg font-semibold text-teal-800 mb-4">
                        Earnings Over Time
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2f1" vertical={false} />
                            <XAxis dataKey="name" stroke="#0d9488" />
                            <YAxis stroke="#0d9488" />
                            <Tooltip 
                              formatter={(value) => [`$${value.toFixed(2)}`, 'Earnings']}
                              contentStyle={{ 
                                backgroundColor: '#ffffff', 
                                borderColor: '#99f6e4',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#0d9488" 
                              strokeWidth={2}
                              fill="url(#colorValue)" 
                              activeDot={{ r: 8, fill: '#0f766e' }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-teal-100">
                      <h3 className="text-lg font-semibold text-teal-800 mb-4">
                        Earnings by Service
                      </h3>
                      <div className="h-64 flex justify-center items-center">
                        {serviceData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={serviceData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#0d9488"
                                dataKey="value"
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {serviceData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                                contentStyle={{ 
                                  backgroundColor: '#ffffff', 
                                  borderColor: '#99f6e4',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-teal-600 text-center">No service data available</div>
                        )}
                      </div>
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-3 justify-center">
                          {serviceData.length > 0 && serviceData.slice(0, Math.min(8, serviceData.length)).map((entry, index) => (
                            <div key={`legend-${index}`} className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-1" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></div>
                              <span className="text-xs text-gray-700">{entry.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-teal-100 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-teal-500" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-teal-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Search client or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFilter className="text-teal-500" />
                      </div>
                      <select
                        className="block w-full pl-10 pr-10 py-2 border border-teal-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 appearance-none"
                        value={periodFilter}
                        onChange={(e) => setPeriodFilter(e.target.value)}
                      >
                        <option value="all">All Time</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="year">Last Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-teal-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-teal-100">
                      <h3 className="text-lg font-semibold text-teal-800 flex items-center">
                        <FiCreditCard className="mr-2 text-teal-600" />
                        Transaction History
                        <span className="ml-2 text-sm font-normal text-teal-600">
                          ({filteredEarnings.length} transactions)
                        </span>
                      </h3>
                    </div>
                    
                    {filteredEarnings.length === 0 ? (
                      <div className="text-center py-12">
                        <FiDollarSign className="mx-auto text-4xl text-teal-300 mb-2" />
                        <p className="text-teal-800 font-medium">No transactions found</p>
                        <p className="text-teal-600 text-sm mt-1">
                          {searchTerm ? "Try adjusting your search or filters" : "Your earnings will appear here"}
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-teal-100">
                          <thead className="bg-teal-50">
                            <tr>
                              <th 
                                className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider cursor-pointer hover:bg-teal-100"
                                onClick={() => handleSort("date")}
                              >
                                <div className="flex items-center">
                                  Date
                                  {sortConfig.key === "date" && (
                                    <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                                  )}
                                </div>
                              </th>
                              <th 
                                className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider cursor-pointer hover:bg-teal-100"
                                onClick={() => handleSort("client")}
                              >
                                <div className="flex items-center">
                                  Client
                                  {sortConfig.key === "client" && (
                                    <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                                  )}
                                </div>
                              </th>
                              <th 
                                className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider cursor-pointer hover:bg-teal-100"
                                onClick={() => handleSort("service")}
                              >
                                <div className="flex items-center">
                                  Service
                                  {sortConfig.key === "service" && (
                                    <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                                  )}
                                </div>
                              </th>
                              <th 
                                className="px-6 py-3 text-right text-xs font-medium text-teal-700 uppercase tracking-wider cursor-pointer hover:bg-teal-100"
                                onClick={() => handleSort("amount")}
                              >
                                <div className="flex items-center justify-end">
                                  Amount
                                  {sortConfig.key === "amount" && (
                                    <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                                  )}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-teal-100">
                            {filteredEarnings.map((item, idx) => (
                              <tr key={item.paymentId || idx} className="hover:bg-teal-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {item.date ? (
                                    <span className="flex items-center">
                                      <FiCalendar className="mr-1 text-teal-500" />
                                      {new Date(item.date).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      })}
                                    </span>
                                  ) : "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">{item.userName || 'Client'}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.service || 'Service'}</td>
                                <td className="px-6 py-4 text-sm text-teal-800 text-right font-semibold">
                                  ${(item.amount || 0).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-teal-50 border-t-2 border-teal-100">
                            <tr>
                              <td colSpan="3" className="px-6 py-4 text-sm font-medium text-teal-700 text-right">
                                Total:
                              </td>
                              <td className="px-6 py-4 text-teal-800 text-right font-bold">
                                ${totalEarning.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Earning;