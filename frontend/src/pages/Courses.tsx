import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import TechBackground from "../TechBackground";
import { getCoursesData, getCourseIcon, getCourseDetailsData } from "../utils/dataAdapter";
import type { Course } from "../types";
import MicrosoftBadge from "../components/MicrosoftBadge";
import Stats from "../components/Stats";
import useRevealOnScroll from "../hooks/useRevealOnScroll";
import { usePaymentModal } from "../contexts/PaymentModalContext";
import { useContactModal } from "../contexts/ContactModalContext";

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const { openModal: openPaymentModal } = usePaymentModal();
  const { openModal } = useContactModal();

  // Add scroll reveal animations
  useRevealOnScroll();

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [courseIcons, setCourseIcons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCoursesData();
        setAllCourses(data);
        
        // Load icons for all courses
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

  // Initialize scroll reveal for dynamic content after data loads
  useEffect(() => {
    if (!loading && allCourses.length > 0) {
      const timer = setTimeout(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) e.target.classList.add("visible");
            });
          },
          { threshold: 0.1 }
        );
        
        const coursesRevealElements = document.querySelectorAll('.courses-page-reveal');
        coursesRevealElements.forEach((el) => observer.observe(el));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [loading, allCourses.length]);

  const handleApplyNow = async (course: Course) => {
    // Get course pricing from details API
    try {
      const courseDetails = await getCourseDetailsData(course.id);
      if (!courseDetails?.pricing?.current) {
        toast.error('Pricing information not available for this course. Please contact support.');
        return;
      }
      openPaymentModal(course, courseDetails.pricing.current, 'courses-page');
    } catch (error) {
      toast.error('Unable to load course pricing. Please contact support.');
    }
  };
  
  // Memoize categories to avoid recalculation
  const categories = useMemo(() => 
    ['ALL', ...Array.from(new Set(allCourses.map(c => c.category)))], 
    [allCourses]
  );
  
  // Memoize filtered courses to optimize rendering
  const filteredCourses = useMemo(() => 
    allCourses.filter(course => {
      const matchesCategory = selectedCategory === 'ALL' || course.category === selectedCategory;
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           course.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }), 
    [allCourses, selectedCategory, searchTerm]
  );

  // Get featured courses (first 3 courses for highlights)
  const featuredCourses = allCourses.slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Background */}
      {/* <div className="fixed inset-0 -z-10">
        <TechBackground className="mix-blend-screen opacity-30" />
      </div> */}
      
      <main className="pt-20">
        {/* SECTION 1: Hero Section - BRAND COLORS */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          {/* <TechBackground className="opacity-15" /> */}
          
          <div className="relative mx-auto max-w-7xl px-6 text-center">
            <div className="badge-hero mx-auto w-max mb-8">
              <span>🎓</span><span>COMPLETE PROGRAM CATALOG</span>
            </div>

            {/* Microsoft Partnership Badge */}
            <div className="mb-8 flex justify-center">
              <MicrosoftBadge size="lg" />
            </div>

                          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-8 leading-tight">
                Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Tomorrow's</span> Skills Today
              </h1>
              <p className="text-white/80 text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed">
                ✨ Ready to level up? Explore our <span className="text-edtech-green font-semibold">elite collection</span> of industry-leading programs designed by experts 
                to fast-track your career growth and position you among the <span className="text-edtech-orange font-semibold">top 1%</span> of tech professionals
              </p>

            {/* Course Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-edtech-green mb-2">{allCourses.length}+</div>
                <div className="text-white/80 text-sm font-medium">Expert Programs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-edtech-orange mb-2">{categories.length - 1}</div>
                <div className="text-white/80 text-sm font-medium">Specializations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/80 text-sm font-medium">Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-edtech-red mb-2">95%</div>
                <div className="text-white/80 text-sm font-medium">Success Rate</div>
              </div>
            </div>

            {/* Enhanced Search and Filter */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Find Your Perfect Program</h3>
                <div className="flex flex-col gap-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by program name, technology, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-2xl pl-16 pr-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-edtech-green/50 focus:bg-white/15 transition-all text-lg"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-edtech-green to-edtech-orange text-black shadow-lg'
                            : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/20'
                        }`}
                      >
                        {category.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Featured Courses Highlight - LIGHT */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-edtech-blue">Featured</span> Programs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                🚀 Start with our <span className="text-edtech-blue font-semibold">top-rated programs</span> that have <span className="text-edtech-orange font-semibold">transformed thousands</span> of careers worldwide
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12 courses-page-reveal reveal">
              {featuredCourses.map((course) => (
                <div key={course.id} className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:scale-[1.02]">
                  {/* Course Badge */}
                  <div className="absolute top-6 right-6 z-10">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      course.badge === 'FEATURED' ? 'bg-red-500 text-white' :
                      course.badge === 'TRENDING' ? 'bg-edtech-green text-black' :
                      course.badge === 'MOST POPULAR' ? 'bg-edtech-orange text-black' : 'bg-blue-500 text-white'
                    }`}>
                      {course.badge}
                    </span>
                  </div>

                  {/* Course Icon */}
                  <div className="p-8 pb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                      course.accent === 'edtech-green' ? 'bg-gradient-to-br from-edtech-green to-green-400' : 
                      course.accent === 'edtech-orange' ? 'bg-gradient-to-br from-edtech-orange to-orange-400' :
                      course.accent === 'edtech-red' ? 'bg-gradient-to-br from-red-500 to-red-400' :
                      'bg-gradient-to-br from-edtech-orange to-orange-400'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d={courseIcons[course.id] || 'M13 10V3L4 14h7v7l9-11h-7z'}/>
                      </svg>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm text-gray-500 font-medium">{course.category}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-edtech-blue transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                      {course.desc}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        {course.extra}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link 
                        to={`/program/${course.id}`} 
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl font-semibold text-center transition-all duration-300"
                      >
                        View Details
                      </Link>
                      <button 
                        onClick={() => handleApplyNow(course)}
                        className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition-all duration-300 hover:scale-105"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: All Courses Grid - DARK */}
        <section className="py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-deep via-bg-deep to-edtech-blue/5" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-between mb-12 reveal">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  All <span className="text-edtech-orange">Programs</span>
                </h2>
                <p className="text-white/70 text-lg">
                  Showing {filteredCourses.length} program{filteredCourses.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'ALL' && ` in ${selectedCategory.replace('-', ' ')}`}
                </p>
              </div>
              
              {/* Quick Filter Pills */}
              <div className="hidden md:flex gap-2">
                {['ALL', 'AI & ML', 'DATA ANALYTICS', 'CLOUD'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-edtech-green text-black'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 courses-page-reveal reveal">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-white/70 text-lg">Loading courses...</div>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-white/70 text-lg">No courses found matching your criteria.</div>
                </div>
              ) : (
                filteredCourses.map((course, idx) => (
                <article 
                  key={`${course.id}-${idx}`} 
                  className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden" 
                > 
                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-black/30 text-white/80 rounded-full text-xs font-medium border border-white/20">
                      {course.category}
                    </span>
                    <div className={`p-3 rounded-xl ${
                      course.accent === 'edtech-green' ? 'bg-gradient-to-br from-edtech-green/20 to-green-400/20' : 
                      course.accent === 'edtech-orange' ? 'bg-gradient-to-br from-edtech-orange/20 to-orange-400/20' :
                      course.accent === 'edtech-red' ? 'bg-gradient-to-br from-red-500/20 to-red-400/20' :
                      'bg-gradient-to-br from-edtech-orange/20 to-orange-400/20'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d={courseIcons[course.id] || 'M13 10V3L4 14h7v7l9-11h-7z'}/>
                      </svg>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-edtech-orange transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
                      {course.desc}
                    </p>
                  </div>

                  {/* Course Meta */}
                  <div className="flex items-center gap-4 text-xs text-white/60 mb-6">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      {course.extra}
                    </span>
                  </div>

                  {/* Course Actions */}
                  <div className="flex items-center gap-3">
                    <Link 
                      to={`/program/${course.id}`} 
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-medium text-center transition-all duration-300 border border-white/20 hover:border-white/40"
                    >
                      View Details
                    </Link>
                    <button 
                      onClick={() => handleApplyNow(course)}
                      className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition-all duration-300 hover:scale-105"
                    >
                      Apply Now
                    </button>
                  </div>
                  
                  {/* Course Badge */}
                  <span className={`absolute top-4 right-4 px-2.5 py-1 text-xs font-bold rounded-full shadow-lg ${
                    course.badge === 'FEATURED' ? 'bg-red-500 text-white' :
                    course.badge === 'TRENDING' ? 'bg-edtech-green text-black' :
                    course.badge === 'MOST POPULAR' ? 'bg-edtech-orange text-black' : 'bg-blue-500 text-white'
                  }`}>
                    {course.badge}
                  </span>
                </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* SECTION 4: Stats Section */}
        <Stats />

        {/* SECTION 5: CTA Section - ENHANCED */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue relative overflow-hidden">
          {/* <div className="absolute inset-0">
            <TechBackground className="opacity-10" />
          </div> */}
          
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-white border border-white/20">
                  🚀 Ready to Transform Your Career?
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Learning Journey</span> Today
              </h2>
              
              <p className="text-white/80 text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
                🌐 Your <span className="text-edtech-green font-semibold">gateway to global careers</span> starts here. Join our elite community of <span className="text-edtech-orange font-semibold">learners-turned-leaders</span>
                and master the skills that Fortune 500 companies are actively seeking right now.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                  onClick={() => openModal("Book FREE Strategy Call", "Schedule a personalized consultation to discuss your career goals and find the perfect course for you")}
                  className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  🎯 Claim Your FREE Strategy Call
                </button>
                <Link 
                  to="/contact" 
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  💬 Contact Our Team
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="flex flex-wrap justify-center items-center gap-8 text-white/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">30-Day Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Industry Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">4.8/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">1000+ Success Stories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
