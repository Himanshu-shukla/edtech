import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, FileQuestion } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-orange-500/30 flex flex-col">
      <Navbar />
      
      <main className="relative flex-grow flex items-center justify-center overflow-hidden pt-20">
        
        {/* --- Background Atmosphere --- */}
        <div className="absolute inset-0 z-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {/* Radial Gradient Spotlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-500/10 via-zinc-950 to-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        </div>

        {/* --- Main Content --- */}
        <div className="relative z-10 w-full max-w-3xl px-6 text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Massive 404 Text */}
            <h1 className="text-[150px] md:text-[250px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-800 to-zinc-950/20 select-none">
              404
            </h1>

            {/* Floating Icon Overlay */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center shadow-2xl shadow-orange-500/10 rotate-12">
                <FileQuestion className="w-12 h-12 md:w-16 md:h-16 text-orange-400" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative -mt-4 md:-mt-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 max-w-lg mx-auto mb-10 leading-relaxed">
              It looks like you've ventured into uncharted territory. The page you are looking for might have been moved or deleted.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/" 
                className="group relative overflow-hidden px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Home className="w-4 h-4" /> Go Home
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
              </Link>
              
              <Link 
                to="/programs" 
                className="px-8 py-4 rounded-full border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Browse Programs
              </Link>
            </div>
          </motion.div>

          {/* Decorative Divider */}
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent max-w-sm mx-auto mt-16" 
          />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
             <Link to="/" className="text-zinc-500 hover:text-emerald-400 text-sm flex items-center justify-center gap-2 transition-colors">
               <ArrowLeft className="w-3 h-3" /> Back to Safety
             </Link>
          </motion.div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}