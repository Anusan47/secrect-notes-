import React from "react";
import { motion } from "framer-motion";
import { Archive, Trash2 } from "lucide-react";
import API from "../api/api";

export default function NoteCard({ note, onUpdate, onDelete }) {
    const toggleArchive = async () => {
        try {
            const res = await API.put(`/notes/${note._id}`, {
                isArchived: !note.isArchived,
            });
            onUpdate(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const moveToTrash = async () => {
        try {
            const res = await API.put(`/notes/${note._id}/trash`);
            onDelete(note._id); // Remove from UI immediately
        } catch (err) {
            console.error("Failed to move to trash:", err);
        }
    };



    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative p-5 rounded-3xl backdrop-blur-2xl 
                 border border-white/20 bg-white/10 shadow-lg overflow-hidden 
                 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(99,102,241,0.4)]"
            style={{
                backgroundColor: note.color || "rgba(255,255,255,0.15)",
            }}
        >
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-xl transition-all"></div>

            <div className="relative z-10">
                {note.title && (
                    <h3 className="text-lg font-semibold text-white mb-2">
                        {note.title}
                    </h3>
                )}

                {note.label && (
                    <span className="inline-block bg-indigo-600/30 text-indigo-100 text-xs font-medium px-2 py-1 rounded-full mb-2">
                        #{note.label}
                    </span>
                )}

                <p className="text-black whitespace-pre-line leading-relaxed mb-4">
                    {note.content}
                </p>

                <div className="flex justify-end gap-3">
                    <motion.button
                        onClick={toggleArchive}
                        whileHover={{ scale: 1.1 }}
                        className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl border border-white/20 
                        backdrop-blur-md transition-all ${note.isArchived
                                ? "text-green-400 bg-green-500/10 hover:bg-green-500/20"
                                : "text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20"
                            }`}
                    >
                        <Archive size={15} />
                        {note.isArchived ? "Unarchive" : "Archive"}
                    </motion.button>

                    <motion.button
                        onClick={moveToTrash}
                        whileHover={{ scale: 1.1 }}
                        className="text-sm text-yellow-600 bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-lg 
             border border-white/30 hover:bg-white/60 transition-all"
                    >
                        Move to Trash
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
