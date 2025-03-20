import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import AdminNavbar from "../AdminNavbar";
import useUserInfo from "../../../hooks/userUserInfo";

const UserList = () => {
  const [search, setSearch] = useState("");
  const { users, error } = useUserInfo();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
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
              <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 text-transparent bg-clip-text">
                User List
              </h1>
            </div>
            
            <div className="relative w-full md:w-72 lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-indigo-500" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-full border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 shadow-sm text-gray-700"
              />
            </div>
          </div>

          {error ? (
            <motion.div
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-red-700 font-medium">Error: {error}</p>
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
                  whileHover={{ y: -5 }}
                  className="relative overflow-hidden rounded-xl bg-white shadow-xl border-t border-l border-indigo-50"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-indigo-400 to-purple-400 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                        <p className="text-indigo-600">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg border border-indigo-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-indigo-50 p-4 rounded-full mb-4">
                <Users className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-xl text-gray-500 font-medium">No users found</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserList;