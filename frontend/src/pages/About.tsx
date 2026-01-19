import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Target, Eye, Rocket, ArrowRight, CheckCircle2, 
  Linkedin, Twitter, Sparkles, Globe, Heart 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdvantageStats from "../components/AdvantageStats";
import MentorProfiles from "../components/MentorProfiles";
import { getAboutPageData } from "../utils/dataAdapter";
import type { TeamMember, Value, Stat, Milestone } from "../types";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Helper Components ---

const SectionHeader = ({ badge, title, subtitle }: { badge: string, title: React.ReactNode, subtitle: string }) => (
  <div className="text-center mb-16 max-w-4xl mx-auto px-6">
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-orange-400 mb-6"
    >
      <Sparkles className="w-3 h-3" />
      <span>{badge}</span>
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
      className="text-zinc-400 text-lg"
    >
      {subtitle}
    </motion.p>
  </div>
);

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [values, setValues] = useState<Value[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (filename: string | undefined, folder: string = 'team-images'): string => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    return `${import.meta.env.VITE_API_BASE_URL}/uploads/${folder}/${filename}`;
  };

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const data = await getAboutPageData();
        setTeamMembers(data.teamMembers);
        setValues(data.companyValues);
        setStats(data.aboutStats);
        setMilestones(data.companyMilestones);
      } catch (error) {
        console.error('Error loading about data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-emerald-500 rounded-full animate-spin" />
          <span className="text-zinc-500 text-sm animate-pulse">Loading Experience...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-orange-500/30">
      <Navbar />
      
      <main className="pt-20">
        
        {/* --- HERO SECTION --- */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Backgrounds */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-sm font-medium text-emerald-400 mb-8">
                <Globe className="w-4 h-4" />
                <span>OUR STORY</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
                Transforming Lives Through <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400">
                  Technology Education
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-16">
                <span className="text-white font-medium">Learn what matters</span>, <span className="text-white font-medium">achieve what you dream</span>. 
                Your future in tech starts here.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className={cn("text-3xl md:text-4xl font-bold mb-2", `text-${stat.color}`)}>
                      {stat.number}
                    </div>
                    <div className="text-zinc-500 text-sm font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- MISSION & VISION --- */}
        <section className="py-24 relative bg-zinc-900/30 border-y border-white/5">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader 
              badge="PURPOSE"
              title={<>Our <span className="text-blue-400">Mission</span> & <span className="text-orange-400">Vision</span></>}
              subtitle="Driving the future of education with purpose and vision that transforms lives."
            />

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Mission Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="group p-8 md:p-12 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-500/10 transition-colors" />
                
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  To make <span className="text-blue-400 font-medium">next-gen technology education</span> accessible to everyone. 
                  With expert guidance, we empower anyone to build an <span className="text-white font-medium">exceptional career</span> in tech.
                </p>
              </motion.div>
              
              {/* Vision Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="group p-8 md:p-12 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-orange-500/30 transition-all shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-orange-500/10 transition-colors" />
                
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  To be the premier platform for <span className="text-orange-400 font-medium">practical education</span>, 
                  creating a future where <span className="text-white font-medium">top talent</span> and global opportunities connect seamlessly.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- VALUES --- */}
        <section className="py-24 relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
           
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <SectionHeader 
              badge="CULTURE"
              title={<>Our Core <span className="text-emerald-400">Values</span></>}
              subtitle="The principles that drive excellence in everything we do."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all text-center"
                >
                  <div className="w-14 h-14 mx-auto bg-zinc-950 rounded-xl flex items-center justify-center mb-6 text-emerald-400 shadow-lg group-hover:scale-110 transition-transform">
                    {/* Render SVG path from API */}
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.iconPath} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- ADVANTAGE STATS --- */}
        {/* <AdvantageStats /> */}

        {/* --- TIMELINE JOURNEY --- */}
        <section className="py-24 relative">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader 
              badge="MILESTONES"
              title={<>Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Journey</span></>}
              subtitle="From ambitious beginnings to a global education powerhouse."
            />

            <div className="relative mt-20">
              {/* Central Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-orange-500 to-blue-500 md:-translate-x-1/2" />
              
              <div className="space-y-20">
                {milestones.map((milestone, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={cn(
                      "relative flex items-center md:justify-between",
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                  >
                    {/* Spacer for desktop layout */}
                    <div className="hidden md:block w-5/12" />
                    
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-zinc-950 border-4 border-emerald-500 md:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    
                    {/* Content Card */}
                    <div className="ml-12 md:ml-0 md:w-5/12">
                      <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm hover:border-zinc-700 transition-colors">
                        <span className="inline-block px-3 py-1 rounded-md bg-zinc-950 text-emerald-400 text-sm font-bold mb-3 border border-zinc-800">
                          {milestone.year}
                        </span>
                        <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Future Node */}
              <div className="relative mt-20 flex justify-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative z-10 p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 text-center max-w-md shadow-2xl"
                >
                  <Rocket className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Building Tomorrow</h3>
                  <p className="text-zinc-500 text-sm">
                    Our journey continues as we innovate to shape the future of technology education.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* --- MENTORS --- */}
        <MentorProfiles />

        {/* --- TEAM --- */}
        <section className="py-24 relative overflow-hidden border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader 
              badge="PEOPLE"
              title={<>Meet Our <span className="text-red-400">Team</span></>}
              subtitle="Passionate educators dedicated to your success."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/30 transition-all text-center"
                >
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={getImageUrl(member.image)}
                      alt={member.name}
                      className="relative w-32 h-32 rounded-full object-cover border-4 border-zinc-950 group-hover:border-emerald-500/50 transition-colors"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=18181b&color=fff`;
                      }}
                    />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide mb-4">{member.role}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {member.bio}
                  </p>
                  
                  <div className="flex justify-center gap-3">
                    <a href={member.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-zinc-950 text-zinc-400 hover:text-blue-400 hover:bg-zinc-900 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href={member.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-zinc-950 text-zinc-400 hover:text-sky-400 hover:bg-zinc-900 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                🚀 Ready to Transform Your Life?
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-orange-400">Journey</span> Today
              </h2>
              
              <p className="text-zinc-300 text-lg mb-10 max-w-2xl mx-auto">
                Join our community of high-achievers. Your gateway to global opportunities begins here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/programs" 
                  className="group relative overflow-hidden px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Programs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
                </Link>
                
                <Link 
                  to="/contact" 
                  className="px-8 py-4 rounded-full border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors"
                >
                  Book Strategy Call
                </Link>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 text-sm text-zinc-500 font-medium">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500" /> 4.8/5 Rating
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> 1000+ Success Stories
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-500" /> Industry Certified
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