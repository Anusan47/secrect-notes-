import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RefreshCcw } from "lucide-react";
import API from "../api/api";
import Navbar from "../components/Navbar";

export default function TrashPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch trashed notes
  const loadTrashedNotes = async () => {
    try {
      const res = await API.get("/notes/trash");
      setNotes(res.data || []);
    } catch (err) {
      console.error("Error loading trashed notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrashedNotes();
  }, []);

  // Restore note
  const restoreNote = async (id) => {
    try {
      await API.put(`/notes/${id}/restore`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error restoring note:", err);
    }
  };

  // Permanently delete note
  const deletePermanent = async (id) => {
    try {
      await API.delete(`/notes/${id}/permanent`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error permanently deleting note:", err);
    }
  };

  // Utility: Calculate days left until auto delete (30 days)
  const getDaysLeft = (trashedAt) => {
    if (!trashedAt) return 0;
    const diffDays = Math.floor(
      (Date.now() - new Date(trashedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const remaining = 30 - diffDays;
    return remaining > 0 ? remaining : 0;
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-100">
      <Navbar />

      {/* Page Header */}
      <div className="flex-grow p-6 mt-24">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-red-400 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
            🗑️ Trash Bin
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Deleted notes will be permanently removed after{" "}
            <span className="text-pink-400 font-medium">30 days</span>.
          </p>
        </motion.div>

        {/* Main content */}
        {loading ? (
          <p className="text-center text-gray-400 mt-20">Loading trashed notes...</p>
        ) : notes.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 mt-20"
          >
            Trash is empty 🧹
          </motion.p>
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence>
              {notes.map((note) => {
                const daysLeft = getDaysLeft(note.trashedAt);

                return (
                  <motion.div
                    key={note._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="relative p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 
                               shadow-[0_0_25px_rgba(236,72,153,0.25)] hover:shadow-[0_0_35px_rgba(236,72,153,0.4)] 
                               transition-all duration-300 flex flex-col justify-between"
                    style={{ backgroundColor: note.color || "rgba(255,255,255,0.08)" }}
                  >
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-black mb-2">
                      {note.title || "Untitled Note"}
                    </h3>

                    {/* Auto delete countdown */}
                    <p
                      className={`text-xs font-medium mb-3 ${
                        daysLeft <= 5 ? "text-red-400" : "text-gray-400"
                      }`}
                    >
                      🕒 Auto delete in{" "}
                      <span className="font-semibold text-pink-400">
                        {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                      </span>
                    </p>

                    {/* Content */}
                    <p className="text-black whitespace-pre-line flex-grow mb-4 line-clamp-6">
                      {note.content || "No content available."}
                    </p>

                    {/* Footer: Actions */}
                    <div className="flex justify-between items-center mt-auto pt-2">
                      {/* Restore Button */}
                      <motion.button
                        onClick={() => restoreNote(note._id)}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full 
                                   bg-green-500/70 hover:bg-green-600 text-white text-sm 
                                   shadow-[0_0_10px_rgba(34,197,94,0.4)] transition-all"
                      >
                        <RefreshCcw className="w-4 h-4" /> Restore
                      </motion.button>

                      {/* Delete Icon Button */}
                      <motion.button
                        onClick={() => deletePermanent(note._id)}
                        whileHover={{ scale: 1.15 }}
                        className="p-2 rounded-full bg-red-500/60 hover:bg-red-600 transition-all 
                                   shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
