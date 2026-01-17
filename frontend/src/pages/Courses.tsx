import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';
import { 
  Search, Filter, BookOpen, Clock, BarChart, 
  Sparkles, GraduationCap, ChevronRight, CheckCircle2 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MicrosoftBadge from "../components/MicrosoftBadge";
import Stats from "../components/Stats";
import { getCoursesData, getCourseIcon, getCourseDetailsData } from "../utils/dataAdapter";
import type { Course } from "../types";
import { usePaymentModal } from "../contexts/PaymentModalContext";
import { useContactModal } from "../contexts/ContactModalContext";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Sub-Component: Course Card ---
const CourseCard = ({ course, iconPath, onApply }: { course: Course, iconPath: string, onApply: () => void }) => {
  return (
    <motion.article 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col h-full bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm",
          course.badge === 'FEATURED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
          course.badge === 'TRENDING' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          course.badge === 'MOST POPULAR' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
          'bg-blue-500/10 text-blue-400 border-blue-500/20'
        )}>
          {course.badge}
        </span>
      </div>

      {/* Header / Icon Area */}
      <div className="p-6 pb-0">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
          course.accent === 'edtech-green' ? 'bg-emerald-500/10 text-emerald-400' : 
          course.accent === 'edtech-orange' ? 'bg-orange-500/10 text-orange-400' :
          course.accent === 'edtech-red' ? 'bg-red-500/10 text-red-400' :
          'bg-blue-500/10 text-blue-400'
        )}>
          {/* Render SVG Path */}
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath || 'M13 10V3L4 14h7v7l9-11h-7z'}/>
          </svg>
        </div>

        <div className="mb-2">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {course.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 pt-2 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
          {course.title}
        </h3>
        
        <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed mb-6 flex-1">
          {course.desc}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart className="w-3.5 h-3.5" />
            {course.extra}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link 
            to={`/program/${course.id}`} 
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-center border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Details
          </Link>
          <button 
            onClick={onApply}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-center bg-white text-black hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
          >
            Apply Now
          </button>
        </div>
      </div>
      
      {/* Hover Gradient Blob */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.article>
  );
}

// --- Loading Skeleton ---
const SkeletonCard = () => (
  <div className="h-[450px] rounded-3xl bg-zinc-900/50 border border-zinc-800 animate-pulse p-6">
    <div className="w-14 h-14 rounded-2xl bg-zinc-800 mb-4" />
    <div className="w-20 h-4 rounded bg-zinc-800 mb-4" />
    <div className="w-3/4 h-8 rounded bg-zinc-800 mb-4" />
    <div className="w-full h-20 rounded bg-zinc-800 mb-6" />
    <div className="w-full h-10 rounded-xl bg-zinc-800 mt-auto" />
  </div>
);

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const { openModal: openPaymentModal } = usePaymentModal();
  const { openModal: openContactModal } = useContactModal();

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [courseIcons, setCourseIcons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCoursesData();
        setAllCourses(data);
        
        const iconPromises = data.map(async (course) => {
          const icon = await getCourseIcon(course);
          return { id: course.id, icon };
        });
        
        const resolvedIcons = await Promise.all(iconPromises);
        const iconsMap = resolvedIcons.reduce((acc, { id, icon }) => {
          acc[id] = icon;
          return acc;
        }, {} as Record<string, string>);
        
        setCourseIcons(iconsMap);
      } catch (error) {
        console.error('Error loading courses:', error);
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleApplyNow = async (course: Course) => {
    try {
      const courseDetails = await getCourseDetailsData(course.id);
      if (!courseDetails?.pricing?.current) {
        toast.error('Pricing information unavailable.');
        return;
      }
      openPaymentModal(course, courseDetails.pricing.current, 'courses-page');
    } catch (error) {
      toast.error('Unable to load course pricing.');
    }
  };
  
  const categories = useMemo(() => 
    ['ALL', ...Array.from(new Set(allCourses.map(c => c.category)))], 
    [allCourses]
  );
  
  const filteredCourses = useMemo(() => 
    allCourses.filter(course => {
      const matchesCategory = selectedCategory === 'ALL' || course.category === selectedCategory;
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           course.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }), 
    [allCourses, selectedCategory, searchTerm]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-orange-500/30">
      <Navbar />
      
      <main className="pt-20">
        
        {/* --- HERO SECTION --- */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Backgrounds */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-6 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-orange-400 mb-8">
                <BookOpen className="w-3 h-3" />
                <span>PROGRAM CATALOG</span>
              </div>
              
              <div className="mb-8 flex justify-center transform hover:scale-105 transition-transform duration-300">
                <MicrosoftBadge size="lg" />
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
                Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-orange-400">Tomorrow's Skills</span> Today
              </h1>
              
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed">
                Explore our <span className="text-white font-medium">elite collection</span> of industry-leading programs designed to fast-track your career growth.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
                {[
                  { value: `${allCourses.length}+`, label: "Programs", color: "text-emerald-400" },
                  { value: `${categories.length - 1}`, label: "Specializations", color: "text-orange-400" },
                  { value: "24/7", label: "Mentor Support", color: "text-white" },
                  { value: "95%", label: "Success Rate", color: "text-red-400" }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm">
                    <div className={cn("text-3xl font-bold mb-1", stat.color)}>{stat.value}</div>
                    <div className="text-xs text-zinc-500 font-bold uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* --- SEARCH & FILTER BAR --- */}
              <div className="max-w-4xl mx-auto">
                <div className="p-2 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl backdrop-blur-md">
                  
                  {/* Search Input */}
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="w-5 h-5 text-zinc-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for Python, Data Science, AI..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-2 justify-center px-2 pb-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-bold transition-all duration-300",
                          selectedCategory === category
                            ? "bg-white text-black shadow-lg scale-105"
                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                        )}
                      >
                        {category.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </section>

        {/* --- COURSE GRID --- */}
        <section className="relative py-20">
           {/* Background Gradient */}
           <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
           <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

           <div className="mx-auto max-w-7xl px-6">
             
             {/* Results Header */}
             <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-6">
               <div>
                 <h2 className="text-3xl font-bold text-white mb-2">
                   {selectedCategory === 'ALL' ? 'All Programs' : selectedCategory.replace('-', ' ')}
                 </h2>
                 <p className="text-zinc-500">
                   Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'program' : 'programs'}
                 </p>
               </div>
               
               {/* Decorative Filter Icon */}
               <div className="hidden md:flex items-center gap-2 text-zinc-500 text-sm">
                 <Filter className="w-4 h-4" />
                 <span>Filtered by relevance</span>
               </div>
             </div>

             {/* Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]">
               <AnimatePresence mode="popLayout">
                 {loading ? (
                   [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)
                 ) : filteredCourses.length === 0 ? (
                   <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }}
                     className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500"
                   >
                     <Search className="w-16 h-16 mb-4 opacity-20" />
                     <p className="text-lg">No programs found matching your search.</p>
                     <button 
                       onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); }}
                       className="mt-4 text-emerald-500 hover:underline"
                     >
                       Clear filters
                     </button>
                   </motion.div>
                 ) : (
                   filteredCourses.map((course) => (
                     <CourseCard 
                       key={course.id} 
                       course={course} 
                       iconPath={courseIcons[course.id]}
                       onApply={() => handleApplyNow(course)}
                     />
                   ))
                 )}
               </AnimatePresence>
             </div>

           </div>
        </section>

        {/* --- STATS --- */}
        <Stats />

        {/* --- CTA --- */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-zinc-950 to-orange-900/20" />
          
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-xl shadow-2xl"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold mb-6 border border-white/10">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Not sure which path to take?
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Get a Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-orange-400">Career Roadmap</span>
              </h2>
              
              <p className="text-zinc-300 text-lg mb-10 max-w-2xl mx-auto">
                Talk to our expert counselors. We'll analyze your background and goals to recommend the perfect program for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => openContactModal("Book FREE Strategy Call", "Help me choose a course")}
                  className="group relative overflow-hidden px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Book Free Consultation <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 text-sm text-zinc-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Guidance
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Obligation
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Expert Advice
                </div>
              </div>

            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}