import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import AdminNavbar from "../AdminNavbar";
import useUserInfo from "../../../hooks/userUserInfo";

const UserList = () => {
  const [search, setSearch] = useState("");
  const { users, error } = useUserInfo();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminNavbar />
      <motion.div
        className="flex-1 p-8 mx-auto bg-white min-h-screen rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User List</h1>
        <div className="flex items-center mb-6 bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-300">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none focus:ring-0 w-full text-lg p-2 outline-none bg-transparent"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {error ? (
            <motion.p
              className="text-center text-red-500 col-span-full text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Error: {error}
            </motion.p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:border-blue-500 transition-all duration-300"
              >
                <img
                  src={user.avatar || "https://i.pravatar.cc/150"}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-300"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              className="text-center text-gray-500 col-span-full text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No users found.
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserList;