import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Zap, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getUpcomingSkillsData } from '../utils/dataAdapter';
import type { UpcomingSkill } from '../types';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Sub-Component: Skill Card ---
const SkillCard = ({ skill }: { skill: UpcomingSkill }) => {
  // Determine color theme based on growth/demand text or random for visual variety
  // In a real app, you might map specific categories to specific colors.
  const isHighGrowth = skill.growth.includes('25%') || skill.growth.includes('30%') || parseInt(skill.growth) > 20;
  
  return (
    <div className="group relative w-[280px] flex-shrink-0 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800/60 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center text-3xl shadow-inner border border-zinc-700/50 group-hover:scale-110 transition-transform duration-300">
          {skill.icon}
        </div>
        <span className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-white transition-colors">
          {skill.category}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
        {skill.name}
      </h3>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1 p-2 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
          <span className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase font-semibold">
            <Activity className="w-3 h-3" /> Demand
          </span>
          <span className="text-sm font-medium text-emerald-400">
            {skill.demand}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-2 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
          <span className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase font-semibold">
            <TrendingUp className="w-3 h-3" /> Growth
          </span>
          <span className={cn(
            "text-sm font-medium",
            isHighGrowth ? "text-orange-400" : "text-blue-400"
          )}>
            {skill.growth}
          </span>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

export default function UpcomingSkills() {
  const [upcomingSkills, setUpcomingSkills] = useState<UpcomingSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUpcomingSkills = async () => {
      try {
        const data = await getUpcomingSkillsData();
        setUpcomingSkills(data);
      } catch (error) {
        console.error('Error loading upcoming skills:', error);
        setUpcomingSkills([]);
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingSkills();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (upcomingSkills.length === 0) return null;

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden border-b border-white/5">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_14px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-full">
        
        {/* --- Header --- */}
        <div className="text-center mb-16 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-yellow-500 mb-6"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>BE THE TOP 1%</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Next-Gen Skills for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Next-Level Success</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Master the tech of <span className="text-white font-medium">tomorrow, today</span>. Stay 10 steps ahead while others are playing catch-up.
          </motion.p>
        </div>

        {/* --- Infinite Marquee --- */}
        <div className="relative">
          {/* Side Fade Masks */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />

          {/* Scrolling Container */}
          <div className="flex overflow-hidden group">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{ 
                duration: 50, 
                ease: "linear", 
                repeat: Infinity 
              }}
              className="flex gap-6 px-6 flex-shrink-0 group-hover:[animation-play-state:paused]"
            >
              {/* Duplicate array 4 times to ensure no gaps on wide screens */}
              {[...upcomingSkills, ...upcomingSkills, ...upcomingSkills, ...upcomingSkills].map((skill, index) => (
                <SkillCard key={`${skill.id}-${index}`} skill={skill} />
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}