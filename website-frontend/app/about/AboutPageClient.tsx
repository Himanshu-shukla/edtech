"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    motion,
    useScroll,
    useSpring,
} from "framer-motion";
import type { Variants } from "framer-motion";
import {
    ArrowRight, Sparkles, Target, Heart,
    Users, Zap, Trophy
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdvantageStats from "../../components/AdvantageStats";
import MentorProfiles from "../../components/MentorProfiles";
import { getAboutPageData } from "../../lib/dataAdapter";
import type { Value, Stat, Milestone } from "../../lib/types";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/* ---------------------------- Components ----------------------------------- */

const GridPattern = () => (
    <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
    </div>
);

const SectionHeader = ({
    badge,
    title,
    subtitle,
    center = true,
}: {
    badge: string;
    title: React.ReactNode;
    subtitle: string;
    center?: boolean;
}) => (
    <div className={cn("mb-16 max-w-4xl px-6", center ? "text-center mx-auto" : "")}>
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-orange-400 mb-6",
                !center && "origin-left"
            )}
        >
            <Sparkles className="w-3 h-3" />
            {badge}
        </motion.div>

        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
        >
            {title}
        </motion.h2>

        <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg leading-relaxed"
        >
            {subtitle}
        </motion.p>
    </div>
);

/* ---------------------------- Motion Variants ------------------------------ */

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const TimelineSection = ({ milestones, mounted }: { milestones: Milestone[], mounted: boolean }) => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start end", "end center"],
    });
    const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    if (!mounted) return null;

    return (
        <section ref={timelineRef} className="relative overflow-hidden py-24">
            <SectionHeader
                badge="MILESTONES"
                title="Our Journey"
                subtitle="From humble beginnings to an industry leader."
            />

            <div className="relative max-w-5xl mx-auto px-6">
                {/* Vertical Line */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800 md:-translate-x-1/2">
                    <motion.div
                        style={{ scaleY, originY: 0 }}
                        className="absolute inset-0 bg-gradient-to-b from-emerald-500 via-cyan-500 to-emerald-500"
                    />
                </div>

                <div className="space-y-12 md:space-y-24">
                    {milestones.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className={cn(
                                "relative flex flex-col md:flex-row gap-8 md:gap-0",
                                i % 2 === 0 ? "md:flex-row-reverse" : ""
                            )}
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-6 md:left-1/2 top-0 w-4 h-4 rounded-full bg-zinc-950 border-4 border-emerald-500 -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

                            {/* Content Card */}
                            <div className={cn(
                                "ml-12 md:ml-0 md:w-1/2",
                                i % 2 === 0 ? "md:pl-16 text-left" : "md:pr-16 md:text-right"
                            )}>
                                <div className="p-6 bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm rounded-2xl hover:border-zinc-600 transition-colors">
                                    <div className="inline-block px-3 py-1 rounded-lg bg-zinc-800 text-emerald-400 text-xs font-bold mb-3">
                                        {m.year || `Year ${2020 + i}`}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 md:block">
                                        {m.title}
                                    </h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {m.description}
                                    </p>
                                </div>
                            </div>

                            {/* Spacer for the other side */}
                            <div className="hidden md:block md:w-1/2" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default function AboutPageClient() {
    const [data, setData] = useState<{
        values: Value[];
        stats: Stat[];
        milestones: Milestone[];
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const load = async () => {
            try {
                const aboutData = await getAboutPageData();
                setData({
                    values: aboutData.companyValues || [],
                    stats: aboutData.aboutStats || [],
                    milestones: aboutData.companyMilestones || [],
                });
            } catch (error) {
                console.error("Failed to load about data:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-12 h-12 border-t-2 border-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    const { values, stats, milestones } = data || { values: [], stats: [], milestones: [] };

    // Value Icons Mapping
    const icons = [Target, Heart, Users, Zap];

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-emerald-500/30 overflow-hidden">
            <Navbar />

            <main className="pt-24 relative">
                <GridPattern />

                {/* --- HERO SECTION --- */}
                <section className="relative py-12 md:py-12 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-5xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Mission Driven
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-8">
                            Transforming Lives Through{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                                Tech Education
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                            We're not just an ed-tech company. We are a career accelerator designed to bridge the gap between academic knowledge and industry demands.
                        </p>
                    </motion.div>
                </section>

                {/* --- STATS SECTION --- */}
                <section className="py-12 border-y border-white/5 bg-zinc-900/20 backdrop-blur-sm">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="text-center group cursor-default"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                    {stat.number}
                                </div>
                                <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* --- VALUES SECTION --- */}
                <section className="py-24 relative">
                    {/* Background decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl -z-10" />

                    <SectionHeader
                        badge="OUR CULTURE"
                        title={<>Principles That <span className="text-emerald-400">Define Us</span></>}
                        subtitle="The core values that guide our curriculum, our community, and our growth."
                    />

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6"
                    >
                        {values.map((v, i) => {
                            const Icon = icons[i % icons.length];
                            return (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="group relative p-8 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 rounded-3xl transition-all duration-300 hover:-translate-y-2"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 group-hover:bg-emerald-500/20 flex items-center justify-center text-white group-hover:text-emerald-400 mb-6 transition-colors">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                                        {v.title}
                                    </h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                                        {v.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </section>

                {/* --- TIMELINE SECTION --- */}
                <TimelineSection milestones={milestones} mounted={mounted} />

                <section className="py-24">
                    <MentorProfiles />
                </section>

                <section className="py-24">
                    <AdvantageStats />
                </section>

                {/* --- CTA SECTION --- */}
                <section className="py-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-zinc-900" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3 shadow-2xl shadow-orange-500/20">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Write Your Success Story?
                        </h2>
                        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                            Join thousands of students who have already transformed their careers. The next chapter of your journey starts here.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/programs"
                                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                            >
                                Explore Programs
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-zinc-800 text-white font-bold text-lg border border-zinc-700 hover:bg-zinc-700 transition-all hover:scale-105 active:scale-95"
                            >
                                Talk to an Expert
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
