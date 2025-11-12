import React, { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { LogOut } from "lucide-react";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  const initials = user?.email
    ? user.email
        .split("@")[0]
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen text-gray-800 relative overflow-hidden">
      <Navbar />

      {/* Gradient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-pink-100 to-purple-200 blur-3xl opacity-50 -z-10" />

      {/* Profile Card */}
      <motion.div
        className="max-w-3xl mx-auto mt-28 mb-16 p-10 bg-white/20 backdrop-blur-2xl border border-white/30 
                   rounded-[2.5rem] shadow-[0_8px_50px_rgba(31,38,135,0.2)] text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Avatar Section */}
        <motion.div
          className="mx-auto w-28 h-28 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 
                     flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-6"
          whileHover={{ scale: 1.05 }}
        >
          {initials}
        </motion.div>

        {/* User Info */}
        <h1 className="text-2xl font-semibold mb-1 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          {user?.email || "Unknown User"}
        </h1>
        <p className="text-gray-600 text-sm mb-8">
          Welcome to your secure space — your data is fully encrypted 🔐
        </p>

        {/* Info Grid */}
        <div className="grid sm:grid-cols-2 gap-6 text-left mb-10">
          <div className="p-5 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300">
            <h3 className="text-sm text-gray-500 mb-1">User ID</h3>
            <p className="font-medium break-words">{user?.id || "N/A"}</p>
          </div>

          <div className="p-5 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300">
            <h3 className="text-sm text-gray-500 mb-1">Account Created</h3>
            <p className="font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div className="p-5 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 sm:col-span-2 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300">
            <h3 className="text-sm text-gray-500 mb-1">Status</h3>
            <p className="font-medium text-green-600">Active Account</p>
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-full
                     bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold
                     shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_35px_rgba(239,68,68,0.6)]
                     transition-all duration-300"
        >
          <LogOut className="w-5 h-5" /> Logout
        </motion.button>

        {/* Footer Message */}
        <motion.div
          className="mt-10 text-gray-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Thank you for trusting{" "}
          <span className="font-semibold text-indigo-500">Secure Notes</span>.
          <br />
          Your privacy is our top priority.
        </motion.div>
      </motion.div>
    </div>
  );
}
