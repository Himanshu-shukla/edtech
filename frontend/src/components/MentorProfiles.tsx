import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Users } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getMentorsData, getPartnerCompaniesData } from '../utils/dataAdapter';
import type { Mentor, CompanyLogo } from '../types';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Sub-Component: Mentor Card ---
const MentorCard = ({ mentor, index }: { mentor: Mentor, index: number }) => {
  // Helper to construct image URLs
  const getImageUrl = (filename: string | undefined): string => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    return `${import.meta.env.VITE_API_BASE_URL}/uploads/team-images/${filename}`;
  };

  // Determine accent color based on prop (or fallback logic)
  const accentColor = 
    mentor.accent === 'blue' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' :
    mentor.accent === 'orange' ? 'text-orange-400 border-orange-500/20 bg-orange-500/10' :
    'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';

  const glowColor = 
    mentor.accent === 'blue' ? 'bg-blue-500/20' :
    mentor.accent === 'orange' ? 'bg-orange-500/20' :
    'bg-emerald-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative flex flex-col items-center p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-300"
    >
      {/* Background Glow on Hover */}
      <div className={cn("absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10", glowColor)} />

      {/* Avatar Container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-md transform scale-110 group-hover:scale-125 transition-transform" />
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-white/50 transition-colors">
          <img 
            src={getImageUrl(mentor.image)} 
            alt={mentor.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=18181b&color=fff`;
            }}
          />
        </div>
        {/* Status Dot */}
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-zinc-900 rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Info */}
      <h3 className="text-lg font-bold text-white mb-1 text-center">{mentor.name}</h3>
      <p className="text-zinc-400 text-sm font-medium mb-4 text-center">{mentor.role}</p>

      {/* Company Badge */}
      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wide", accentColor)}>
        <Briefcase className="w-3 h-3" />
        {mentor.company}
      </div>
    </motion.div>
  );
};

// --- Sub-Component: Infinite Marquee ---
const CompanyMarquee = ({ companies }: { companies: CompanyLogo[] }) => {
  return (
    <div className="relative w-full overflow-hidden py-4 mb-16 group">
      {/* Fade Masks */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />

      <motion.div
        className="flex gap-12 w-max"
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {/* Tripled list for smooth infinite loop */}
        {[...companies, ...companies, ...companies].map((company, idx) => (
          <div 
            key={`${company.name}-${idx}`} 
            className="flex items-center justify-center w-[120px] h-16 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
          >
            <img 
              src={company.logo} 
              alt={company.name} 
              className="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function MentorProfiles() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [partnerCompanies, setPartnerCompanies] = useState<CompanyLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mentorsData, partnersData] = await Promise.all([
          getMentorsData(),
          getPartnerCompaniesData()
        ]);
        setMentors(mentorsData);
        setPartnerCompanies(partnersData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-zinc-950 flex justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-blue-400 mb-6"
          >
            <Users className="w-3 h-3" />
            <span>EXPERT MENTORS</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Learn from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Industry Leaders</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg"
          >
            Get personalized guidance from professionals working at top companies who are passionate about your success.
          </motion.p>
        </div>

        {/* --- Partner Logos Marquee --- */}
        <CompanyMarquee companies={partnerCompanies} />

        {/* --- Mentors Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mentors.map((mentor, index) => (
            <MentorCard key={mentor.id} mentor={mentor} index={index} />
          ))}
        </div>

        {/* --- Bottom Trust Indicator --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 text-zinc-500 text-sm">
            <Building2 className="w-4 h-4" />
            <span>Our mentors come from Fortune 500 companies</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}