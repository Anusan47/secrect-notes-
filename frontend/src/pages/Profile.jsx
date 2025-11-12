import React, { useContext, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import API from "../api/api";
import { Lock, LogOut, XCircle, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const fileInputRef = useRef(null);

  const initials = user?.email
    ? user.email.split("@")[0].substring(0, 2).toUpperCase()
    : "U";

  // 🔐 Modal Control
  const [showModal, setShowModal] = useState(false);

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Handle profile photo change
  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await API.put("/auth/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfilePic(res.data.profilePic);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  // ✅ Password Reset Handler
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword === currentPassword) {
      setError("⚠️ New password cannot be the same as the current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("⚠️ New password and confirmation do not match.");
      return;
    }

    try {
      const res = await API.put("/auth/reset-password", {
        currentPassword,
        newPassword,
      });
      setSuccess(res.data.message || "Password updated successfully!");
      setTimeout(() => setShowModal(false), 1200);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await API.put("/auth/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfilePic(res.data.profilePic);
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to upload photo");
    }
  };


  return (
    <div className="min-h-screen text-gray-800">
      <Navbar />

      <motion.div
        className="max-w-3xl mx-auto mt-24 mb-12 p-10 bg-white/60 backdrop-blur-2xl border border-white/30 
                   rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.37)] text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Profile Photo */}
        <div className="relative w-32 h-32 mx-auto">
          <img
            src={profilePic || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
          />
          <label className="absolute bottom-0 right-0 bg-indigo-500 p-2 rounded-full cursor-pointer hover:bg-indigo-600">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a1 1 0 01.993.883L11 3v4h4a1 1 0 01.117 1.993L15 9h-4v4a1 1 0 01-1.993.117L9 13V9H5a1 1 0 01-.117-1.993L5 7h4V3a1 1 0 011-1z" />
            </svg>
          </label>
        </div>


        {/* User Info */}
        <h1 className="text-2xl font-semibold mb-1 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          {user?.email || "Unknown User"}
        </h1>
        <p className="text-gray-600 text-sm mb-8">
          Welcome to your secure space — your data is fully encrypted 🔐
        </p>

        {/* Info Boxes */}
        <div className="grid sm:grid-cols-2 gap-6 text-left mb-10">
          <div className="p-5 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40">
            <h3 className="text-sm text-gray-500 mb-1">User ID</h3>
            <p className="font-medium break-words">{user?.id || "N/A"}</p>
          </div>

          <div className="p-5 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40">
            <h3 className="text-sm text-gray-500 mb-1">Account Created</h3>
            <p className="font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-full 
                       bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold 
                       shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] transition-all"
          >
            <Lock className="w-5 h-5" /> Reset Password
          </motion.button>

          <motion.button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-full 
                       bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold 
                       shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </motion.button>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-10 text-gray-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Thank you for trusting <span className="font-semibold text-indigo-500">Secure Notes</span>.
          <br />
          Your privacy is our top priority.
        </motion.div>
      </motion.div>

      {/* 🔒 Reset Password Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-2xl rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500" /> Reset Password
              </h2>

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full border rounded-lg p-2 outline-none focus:ring-2 ${newPassword === currentPassword && newPassword
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-indigo-400"
                      }`}
                    required
                  />
                  {newPassword === currentPassword && newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      ⚠️ New password cannot be same as old one.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm">❌ {error}</p>}
                {success && <p className="text-green-500 text-sm">✅ {success}</p>}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Update Password
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
