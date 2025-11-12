import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Search, SortAsc, SortDesc, Layers, Plus, Archive } from "lucide-react";
import API from "../api/api";
import NoteCreator from "../components/NoteCreator";
import NoteCard from "../components/NoteCard";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function NoteDashboard() {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [showCreatorModal, setShowCreatorModal] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    // Load notes
    const loadNotes = async () => {
        setLoading(true);
        try {
            const res = await API.get("/notes");
            setNotes(res.data || []);
        } catch (err) {
            console.error("Failed to load notes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const add = (n) => setNotes((p) => [n, ...p]);
    const update = (n) => setNotes((p) => p.map((x) => (x._id === n._id ? n : x)));
    const remove = (id) => setNotes((p) => p.filter((x) => x._id !== id));

    const filtered = notes
        .filter((note) => !note.isTrashed) // Hide trashed notes from main view
        .filter(
            (note) =>
                note.title?.toLowerCase().includes(search.toLowerCase()) ||
                note.content?.toLowerCase().includes(search.toLowerCase()) ||
                note.label?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) =>
            sort === "newest"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt)
        );


    // Keyboard shortcut: N for new note
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "n" && (document.activeElement?.tagName ?? "") !== "INPUT") {
                setShowCreatorModal(true);
            }
            if (e.key === "Escape") setShowCreatorModal(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="min-h-screen bg-transparent text-gray-200 flex flex-col">
            <Navbar />

            {/* Header Controls - Archive Style */}
            <div className="max-w-6xl mx-auto w-full px-4 mt-24">
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4"
                >
                    {/* Search + Sort Together */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Search Bar */}
                        <div className="relative w-64 sm:w-80">
                            <div
                                className="flex items-center gap-2 w-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] 
                     rounded-full px-4 py-2 transition-all duration-300 border border-gray-100/70 
                     hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                            >
                                <Search className="w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-transparent outline-none text-gray-700 placeholder-gray-400 w-full text-sm"
                                />
                            </div>

                            {/* ✅ Glow layer — fixed with pointer-events-none */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 hover:opacity-20 blur-md transition-all pointer-events-none"></div>
                        </div>

                        {/* Sort Button */}
                        <button
                            onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
                            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
                   bg-gradient-to-r from-indigo-400 to-pink-400 text-white shadow-md 
                   hover:shadow-lg transition-all duration-300"
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
                    </div>
                </motion.div>
            </div>

            {/* Note Creator Modal */}
            <AnimatePresence>
                {showCreatorModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowCreatorModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: -15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="max-w-xl w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                                <NoteCreator
                                    onCreate={(n) => {
                                        add(n);
                                        setShowCreatorModal(false);
                                        setTimeout(() => containerRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
                                    }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notes Grid */}
            <main ref={containerRef} className="flex-grow w-full max-w-6xl mx-auto px-4 mt-8 mb-12">
                <motion.div layout className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <AnimatePresence>
                        {loading ? (
                            <motion.p
                                key="loading"
                                className="col-span-full text-center text-gray-400 mt-24"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                Loading notes...
                            </motion.p>
                        ) : filtered.length === 0 ? (
                            <motion.p
                                key="empty"
                                className="col-span-full text-center text-gray-400 mt-24 flex items-center justify-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Layers className="w-5 h-5 opacity-70" />
                                No notes found — try another search or create one.
                            </motion.p>
                        ) : (
                            filtered.map((note) => (
                                <motion.div
                                    key={note._id}
                                    layout
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <NoteCard note={note} onUpdate={update} onDelete={remove} />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>

            {/* Floating Buttons */}
            <div className="fixed right-6 bottom-6 z-40 flex flex-col items-end gap-4">
                {/* Trash Button */}
                <motion.button
                    onClick={() => navigate("/trash")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium 
                   bg-gradient-to-r from-red-500 to-orange-500 text-white 
                   shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_35px_rgba(239,68,68,0.5)] 
                   transition-all duration-300"
                >
                    <Trash2 className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-semibold">Trash</span>
                </motion.button>

                {/* Archived Notes Button */}
                <motion.button
                    onClick={() => navigate("/archive")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-500 
                     text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.5)] 
                     transition-all duration-300"
                >
                    <Archive className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-semibold">Archived</span>
                </motion.button>

                {/* New Note Button */}
                <motion.button
                    onClick={() => setShowCreatorModal(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Add note"
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 
                     text-white px-5 py-3 rounded-full shadow-[0_0_25px_rgba(99,102,241,0.4)] 
                     hover:shadow-[0_0_35px_rgba(236,72,153,0.5)] transition-all duration-300"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-semibold">New Note</span>
                </motion.button>
            </div>
        </div>
    );
}
