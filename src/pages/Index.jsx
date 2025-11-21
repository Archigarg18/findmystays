import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'owner') navigate('/owner/bookings');
      else navigate('/user-dashboard');
    }
  }, [user]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0f1c] via-slate-900 to-[#0f172a] text-white flex flex-col">
      {/* === Animated Background Layer === */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Moving Light Blobs */}
        <motion.div
          className="absolute -top-40 -left-40 w-[35rem] h-[36rem] bg-indigo-500 rounded-full mix-blend-screen filter blur-[180px] opacity-150"
          animate={{
            x: [0, 120, -80, 0],
            y: [0, 100, -60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[-10rem] right-[-10rem] w-[36rem] h-[36rem] bg-pink-500 rounded-full mix-blend-screen filter blur-[180px] opacity-100"
          animate={{
            x: [0, -120, 80, 0],
            y: [0, -60, 60, 0],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-screen filter blur-[200px] opacity-90"
          animate={{
            x: [0, 80, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      </div>

      {/* === Navbar === */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/70 backdrop-blur-lg border-b border-slate-700 shadow-md"
      >
        <Navbar />
      </motion.div>

      {/* === Hero Section === */}
      <main className="flex flex-1 flex-col justify-center items-center text-center px-6 mt-24">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-6"
        >
          Welcome to <span className="text-indigo-400">FindMyStay</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl max-w-2xl mb-10 text-gray-300 leading-relaxed"
        >
          Discover comfortable, affordable, and secure PGs & hostels near you —
          perfect for both{" "}
          <span className="text-indigo-400 font-semibold">Users</span> and{" "}
          <span className="text-pink-400 font-semibold">Owners</span>.
        </motion.p>

        {/* === Buttons === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          {/* User Button */}
          <div className="group relative w-64">
            <div className="absolute inset-0 rounded-2xl bg-indigo-500 blur-xl opacity-40 group-hover:opacity-70 transition-all duration-300"></div>
            <Button
              onClick={() => navigate("/user-login")}
              size="lg"
              className="relative w-full py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-lg transition-all"
            >
              👤 Continue as User
            </Button>
          </div>

          {/* Owner Button */}
          <div className="group relative w-64">
            <div className="absolute inset-0 rounded-2xl bg-pink-500 blur-xl opacity-40 group-hover:opacity-70 transition-all duration-300"></div>
            <Button
              onClick={() => navigate("/owner-login")}
              size="lg"
              className="relative w-full py-6 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg shadow-lg transition-all"
            >
              🏢 Continue as Owner
            </Button>
          </div>
        </motion.div>
      </main>

      {/* === Footer === */}
      <footer className="text-center py-5 text-gray-400 text-sm border-t border-slate-700 backdrop-blur-sm bg-slate-900/30">
        © {new Date().getFullYear()}{" "}
        <span className="text-indigo-400 font-semibold">FindMyStay</span> — All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
