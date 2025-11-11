import React, { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function Profile() {
  const { user } = useContext(AuthContext);


  const initials = user?.email
    ? user.email
        .split("@")[0]
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen   text-gray-800">
      <Navbar />

      {/* Glass Container */}
      <motion.div
        className="max-w-3xl mx-auto mt-24 mb-12 p-10 bg-white backdrop-blur-2xl border border-white/30 
                   rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.37)] text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Avatar Section */}
        <motion.div
          className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex 
                     items-center justify-center text-white text-3xl font-bold shadow-md mb-6"
          whileHover={{ scale: 1.05 }}
        >
          {initials}
        </motion.div>

        <h1 className="text-2xl font-semibold mb-1 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          {user?.email || "Unknown User"}
        </h1>
        <p className="text-gray-600 text-sm mb-8">
          Welcome to your secure space — your data is fully encrypted 🔐
        </p>

        {/* Info Section */}
        <div className="grid sm:grid-cols-2 gap-6 text-left">
          <div className="p-5 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40">
            <h3 className="text-sm text-gray-500 mb-1">User ID</h3>
            <p className="font-medium break-words">{user?.id || "N/A"}</p>
          </div>

          <div className="p-5 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40">
            <h3 className="text-sm text-gray-500 mb-1">Account Created</h3>
            <p className="font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div className="p-5 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 sm:col-span-2">
            <h3 className="text-sm text-gray-500 mb-1">Status</h3>
            <p className="font-medium text-green-600">Active Account</p>
          </div>
        </div>

        {/* Footer Message */}
        <motion.div
          className="mt-10 text-gray-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Thank you for trusting <span className="font-semibold text-indigo-500"> Notes</span>.  
          <br />
          Your privacy is our top priority.
        </motion.div>
      </motion.div>
    </div>
  );
}
