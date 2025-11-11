import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SortAsc, SortDesc, Package } from "lucide-react";
import API from "../api/api";
import NoteCard from "../components/NoteCard";
import Navbar from "../components/Navbar";

export default function ArchivePage() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  const loadArchivedNotes = async () => {
    try {
      const res = await API.get("/notes/archived");
      setNotes(res.data);
    } catch (err) {
      console.error("Error loading archived notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchivedNotes();
  }, []);

  const update = (note) =>
    setNotes((prev) => prev.map((n) => (n._id === note._id ? note : n)));

  const remove = (id) => setNotes((prev) => prev.filter((n) => n._id !== id));

  const filteredNotes = notes
    .filter(
      (n) =>
        n.title?.toLowerCase().includes(search.toLowerCase()) ||
        n.content?.toLowerCase().includes(search.toLowerCase()) ||
        n.label?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <div className="min-h-screen text-gray-100 flex flex-col bg-transparent">
      <Navbar />

      {/* Header */}
      <motion.div
        className="max-w-6xl mx-auto w-full px-4 mt-24 mb-8 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          Archived Notes
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          All your stored treasures, neatly packed 📦
        </p>
      </motion.div>

      {/* Search + Sort Bar */}
      <motion.div
        className="max-w-4xl mx-auto w-full flex items-center justify-center gap-3 px-4 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Search Bar */}
        <div className="relative flex items-center w-72 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300">
          <Search className="w-4 h-4 text-gray-300 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-gray-100 placeholder-gray-400 w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort Button */}
        <button
          onClick={() => setSort(sort === "newest" ? "oldest" : "newest")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/80 to-pink-500/80 hover:from-indigo-500 hover:to-pink-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
        >
          {sort === "newest" ? (
            <>
              <SortDesc className="w-4 h-4" /> Newest
            </>
          ) : (
            <>
              <SortAsc className="w-4 h-4" /> Oldest
            </>
          )}
        </button>
      </motion.div>

      {/* Notes Section */}
      <div className="flex-grow w-full max-w-6xl mx-auto px-4 mb-12">
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence>
            {loading ? (
              <motion.p
                key="loading"
                className="col-span-full text-center text-gray-400 mt-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Loading archived notes...
              </motion.p>
            ) : filteredNotes.length === 0 ? (
              <motion.div
                key="empty"
                className="col-span-full flex flex-col items-center justify-center text-gray-400 mt-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Package className="w-10 h-10 opacity-70 mb-3" />
                <p className="text-lg font-medium">No archived notes found</p>
                <p className="text-sm text-gray-500 mt-1">
                  You can always unarchive notes to move them back.
                </p>
              </motion.div>
            ) : (
              filteredNotes.map((note) => (
                <motion.div
                  key={note._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <NoteCard note={note} onUpdate={update} onDelete={remove} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
