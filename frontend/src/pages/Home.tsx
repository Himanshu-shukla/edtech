import { Suspense, lazy } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import UpcomingSkills from "../components/UpcomingSkills";
import { useContactModal } from "../contexts/ContactModalContext";

// Lazy load heavy components that appear below the fold
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

export default function HomePage() {
  const { openModal } = useContactModal();

  const handleApplyNow = () => {
    openModal(
      'Book FREE Strategy Call',
      'Schedule a personalized consultation to discuss your career goals and find the perfect program for you. Our experts will help you map out your learning journey.'
    );
  };


  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero onApplyNow={handleApplyNow} />
      <UpcomingSkills />
      
      
      <Suspense fallback={<div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edtech-green"></div></div>}>
        <CoursesSection />
      </Suspense>
      <Suspense fallback={<div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edtech-green"></div></div>}>
        <Mission />
      </Suspense>
      
      <Suspense fallback={<div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edtech-green"></div></div>}>
        <Testimonials />
      </Suspense>
      
      <Suspense fallback={<div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edtech-green"></div></div>}>
        <VideoTestimonials />
      </Suspense>
      
      <Suspense fallback={<div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edtech-green"></div></div>}>
        <TrustpilotReviews />
      </Suspense>
      
      <Suspense fallback={<div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edtech-green"></div></div>}>
        <CompanyShowcase />
      </Suspense>
      
      <Suspense fallback={<div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edtech-green"></div></div>}>
        <CertificateSection onApplyNow={handleApplyNow} />
      </Suspense>
      
      <Suspense fallback={<div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edtech-green"></div></div>}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edtech-green"></div></div>}>
        <FAQ />
      </Suspense>
      
      <Suspense fallback={<div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edtech-green"></div></div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

