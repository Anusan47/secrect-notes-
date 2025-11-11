import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Plus, SortAsc, SortDesc, Archive, Trash2 } from "lucide-react";
import API from "../api/api";
import NoteCard from "./NoteCard";
import Navbar from "./Navbar";

export default function NotesGrid() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Update note after edit or archive
  const handleUpdate = (updatedNote) => {
    setNotes((prev) =>
      prev.map((note) => (note._id === updatedNote._id ? updatedNote : note))
    );
  };

  // Delete note
  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((note) => note._id !== id));
  };

  // Filtering + searching
  const filteredNotes = notes
    .filter((note) =>
      filter === "archived" ? note.isArchived : filter === "active" ? !note.isArchived : true
    )
    .filter(
      (note) =>
        note.title?.toLowerCase().includes(search.toLowerCase()) ||
        note.content?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <div className="min-h-screen bg-transparent text-gray-200 relative z-10">
      <Navbar />

      {/* Search and Filters */}
      <div className="max-w-5xl mx-auto mt-24 mb-10 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 
                        backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Search className="text-gray-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              className="bg-transparent outline-none w-full sm:w-80 text-gray-100 placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Buttons */}
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-full text-sm ${
                filter === "all"
                  ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 rounded-full text-sm ${
                filter === "active"
                  ? "bg-gradient-to-r from-green-400 to-teal-500 text-white"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("archived")}
              className={`px-3 py-1.5 rounded-full text-sm ${
                filter === "archived"
                  ? "bg-gradient-to-r from-yellow-500 to-orange-400 text-white"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              Archived
            </button>

            {/* Sort toggle */}
            <button
              onClick={() =>
                setSort((prev) => (prev === "newest" ? "oldest" : "newest"))
              }
              className="px-3 py-1.5 rounded-full bg-white/10 text-gray-300 flex items-center gap-2 hover:bg-white/20 transition"
            >
              {sort === "newest" ? (
                <>
                  <SortDesc size={16} /> Newest
                </>
              ) : (
                <>
                  <SortAsc size={16} /> Oldest
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <motion.div
        layout
        className="max-w-6xl mx-auto px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {loading ? (
            <p className="text-center text-gray-400 w-full col-span-full">Loading notes...</p>
          ) : filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <motion.div
                key={note._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <NoteCard note={note} onUpdate={handleUpdate} onDelete={handleDelete} />
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              No notes found. Try adjusting your filters or search.
            </p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
