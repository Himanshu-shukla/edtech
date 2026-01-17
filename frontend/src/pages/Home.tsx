import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import UpcomingSkills from "../components/UpcomingSkills";
import { useContactModal } from "../contexts/ContactModalContext";

// Lazy load heavy components
const CoursesSection = lazy(() => import("../components/Courses"));
const Mission = lazy(() => import("../components/Mission"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const VideoTestimonials = lazy(() => import("../components/VideoTestimonials"));
const TrustpilotReviews = lazy(() => import("../components/TrustpilotReviews"));
const CompanyShowcase = lazy(() => import("../components/CompanyShowcase"));
const CertificateSection = lazy(() => import("../components/CertificateSection"));
const WhyChooseUs = lazy(() => import("../components/WhyChooseUs"));
const FAQ = lazy(() => import("../components/FAQ"));
const Footer = lazy(() => import("../components/Footer"));

// --- UI Helpers ---

// 1. A sleek loader that matches the dark theme
const SectionLoader = () => (
  <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
    <div className="relative flex h-12 w-12">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-20"></span>
      <span className="relative inline-flex rounded-full h-12 w-12 bg-zinc-800 border border-zinc-700 items-center justify-center">
        <div className="h-4 w-4 bg-orange-500 rounded-full animate-pulse"></div>
      </span>
    </div>
    <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest animate-pulse">Loading Content...</span>
  </div>
);

// 2. A wrapper to animate sections as they enter the viewport
const SectionReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }} // Triggers when 100px into view
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 3. A subtle divider to separate large sections
const Divider = () => (
  <div className="w-full max-w-7xl mx-auto px-4 opacity-30">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />
  </div>
);

export default function HomePage() {
  const { openModal } = useContactModal();

  const handleApplyNow = () => {
    openModal(
      'Book FREE Strategy Call',
      'Schedule a personalized consultation to discuss your career goals. Our experts will help you map out your learning journey.'
    );
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-200 selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden">
      
      {/* --- Global Background Effects --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* --- Main Content (z-10 to sit above background) --- */}
      <div className="relative z-10 flex flex-col gap-0">
        
        <Navbar />
        
        <Hero onApplyNow={handleApplyNow} />
        
        {/* UpcomingSkills often looks best seamlessly attached to Hero, so no reveal/lazy needed if it's light */}
        <UpcomingSkills />

        {/* --- Lazy Loaded Sections with Reveal Effects --- */}
        
        <Suspense fallback={<SectionLoader />}>
          <SectionReveal className="py-20">
            <CoursesSection />
          </SectionReveal>
        </Suspense>

        <Divider />

        <Suspense fallback={<SectionLoader />}>
          <SectionReveal className="py-20 bg-zinc-900/30 backdrop-blur-sm">
            <Mission />
          </SectionReveal>
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <SectionReveal className="pt-20 pb-10">
            <CompanyShowcase />
          </SectionReveal>
        </Suspense>

        {/* Grouping Testimonials for better flow */}
        <div className="bg-gradient-to-b from-zinc-950 to-zinc-900/80">
          <Suspense fallback={<SectionLoader />}>
            <SectionReveal className="pt-20">
              <Testimonials />
            </SectionReveal>
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <SectionReveal className="py-16">
              <VideoTestimonials />
            </SectionReveal>
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <SectionReveal className="pb-20">
              <TrustpilotReviews />
            </SectionReveal>
          </Suspense>
        </div>

        <Divider />

        <Suspense fallback={<SectionLoader />}>
          <SectionReveal className="py-20 relative overflow-hidden">
            {/* Optional local background blob for this section */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />
            <CertificateSection onApplyNow={handleApplyNow} />
          </SectionReveal>
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <SectionReveal className="py-20 bg-zinc-900/50">
            <WhyChooseUs />
          </SectionReveal>
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <SectionReveal className="py-20">
            <FAQ />
          </SectionReveal>
        </Suspense>

        <Suspense fallback={<div className="h-20" />}>
          <Footer />
        </Suspense>

      </div>
    </div>
  );
}