'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import ApplicationForm from '@/components/ApplicationForm';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CompaniesSection from '@/components/CompaniesSection';
import FeaturesSection from '@/components/FeaturesSection';
import UrgencyScarcity from '@/components/UrgencyScarcity';
import SocialProofNumbers from '@/components/SocialProofNumbers';
import GuaranteesSection from '@/components/GuaranteesSection';
import VideoSection from '@/components/VideoSection';
import CourseStructure from '@/components/CourseStructure';
import InstructorCredibility from '@/components/InstructorCredibility';
import TestimonialsSection from '@/components/TestimonialsSection';
import TrustpilotReviews from '../components/TrustpilotReviews';
import CurrentBatchTestimonials from '@/components/CurrentBatchTestimonials';
import VideoTestimonials from '@/components/VideoTestimonials';
import AIComparisonSection from '@/components/AIComparisonSection';
import FAQSection from '@/components/FAQSection';
import CertificateSection from '@/components/CertificateSection';
import Footer from '@/components/Footer';
import { VIDEO_CONFIG } from '@/config/video';

export default function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);

  const handleApplyNow = () => {
    setIsApplicationFormOpen(true);
  };

  const handleWatchDemo = () => {
    if (!VIDEO_CONFIG.enabled) return;
    
    const element = document.getElementById('demo');
    if (element) {
      const navbarHeight = 128; // Account for navbar + top banner
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsVideoPlaying(true);
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden max-w-full">
      <div className="w-full max-w-full overflow-x-hidden">{/* Main container wrapper */}
      <Navigation onApplyNow={handleApplyNow} />
      
      {/* 1. Hook with Strong Value Prop */}
      <HeroSection 
        onApplyNow={handleApplyNow} 
        onWatchDemo={VIDEO_CONFIG.enabled ? handleWatchDemo : undefined} 
      />
      
      {/* 6. Video Demo - Build Trust & Show Value */}
      {VIDEO_CONFIG.enabled && <VideoSection onApplyNow={handleApplyNow} />}
      

      {/* 2. Immediate Social Proof - Build Trust */}
      <CompaniesSection />

      {/* Video Testimonials - Real Student Stories */}
      <VideoTestimonials />

  {/* 10. Social Proof - Professional Success Stories */}
  <TestimonialsSection />

      {/* AI Comparison - Show Urgency & Value */}
      <AIComparisonSection onApplyNow={handleApplyNow} />
     

  {/* Trustpilot Reviews - Trust Signal */}
  <TrustpilotReviews />
      {/* Current Batch Live Updates */}
      <CurrentBatchTestimonials />
      
      {/* 3. Create Urgency & Scarcity - Limited Time Offer */}
      <UrgencyScarcity onApplyNow={handleApplyNow} />
      
      {/* 4. Show Real Numbers - Social Proof */}
      <SocialProofNumbers onApplyNow={handleApplyNow} />
      
      {/* 5. Remove Risk - Guarantees & Income Promises */}
      <GuaranteesSection onApplyNow={handleApplyNow} />
      
      {/* 7. What They Get - Course Value */}
      <CourseStructure onApplyNow={handleApplyNow} />
      
      {/* 8. Build Credibility - Expert Instructors */}
      <InstructorCredibility onApplyNow={handleApplyNow} />
      
      {/* 9. Why Choose Us - Unique Benefits */}
      <FeaturesSection />
      
      {/* 12. Final Push - Certificate & Achievement */}
      <CertificateSection onApplyNow={handleApplyNow} />
      
      {/* 11. Handle Objections - Remove Friction */}
      <FAQSection onApplyNow={handleApplyNow} />
      

      <Footer onApplyNow={handleApplyNow} />

      {/* Application Form Modal */}
      <ApplicationForm 
        isOpen={isApplicationFormOpen} 
        onClose={() => setIsApplicationFormOpen(false)} 
      />
      </div>{/* Close main container wrapper */}
    </main>
  );
}
