import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Palette, Tag, X } from "lucide-react";
import API from "../api/api";

export default function NoteCreator({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [label, setLabel] = useState("");
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);

  // Focus textarea when expanded
  useEffect(() => {
    if (expanded && contentRef.current) {
      contentRef.current.focus();
    }
  }, [expanded]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setExpanded(false);
      if (e.ctrlKey && e.key === "Enter") createNote(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const createNote = async (e) => {
    e.preventDefault();
    if (!content.trim() && !title.trim()) return;
    try {
      const res = await API.post("/notes", {
        title,
        content,
        color,
        label,
      });
      onCreate(res.data);
      setTitle("");
      setContent("");
      setColor("#ffffff");
      setLabel("");
      setExpanded(false);
    } catch (err) {
      console.error(err);
    }
  };

  const colors = ["#ffffff", "#fef08a", "#bfdbfe", "#fecaca", "#d9f99d", "#fde68a", "#fbcfe8"];

  return (
    <motion.div
      className="relative mx-auto w-full max-w-xl p-6 rounded-3xl 
                 bg-white backdrop-blur-xl border border-white/100 
                 shadow-[0_8px_32px_rgba(31,38,135,0.25)] transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      layout
    >
      <form onSubmit={createNote} className="space-y-3">
        <AnimatePresence>
          {expanded && (
            <motion.input
              key="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
              className="w-full text-gray-800 font-medium bg-transparent 
                         border-b border-white/30 focus:border-indigo-400 outline-none 
                         pb-1 placeholder-gray-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            />
          )}
        </AnimatePresence>

        <motion.textarea
          ref={contentRef}
          value={content}
          onClick={() => setExpanded(true)}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Take a note..."
          rows={expanded ? 3 : 1}
          className="w-full text-gray-800 bg-transparent resize-none outline-none
                     placeholder-gray-500 focus:border-indigo-400 border-b border-white/30"
          transition={{ layout: { duration: 0.25 } }}
        />

        <AnimatePresence>
          {expanded && (
            <motion.div
              key="controls"
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {/* Color & Label Controls */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Color Picker */}
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-500" />
                  <div className="flex gap-1">
                    {colors.map((c) => (
                      <motion.button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-5 h-5 rounded-full border ${
                          color === c ? "ring-2 ring-indigo-400" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: c }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Label Input */}
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-500" />
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Label..."
                    className="border-b border-white/30 bg-transparent outline-none 
                               placeholder-gray-500 focus:border-indigo-400 text-gray-800 pb-0.5"
                  />
                </div>
              </div>

              {/* Add + Cancel Buttons */}
              <div className="flex gap-2 items-center self-end sm:self-auto">
                <motion.button
                  type="button"
                  onClick={() => setExpanded(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1 text-gray-700 bg-white/40 
                             px-3 py-2 rounded-full text-sm font-medium hover:bg-white/60 transition"
                >
                  <X size={16} /> Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-medium 
                             px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
                >
                  <PlusCircle size={18} /> Add
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
