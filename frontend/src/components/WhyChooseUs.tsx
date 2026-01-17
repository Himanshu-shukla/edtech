import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, Users, Target, ShieldCheck, 
  Zap, Laptop, GraduationCap, Globe 
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getMentorFeaturesData } from '../utils/dataAdapter';
import type { MentorFeature } from '../types';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Icons Mapping ---
// Since the API might return text/emojis, we map indices to premium Lucide icons
// to ensure the UI looks consistent and high-end.
const ICONS = [
  { icon: Rocket, color: "text-orange-400", bg: "bg-orange-500/10", border: "group-hover:border-orange-500/30" },
  { icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "group-hover:border-blue-500/30" },
  { icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "group-hover:border-emerald-500/30" },
  { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "group-hover:border-yellow-500/30" },
  { icon: Laptop, color: "text-purple-400", bg: "bg-purple-500/10", border: "group-hover:border-purple-500/30" },
  { icon: ShieldCheck, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "group-hover:border-cyan-500/30" },
  { icon: GraduationCap, color: "text-pink-400", bg: "bg-pink-500/10", border: "group-hover:border-pink-500/30" },
  { icon: Globe, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "group-hover:border-indigo-500/30" },
];

export default function WhyChooseUs() {
  const [features, setFeatures] = useState<MentorFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await getMentorFeaturesData();
        setFeatures(data);
      } catch (error) {
        console.error('Error loading mentor features:', error);
        setFeatures([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  // --- Loading Skeleton ---
  if (loading) {
    return (
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-3xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-orange-400 mb-6"
          >
            <Rocket className="w-3 h-3" />
            <span>FAST-TRACK YOUR CAREER</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Ambition</span> into Achievement
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Learn from <span className="text-blue-400 font-medium">industry experts</span>, work on <span className="text-orange-400 font-medium">real projects</span>, and follow a path designed just for you.
          </motion.p>
        </div>

        {/* --- Features Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            // Get styling based on index (cycling through ICONS array)
            const style = ICONS[index % ICONS.length];
            const IconComponent = style.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={cn(
                  "group relative p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900/60",
                  style.border
                )}
              >
                {/* Icon Container */}
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110",
                  style.bg,
                  style.color
                )}>
                  <IconComponent className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
                  {feature.title}
                </h3>
                
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Subtle Hover Gradient Blob inside card */}
                <div className={cn(
                  "absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
                  style.bg.replace('/10', '') // remove opacity for the blur blob color base
                )} />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}