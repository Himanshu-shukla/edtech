import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, ChevronDown, Sparkles, ArrowRight, Zap, 
  GraduationCap, Phone 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import WhiteLogo from "../assets/WHITE-LOGO--300x152.png";
import { getCoursesData } from "../utils/dataAdapter";
import { useContactModal } from "../contexts/ContactModalContext";
import type { Course } from "../types";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { openModal } = useContactModal();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCoursesData();
        setCourses(data);
      } catch (error) {
        console.error('Error loading courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const displayedCourses = courses.slice(0, 4);

  return (
    <>
      {/* --- Top Banner --- */}
      <div className="relative bg-zinc-950 border-b border-white/10 text-center py-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-emerald-900/20 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-zinc-300">
          <Sparkles className="w-3 h-3 text-emerald-400 hidden sm:block" />
          <span>
            <span className="hidden sm:inline text-zinc-400">Ready to level up? Master in-demand tech skills & </span>
            <span className="text-white">fast-track your career</span> 🚀
          </span>
          <span className="mx-2 text-zinc-700 hidden sm:inline">|</span>
          <button 
            onClick={() => openModal()}
            className="group flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-bold underline decoration-emerald-500/30 underline-offset-4"
          >
            Claim FREE strategy call
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* --- Main Navbar --- */}
      <nav 
        className={cn(
          "fixed inset-x-0 top-[37px] sm:top-[41px] z-50 border-b transition-all duration-300",
          scrolled 
            ? "bg-zinc-950/80 backdrop-blur-xl border-white/10 py-2 shadow-lg shadow-black/20" 
            : "bg-transparent border-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 relative z-50 group">
            <img 
              src={WhiteLogo} 
              alt="EdTech Informative" 
              className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity" 
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/">Home</NavLink>
            
            {/* Dropdown Trigger */}
            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <button 
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium transition-colors outline-none",
                  coursesDropdownOpen ? "text-orange-500" : "text-zinc-400 hover:text-white"
                )}
              >
                Programs
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", coursesDropdownOpen && "rotate-180")} />
              </button>
              
              {/* Dropdown Content */}
              <AnimatePresence>
                {coursesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[400px]"
                  >
                    {/* Invisible Bridge */}
                    <div className="absolute top-0 left-0 w-full h-6" />

                    <div className="relative bg-zinc-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                      {/* Decoration */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="p-5 border-b border-white/5">
                        <h3 className="text-white font-bold flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-500" />
                          Popular Programs
                        </h3>
                        <p className="text-zinc-500 text-xs mt-1">Industry-leading certification programs</p>
                      </div>
                      
                      <div className="p-2 grid gap-1">
                        {loading ? (
                          <div className="p-4 text-center text-zinc-500 text-sm">Loading...</div>
                        ) : displayedCourses.length === 0 ? (
                          <div className="p-4 text-center text-zinc-500 text-sm">No programs available</div>
                        ) : (
                          displayedCourses.map((course) => (
                            <Link 
                              key={course.id} 
                              to={`/program/${course.id}`}
                              className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner",
                                course.accent === 'edtech-green' ? 'bg-emerald-500/20 text-emerald-400' : 
                                course.accent === 'edtech-orange' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-red-500/20 text-red-400'
                              )}>
                                <GraduationCap className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h4 className="text-zinc-200 text-sm font-semibold group-hover:text-orange-400 transition-colors line-clamp-1">
                                    {course.title}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={cn(
                                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
                                    course.badge === 'FEATURED' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                    course.badge === 'TRENDING' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                    course.badge === 'MOST POPULAR' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' : 
                                    'hidden'
                                  )}>
                                    {course.badge}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                      
                      <div className="p-3 bg-zinc-950/50 border-t border-white/5">
                        <Link 
                          to="/programs" 
                          className="flex items-center justify-center gap-2 text-xs font-medium text-zinc-400 hover:text-white py-2 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          View All Programs
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact" onClick={openModal}>Contact</NavLink>
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => openModal()}
              className="hidden md:flex relative overflow-hidden group rounded-lg bg-white px-5 py-2.5 transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-white to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2 text-sm font-bold text-black">
                <Phone className="w-4 h-4 fill-current" />
                Book Strategy Call
              </span>
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* --- Mobile Menu --- */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-zinc-950 border-b border-white/10"
            >
              <div className="px-6 py-6 space-y-4">
                <MobileLink to="/" onClick={() => setMobileOpen(false)}>Home</MobileLink>
                <MobileLink to="/programs" onClick={() => setMobileOpen(false)}>All Programs</MobileLink>
                <MobileLink to="/pricing" onClick={() => setMobileOpen(false)}>Pricing</MobileLink>
                <MobileLink to="/about" onClick={() => setMobileOpen(false)}>About</MobileLink>
                <MobileLink to="/contact" onClick={() => { setMobileOpen(false); openModal(); }}>Contact Us</MobileLink>
                
                <div className="pt-4 mt-4 border-t border-white/10">
                  <button 
                    onClick={() => {
                      setMobileOpen(false);
                      openModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-3 rounded-xl font-bold active:scale-95 transition-transform"
                  >
                    <Phone className="w-4 h-4" />
                    Book FREE Strategy Call
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

// --- Helper Components ---

function NavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="block text-lg font-medium text-zinc-300 hover:text-white hover:translate-x-2 transition-all"
    >
      {children}
    </Link>
  );
}