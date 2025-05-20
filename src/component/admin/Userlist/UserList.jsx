import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, X, UserCircle2 } from "lucide-react";
import AdminNavbar from "../AdminNavbar";
import useUserInfo from "../../../hooks/userUserInfo";

const UserList = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const { users, error } = useUserInfo();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex bg-purple-50 min-h-screen text-purple-900">
      <AdminNavbar />
      <div className="flex-1 p-4 md:p-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-purple-300 p-3 rounded-full shadow-lg transform hover:rotate-12 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold text-purple-800 tracking-tight">
                User Directory
              </h1>
            </div>
            <div className="relative w-full md:w-72 lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-full bg-white border-2 border-purple-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 shadow-sm text-purple-900 placeholder-purple-400"
              />
            </div>
          </div>

          {error ? (
            <motion.div
              className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded-md shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-purple-800 font-medium">Error: {error}</p>
            </motion.div>
          ) : filteredUsers.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {filteredUsers.map((user) => (
                <motion.div
                  key={user._id}
                  whileHover={{ y: -10, scale: 1.05 }}
                  onClick={() => handleUserSelect(user)}
                  className="relative overflow-hidden rounded-2xl bg-white shadow-2xl border-2 border-purple-100 cursor-pointer group transform transition-all duration-300 hover:shadow-purple-200"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-purple-800">{user.name}</h3>
                        <p className="text-purple-600">{user.email}</p>
                        <div className="text-sm text-purple-500 mt-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <UserCircle2 className="w-4 h-4 mr-2" />
                          <span>View Details</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl border-2 border-purple-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-purple-100 p-5 rounded-full mb-4 animate-pulse">
                <Users className="w-10 h-10 text-purple-400" />
              </div>
              <p className="text-2xl text-purple-800 font-medium">No users found</p>
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence>
          {selectedUser && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-purple-900 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              onClick={closeUserDetails}
            >
              <motion.div
                initial={{ scale: 0.9, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.9, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative border-4 border-purple-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={closeUserDetails}
                  className="absolute top-4 right-4 text-purple-500 hover:text-purple-700 transition-colors"
                >
                  <X className="w-7 h-7" />
                </button>
                
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold mr-6 text-4xl shadow-lg">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-purple-800">{selectedUser.name}</h2>
                    <p className="text-purple-600">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-2xl p-6 space-y-4 border border-purple-100">
                  <div>
                    <span className="block text-purple-600 font-semibold mb-1">User ID</span>
                    <p className="text-purple-800 bg-white p-3 rounded-lg break-all border border-purple-200 shadow-sm">{selectedUser._id}</p>
                  </div>
                  <div>
                    <span className="block text-purple-600 font-semibold mb-1">User Role</span>
                    <p className="text-purple-800 bg-white p-3 rounded-lg border border-purple-200 shadow-sm">{selectedUser.role || "User"}</p>
                  </div>
                  <div>
                    <span className="block text-purple-600 font-semibold mb-1">Joined Date</span>
                    <p className="text-purple-800 bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                      {new Date(selectedUser.createdAt || Date.now()).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserList;