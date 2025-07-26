"use client";
import { motion } from "framer-motion";

const FullPageLoader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black">
      <motion.div
        className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 shadow-lg"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default FullPageLoader;
