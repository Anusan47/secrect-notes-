// src/components/Loader.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 select-none">
      {/* Glowing gradient ring animation */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1.1, 0.8] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        {/* Gradient circle */}
        <div className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-md opacity-70 animate-pulse" />
        {/* Center white dot */}
        <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
      </motion.div>

      {/* Loading text animation */}
      <motion.p
        className="mt-6 text-lg font-medium bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        {text}
      </motion.p>
    </div>
  );
}
