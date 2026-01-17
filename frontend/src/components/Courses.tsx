import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { getFeaturedCoursesData, getCourseIcon, getCourseDetailsData } from "../utils/dataAdapter";
import type { Course } from "../types";
import { Link } from "react-router-dom";
import MicrosoftBadge from "./MicrosoftBadge";
// Removed - using direct payment flow now
import { usePaymentModal } from "../contexts/PaymentModalContext";

export default function CoursesSection() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [courseIcons, setCourseIcons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  // Removed - using direct payment flow now
  const { openModal: openPaymentModal } = usePaymentModal();

  useEffect(() => {
    const loadFeaturedCourses = async () => {
      try {
        const data = await getFeaturedCoursesData();
        setFeaturedCourses(data);
        
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
        console.error('Error loading featured courses:', error);
        setFeaturedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCourses();
  }, []);

  // Initialize scroll reveal animation after courses are loaded
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    
    if (!loading && featuredCourses.length > 0) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) e.target.classList.add("visible");
            });
          },
          { threshold: 0.1 }
        );
        
        // Only observe course cards in this component
        const courseCards = document.querySelectorAll('.course-card.reveal');
        courseCards.forEach((el) => observer!.observe(el));
      }, 100);
      
      return () => {
        clearTimeout(timer);
        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, [loading, featuredCourses.length]);

  // Removed - not used after payment integration

  const handleBuyNow = async (course: Course) => {
    // Course pricing comes from CourseDetails, not Course directly
    try {
      const courseDetails = await getCourseDetailsData(course.id);
      if (!courseDetails?.pricing?.current) {
        toast.error('Pricing information not available for this course. Please contact support.');
        return;
      }
      openPaymentModal(course, courseDetails.pricing.current, 'home-featured-courses');
    } catch (error) {
      toast.error('Unable to load course pricing. Please contact support.');
    }
  };

  return (
    <section  id="featured-programs" className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <div className="badge-hero mx-auto w-max"><span>🚀</span><span>MOST POPULAR PROGRAMS</span></div>
          
          {/* Microsoft Partnership Badge */}
          <div className="mt-6 mb-6 flex justify-center">
            <MicrosoftBadge size="md" />
          </div>

          <h2 className="mt-6 text-3xl md:text-4xl font-bold">Top-Rated <span className="text-edtech-orange font-extrabold">Programs</span></h2>
          <p className="mt-2 text-white/70 max-w-2xl mx-auto"> <span className="text-edtech-green font-bold">Industry-recognized certifications</span> that give you the edge where it matters most — the workplace.</p>
        </div>

        {/* Grid layout for featured courses only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {featuredCourses.map((c, idx) => (
            <article key={`${c.id}-${idx}`} className="course-card p-4 flex flex-col relative reveal" data-accent={c.accent.replace('edtech-','')} style={{ animationDelay: `${idx * 150}ms` }}> 
              <div
                className="course-head relative overflow-hidden"
                style={c.image ? {
                  backgroundImage: `url(${import.meta.env.VITE_API_BASE_URL}/uploads/course-images/${c.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '120px',
                  borderRadius: '0.75rem',
                } : {
                  minHeight: '120px',
                  borderRadius: '0.75rem',
                }}
              >
                {c.image ? (
                  <div className="absolute inset-0 bg-black/20 z-0" />
                ) : (
                  <div className="relative z-10 flex items-center gap-2 p-3">
                    <div className="course-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d={courseIcons[c.id] || 'M13 10V3L4 14h7v7l9-11h-7z'}/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h3 className="course-title mt-2 text-[18px] font-semibold leading-snug line-clamp-2">{c.title}</h3>
                <p className="mt-2 text-[13px] text-white/70 line-clamp-2">{c.desc}</p>
              </div>

              <div className="mt-4 flex items-center gap-3 text-[12px] text-white/70">
                <span className="chip"><span className="meta-dot"/> {c.duration}</span>
                <span className="chip"><span className="meta-dot"/> {c.extra}</span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Link to={`/program/${c.id}`} className="cta cta-secondary">View Details</Link>
                <button 
                  onClick={() => handleBuyNow(c)}
                  className="cta course-card-apply"
                >
                  Buy Now
                </button>
              </div>
                <span className="corner-badge">{c.badge}</span>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/programs" className="cta cta-secondary hover:text-edtech-orange">View All Programs</Link>
        </div>
      </div>
    </section>
  );
}

