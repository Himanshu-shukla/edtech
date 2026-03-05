"use client";

import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import UpcomingSkills from "../components/UpcomingSkills";
import { useContactModal } from "../contexts/ContactModalContext";

// Lazy load heavy components
const CompanyShowcase = lazy(() => import("../components/CompanyShowcase"));
const Mission = lazy(() => import("../components/Mission"));
const CoursesSection = lazy(() => import("../components/Courses"));
const WhyChooseUs = lazy(() => import("../components/WhyChooseUs"));
const CertificateSection = lazy(() => import("../components/CertificateSection"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const VideoTestimonials = lazy(() => import("../components/VideoTestimonials"));
const TrustpilotReviews = lazy(() => import("../components/TrustpilotReviews"));
const FAQ = lazy(() => import("../components/FAQ"));
const Footer = lazy(() => import("../components/Footer"));

// --- New Sleek UI Helpers ---

// 1. A minimalist, tech-forward loader (Spinner style matching the new emerald theme)
const SectionLoader = () => (
    <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
        <span className="text-gray-400 text-sm font-semibold tracking-wide uppercase">Loading Module...</span>
    </div>
);

// 2. A more elegant reveal: slight scale-up and custom spring-like easing
const SectionReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }} // Triggers slightly earlier
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// 3. A crisp, modern divider line (Emerald gradient)
const Divider = () => (
    <div className="w-full max-w-6xl mx-auto px-6 py-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
    </div>
);

export default function HomePageClient() {
    const { openModal } = useContactModal();

    const handleApplyNow = () => {
        openModal(
            'Claim Your Strategy Session',
            'Speak directly with our career advisors to map out your tech journey and find the perfect learning track.'
        );
    };

    return (
        // Deep Black/Green theme with Mint text selection
        <div className="relative min-h-screen bg-[#020604] text-gray-300 selection:bg-emerald-500/30 selection:text-emerald-100 overflow-x-hidden font-sans">

            {/* --- Revamped Background Effects (Matching Image Theme) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Concentric "Radar" Circles on the left */}
                <div className="absolute top-[30%] left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-emerald-500/10" />
                <div className="absolute top-[30%] left-0 -translate-y-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full border border-emerald-500/10" />
                <div className="absolute top-[30%] left-0 -translate-y-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full border border-emerald-500/5" />

                {/* Concentric "Radar" Circles on the bottom right */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full border border-emerald-500/10" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full border border-emerald-500/5" />

                {/* Asymmetric Atmospheric Lighting (Subtle Green Glows) */}
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-800/15 rounded-full blur-[120px]"></div>
            </div>

            {/* --- Main Content --- */}
            <div className="relative z-10 flex flex-col gap-0">

                <Navbar />

                {/* Note: You will need to update the text colors inside the Hero component itself to match the white/green emphasis from the image */}
                <Hero onApplyNow={handleApplyNow} />

                {/* Social Proof Immediately After Hero */}
                <Suspense fallback={<SectionLoader />}>
                    <SectionReveal className="pt-8 pb-12 bg-[#020604]/80 backdrop-blur-md border-b border-white/5">
                        <CompanyShowcase />
                    </SectionReveal>
                </Suspense>

                {/* Light integration of upcoming skills to bridge the gap */}
                <div className="py-8">
                    <UpcomingSkills />
                </div>

                {/* Core Offering */}
                <Suspense fallback={<SectionLoader />}>
                    <SectionReveal className="py-12 relative">
                        <CoursesSection />
                    </SectionReveal>
                </Suspense>

                <Divider />

                {/* "Why We Exist" */}
                <Suspense fallback={<SectionLoader />}>
                    <SectionReveal className="bg-zinc-900/30 backdrop-blur-sm py-16">
                        <Mission />
                    </SectionReveal>
                </Suspense>

                {/* Value Proposition Grouping */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#020604] via-[#05100a] to-[#020604]">
                    <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                    <Suspense fallback={<SectionLoader />}>
                        <SectionReveal className="pt-16">
                            <WhyChooseUs />
                        </SectionReveal>
                    </Suspense>

                    <Suspense fallback={<SectionLoader />}>
                        <SectionReveal className="pb-16 z-10 relative">
                            <CertificateSection onApplyNow={handleApplyNow} />
                        </SectionReveal>
                    </Suspense>
                </div>

                <Divider />

                {/* The "Wall of Love" (Grouped Social Proof) */}
                <div className="bg-[#050a08]/50 py-16">
                    <Suspense fallback={<SectionLoader />}>
                        <SectionReveal>
                            <Testimonials />
                        </SectionReveal>
                    </Suspense>

                    <Suspense fallback={<SectionLoader />}>
                        <SectionReveal className="mt-12">
                            <VideoTestimonials />
                        </SectionReveal>
                    </Suspense>

                    <Suspense fallback={<SectionLoader />}>
                        <SectionReveal className="mt-12">
                            <TrustpilotReviews />
                        </SectionReveal>
                    </Suspense>
                </div>

                <Divider />

                <Suspense fallback={<SectionLoader />}>
                    <SectionReveal className="py-16">
                        <FAQ />
                    </SectionReveal>
                </Suspense>

                <Suspense fallback={<div />}>
                    <Footer />
                </Suspense>

            </div>
        </div>
    );
}