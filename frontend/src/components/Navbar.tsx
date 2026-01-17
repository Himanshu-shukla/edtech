import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WhiteLogo from "../assets/WHITE-LOGO--300x152.png";
import { getCoursesData } from "../utils/dataAdapter";
import { useContactModal } from "../contexts/ContactModalContext";
import type { Course } from "../types";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { openModal } = useContactModal();

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
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/30 bg-bg-deep/95 backdrop-blur-lg">
      <div className="bg-edtech-green text-black text-center py-2 text-sm">
        <span className="flex items-center justify-center gap-2">
          <span className="hidden sm:inline">✨ Ready to level up? Master in-demand tech skills & fast-track your career 🚀 -  </span>
          <button 
            onClick={() => openModal()}
            className="underline hover:text-black/70 transition-colors cursor-pointer font-bold"
          >
            Claim your FREE strategy call now! →
          </button>
        </span>
      </div>
      <div className="w-full px-6 h-16 flex items-center justify-between">
        {/* Logo - Left */}
        <Link to="/" className="flex items-center gap-3 ml-6">
          <img src={WhiteLogo} alt="EdTech Informative" className="h-12 w-auto" />
          <span className="sr-only">EdTech Informative</span>
        </Link>
        
        {/* Navigation - Center */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-white/90">
          <Link to="/" className="hover:text-edtech-orange transition-colors font-semibold">Home</Link>
          
          {/* Courses Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setCoursesDropdownOpen(true)}
            onMouseLeave={() => setCoursesDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-edtech-orange transition-colors group font-semibold">
              Programs
              <svg 
                className={`w-4 h-4 ml-1 transition-transform duration-200 ${coursesDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {coursesDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-80">
                {/* Invisible bridge to maintain hover */}
                <div className="h-2 w-full"></div>
                
                <div className="bg-bg-deep/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl p-6 animate-fadeIn">
                  <div className="mb-4">
                    <h3 className="text-white font-bold text-base mb-1">Popular Programs</h3>
                    <p className="text-white/60 text-sm font-medium">Industry-leading certification programs</p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {loading ? (
                      <div className="text-white/60 text-sm">Loading programs...</div>
                    ) : displayedCourses.length === 0 ? (
                      <div className="text-white/60 text-sm">No programs available</div>
                    ) : (
                      displayedCourses.map((course) => (
                      <Link 
                        key={course.id} 
                        to={`/program/${course.id}`}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                          course.accent === 'edtech-green' ? 'bg-gradient-to-br from-edtech-green to-green-400' : 
                          course.accent === 'edtech-orange' ? 'bg-gradient-to-br from-edtech-orange to-orange-400' :
                          'bg-gradient-to-br from-edtech-red to-red-400'
                        }`}>
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-semibold leading-tight line-clamp-2 mb-2 group-hover:text-edtech-orange transition-colors">
                            {course.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={`px-2 py-1 rounded-full text-black font-bold text-xs ${
                              course.badge === 'FEATURED' ? 'bg-edtech-red' :
                              course.badge === 'TRENDING' ? 'bg-edtech-green' :
                              course.badge === 'MOST POPULAR' ? 'bg-edtech-orange' : 'bg-white'
                            }`}>
                              {course.badge}
                            </span>
                            <span className="text-white/60 font-medium">{course.duration}</span>
                          </div>
                        </div>
                      </Link>
                      ))
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <Link 
                      to="/programs" 
                      className="flex items-center justify-between text-white/70 hover:text-edtech-orange transition-colors p-3 rounded-xl hover:bg-white/5 group"
                    >
                      <div>
                        <div className="font-semibold">Explore All Programs</div>
                        <div className="text-sm text-white/50 font-medium">View our complete program catalog</div>
                      </div>
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Link to="/pricing" className="hover:text-edtech-orange transition-colors font-semibold">Pricing</Link>
          <Link to="/about" className="hover:text-edtech-orange transition-colors font-semibold">About</Link>
          {/* <Link to="/blog" className="hover:text-edtech-orange transition-colors font-semibold">Blog</Link> */}
          <Link to="/contact"  onClick={() => openModal()} className="hover:text-edtech-orange transition-colors font-semibold">Contact Us</Link>
        </div>
        
        {/* CTA Button - Right */}
        <div className="hidden md:block">
          <button 
            onClick={() => openModal()}
            className="group relative inline-flex items-center gap-2 cta-flow text-black px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform duration-200"
          >
              <span className="relative z-10 font-bold">
              <span className="hidden lg:inline">Book FREE Strategy Call</span>
              <span className="lg:hidden">Book Call</span>
            </span>
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button
          aria-label="Menu"
          className={`md:hidden ml-3 p-2 rounded-lg border transition-colors ${mobileOpen ? 'bg-edtech-orange text-black border-edtech-orange' : 'border-white/20 text-white/80 hover:text-white'}`}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden absolute inset-x-0 top-full bg-bg-deep/95 backdrop-blur-lg border-b border-white/15 animate-slideDown">
          <div className="px-6 py-4 flex flex-col gap-3 text-sm font-medium">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-white/90 hover:text-white font-semibold">Home</Link>
            <Link to="/programs" onClick={() => setMobileOpen(false)} className="text-white/90 hover:text-white font-semibold">All Programs</Link>
            <Link to="/pricing" onClick={() => setMobileOpen(false)} className="text-white/90 hover:text-white font-semibold">Pricing</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="text-white/90 hover:text-white font-semibold">About</Link>
            {/* <Link to="/blog" onClick={() => setMobileOpen(false)} className="text-white/90 hover:text-white font-semibold">Blog</Link> */}
            <Link to="/contact" onClick={() => { setMobileOpen(false); openModal(); }} className="text-white/90 hover:text-white font-semibold">Contact Us</Link>
            <button 
              onClick={() => {
                setMobileOpen(false);
                openModal();
              }}
              className="group inline-flex items-center justify-center gap-2 cta-flow text-black px-4 py-2 rounded-lg font-bold w-full mt-2"
            >
              <span className="relative z-10 font-bold">Book FREE Strategy Call</span>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

