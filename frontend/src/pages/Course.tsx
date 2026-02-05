import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import toast from 'react-hot-toast';
import { 
  ArrowRight, Sparkles, Clock, Users, 
  CheckCircle2, ChevronDown, Zap, Star, ShieldCheck,
  // Imported Icons
  BarChart, // Changed from BarChart3 to BarChart for better compatibility
  Award, 
  Briefcase,
  Layout,
  Code2,
  Terminal
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MicrosoftBadge from "../components/MicrosoftBadge";
import { getCoursesData, getCourseDetailsData } from "../utils/dataAdapter";
import { useContactModal } from "../contexts/ContactModalContext";
import { usePaymentModal } from "../contexts/PaymentModalContext";
import type { Course, CourseDetails } from "../types";

/* ---------------------------- Icon Mapping System -------------------------- */

// 1. Create a map of string names to actual Components
const ICON_MAP: Record<string, any> = {
  "Clock": Clock,
  "Zap": Zap,
  "Briefcase": Briefcase,
  "BarChart": BarChart,
  "Award": Award,
  "Users": Users,
  "Star": Star,
  "ShieldCheck": ShieldCheck,
  "Layout": Layout,
  "Code": Code2,
  "Terminal": Terminal,
  // Add defaults/fallbacks
  "default": Sparkles
};

// 2. Helper Component to safely render icons
const DynamicIcon = ({ icon, className }: { icon: any, className?: string }) => {
  // If icon is a React Component (function), render it directly
  if (typeof icon === 'function' || typeof icon === 'object') {
    const IconComponent = icon;
    return <IconComponent className={className} />;
  }

  // If icon is a string name (from DB), look it up in the map
  if (typeof icon === 'string') {
    const IconComponent = ICON_MAP[icon] || ICON_MAP["default"];
    return <IconComponent className={className} />;
  }

  // Fallback
  return <Sparkles className={className} />;
};

/* ---------------------------- Motion Variants ------------------------------ */

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

/* ---------------------------- Helper Components ---------------------------- */

const SectionHeader = ({ badge, title, subtitle }: { badge: string; title: React.ReactNode; subtitle: string }) => (
  <div className="mb-12">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-orange-400 mb-4"
    >
      <Sparkles className="w-3 h-3" />
      {badge}
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-bold text-white mb-4"
    >
      {title}
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-zinc-400 text-lg max-w-2xl"
    >
      {subtitle}
    </motion.p>
  </div>
);

const GridPattern = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px]" />
  </div>
);

/* ---------------------------- Main Component ------------------------------ */

export default function CoursePage() {
  const { courseId } = useParams();
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { openModal } = useContactModal();
  const { openModal: openPaymentModal } = usePaymentModal();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, detailsData] = await Promise.all([
          getCoursesData(),
          courseId ? getCourseDetailsData(courseId) : null
        ]);
        
        setCourses(coursesData);
        if (detailsData) setCourseDetails(detailsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  const course = courses.find(c => c.id === courseId);
  const details = courseDetails;

  const handleBuyNow = () => {
    if (!course || !details?.pricing?.current) {
      toast.error('Pricing information unavailable.');
      return;
    }
    openPaymentModal(course, details.pricing.current, 'course-detail-page');
  };

  const toggleModule = (index: number) => {
    setOpenModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Navbar />
        <div className="w-12 h-12 border-t-2 border-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!course || !details) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-3xl font-bold text-white mb-4">Program Not Found</h1>
          <Link to="/programs" className="px-6 py-3 bg-white text-black rounded-full font-medium">
            Return to Programs
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Formatting helpers
  const accentColor = course.accent === 'edtech-green' ? 'text-emerald-400' : 'text-orange-400';
  const accentBg = course.accent === 'edtech-green' ? 'bg-emerald-500' : 'bg-orange-500';

  // Stats Array with explicit components
  const stats = [
    { label: "Duration", value: course.duration, icon: Clock },
    { label: "Format", value: "Online Live", icon: Zap },
    { label: "Projects", value: course.extra, icon: Briefcase },
    { label: "Success Rate", value: "95%", icon: BarChart }, 
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="pt-24 pb-20 relative overflow-hidden">
        <GridPattern />

        {/* --- Hero Section --- */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-12"
          >
            {/* Left: Content */}
            <div className="lg:w-2/3">
              {/* Breadcrumb & Badge */}
              <div className="flex items-center gap-4 mb-6 text-sm text-zinc-500">
                <Link to="/programs" className="hover:text-white transition-colors">Programs</Link>
                <span>/</span>
                <span className={accentColor}>{course.category}</span>
              </div>

              <div className="mb-6">
                 <MicrosoftBadge size="lg" />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-zinc-400 mb-8 leading-relaxed max-w-3xl">
                {details.overview}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl backdrop-blur-sm group hover:border-zinc-700 transition-colors">
                    {/* Use DynamicIcon to handle rendering */}
                    <DynamicIcon icon={stat.icon} className={`w-6 h-6 ${accentColor} mb-2`} />
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Sticky Sidebar (Desktop) */}
            <div className="hidden lg:block lg:w-1/3 relative">
              <div className="sticky top-28">
                <PricingCard 
                  details={details} 
                  course={course} 
                  handleBuyNow={handleBuyNow} 
                  openModal={openModal} 
                  accentBg={accentBg}
                  AwardIcon={Award} 
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Main Content Layout --- */}
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
          
          {/* Left Column (Details) */}
          <div className="lg:col-span-2 space-y-24">
            
            {/* Features Grid */}
            <section>
              <SectionHeader 
                badge="WHY CHOOSE US"
                title="Program Highlights"
                subtitle="Everything you need to master this skill set and advance your career."
              />
              <div className="grid md:grid-cols-2 gap-4">
                {details.features?.map((feature: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex gap-4 p-5 bg-zinc-900/30 border border-zinc-800 rounded-2xl hover:bg-zinc-900/60 transition-colors"
                  >
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-lg text-emerald-400">
                      {/* FIX: Use DynamicIcon to handle string names from DB */}
                      <DynamicIcon 
                        icon={feature.icon || "Award"} 
                        className="w-5 h-5" 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Curriculum Accordion */}
            <section>
              <SectionHeader 
                badge="ROADMAP"
                title="Curriculum"
                subtitle={`${details.curriculum.length} comprehensive modules designed to take you from beginner to pro.`}
              />
              
              <div className="space-y-4">
                {details.curriculum.map((module: any, index: number) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group border border-zinc-800 bg-zinc-900/20 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors"
                  >
                    <button
                      onClick={() => toggleModule(index)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-black ${openModules[index] ? 'bg-white' : 'bg-zinc-800 text-white group-hover:bg-zinc-700'}`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 font-mono mb-0.5">{module.duration}</div>
                          <h3 className={`font-semibold text-lg transition-colors ${openModules[index] ? 'text-white' : 'text-zinc-300'}`}>
                            {module.module}
                          </h3>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${openModules[index] ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {openModules[index] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-0 ml-[4.5rem]">
                            <div className="h-full w-px bg-zinc-800 absolute left-[3.25rem] -top-6 bottom-6" />
                            <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                              {module.topics.map((topic: any, tIdx: number) => (
                                <div key={tIdx}>
                                  <h5 className="text-emerald-400 text-sm font-medium mb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {topic.topic}
                                  </h5>
                                  <div className="pl-3.5 border-l border-zinc-800 space-y-1">
                                    {topic.subtopics.map((sub: string, sIdx: number) => (
                                      <p key={sIdx} className="text-sm text-zinc-400 pl-4 relative">
                                        <span className="absolute left-0 top-2 w-2 h-px bg-zinc-700" />
                                        {sub}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Tools Section */}
            <section>
              <SectionHeader 
                badge="TECH STACK"
                title="Tools You'll Master"
                subtitle="Industry-standard technologies included in this program."
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {details.tools.map((tool: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-center"
                  >
                    <div className="text-3xl text-emerald-400">
                       {/* Handle tool icons if they are strings */}
                       <DynamicIcon icon={tool.icon || "Code"} className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-medium text-zinc-300">{tool.name || tool}</span>
                  </motion.div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column (Mobile Pricing) */}
          <div className="lg:hidden space-y-8">
            <PricingCard 
               details={details} 
               course={course} 
               handleBuyNow={handleBuyNow} 
               openModal={openModal}
               accentBg={accentBg}
               AwardIcon={Award}
            />
          </div>

        </div>

        {/* --- Related Courses --- */}
        <section className="mt-32 max-w-7xl mx-auto px-6">
          <SectionHeader badge="EXPLORE" title="Related Programs" subtitle="Other courses you might be interested in." />
          <div className="grid md:grid-cols-3 gap-6">
            {courses.filter(c => c.id !== course.id).slice(0, 3).map((related) => (
              <Link key={related.id} to={`/program/${related.id}`} className="block group">
                <article className="h-full bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-zinc-800 text-zinc-300">
                      {related.category}
                    </span>
                    {related.badge && (
                      <span className="text-xs font-bold text-emerald-400">
                        {related.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {related.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mt-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {related.duration}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {related.extra}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

/* ---------------------------- Sub-Components ------------------------------ */

function PricingCard({ details, course, handleBuyNow, openModal, accentBg, AwardIcon }: any) {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

      <div className="mb-6">
        <p className="text-zinc-400 text-sm font-medium mb-1">Total Program Fee</p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-white">
            {details.pricing?.current ? `£${details.pricing.current}` : 'TBD'}
          </span>
          {details.pricing?.original && (
            <span className="text-zinc-600 line-through text-lg">£{details.pricing.original}</span>
          )}
        </div>
        {details.pricing?.discount && (
          <div className="mt-2 inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
            {details.pricing.discount} {details.pricing.deadline && `• Ends ${details.pricing.deadline}`}
          </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        <button
          onClick={handleBuyNow}
          className={`w-full py-4 rounded-xl font-bold text-black ${accentBg} hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
        >
          Enroll Now <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => openModal("Course Inquiry", `Inquiry about ${course.title}`)}
          className="w-full py-4 rounded-xl font-bold text-white border border-zinc-700 hover:bg-zinc-800 transition-colors"
        >
          Book Free Demo
        </button>
      </div>

      <div className="pt-6 border-t border-zinc-800">
        <div className="flex items-center gap-2 mb-4">
           {/* FIX: Ensure AwardIcon is rendered safely */}
           {AwardIcon ? <AwardIcon className="w-4 h-4 text-emerald-500" /> : <Sparkles className="w-4 h-4 text-emerald-500" />}
           <p className="text-sm font-semibold text-white">This program includes:</p>
        </div>
        
        <ul className="space-y-3">
          {(details.pricing?.features || ["Live Sessions", "Project Reviews", "Certification", "Career Support"]).map((item: any, i: number) => (
            <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>{typeof item === 'string' ? item : item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Secure Payment
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" /> {details.courseInfo?.studentsEnrolled || "1k+"} Enrolled
        </div>
      </div>
    </div>
  );
}