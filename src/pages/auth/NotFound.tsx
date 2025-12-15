import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e3e8ff] via-[#d5dcff] to-[#cfd9ff]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-10 max-w-lg w-full text-center border border-white/40"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-[#6b7bff]" />
        </div>

        {/* 404 Heading */}
        <h1 className="text-[6rem] font-extrabold text-[#6b7bff] leading-none">404</h1>

        {/* Subtitle */}
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-500 mt-2">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/app/home")}
          className="mt-8 px-8 py-3 bg-[#6b7bff] text-white font-semibold rounded-xl shadow hover:bg-[#5a6eff] transition-all duration-300"
        >
          ⬅ Go Back Home
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
