import { useState, useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  TrendingUp,
  Users,
  Zap,
  Award,
  BarChart3,
  Globe,
  Sparkles,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { getAdvantageStatsData } from "../utils/dataAdapter";
import type { AdvantageStat } from "../types";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Motion Variants (FIXED) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut, // ✅ FIXED
    },
  },
};

export default function AdvantageStats() {
  const [advantageStats, setAdvantageStats] = useState<AdvantageStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdvantageStats = async () => {
      try {
        const data = await getAdvantageStatsData();
        setAdvantageStats(data);
      } catch (error) {
        console.error("Error loading advantage stats:", error);
        setAdvantageStats([]);
      } finally {
        setLoading(false);
      }
    };
    loadAdvantageStats();
  }, []);

  // Icon mapping
  const getIcon = (index: number) => {
    const icons = [TrendingUp, Zap, Users, Award, BarChart3, Globe];
    const Icon = icons[index % icons.length];
    return <Icon className="w-6 h-6" />;
  };

  // Color mapping
  const getColorStyles = (accent: string) => {
    switch (accent) {
      case "orange":
        return {
          text: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "group-hover:border-orange-500/50",
          icon: "text-orange-400",
        };
      case "green":
        return {
          text: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "group-hover:border-emerald-500/50",
          icon: "text-emerald-400",
        };
      default:
        return {
          text: "text-cyan-400",
          bg: "bg-cyan-500/10",
          border: "group-hover:border-cyan-500/50",
          icon: "text-cyan-400",
        };
    }
  };

  if (loading) {
    return (
      <section className="py-24 px-6 bg-zinc-950 flex justify-center">
        <div className="w-8 h-8 border-t-2 border-emerald-500 rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative py-24 px-6 bg-zinc-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-orange-400 mb-6"
          >
            <Sparkles className="w-3 h-3" />
            THE EDTECH ADVANTAGE
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Transform,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Excel
            </span>
            , & Dominate.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, ease: easeOut }}
            className="text-zinc-400 text-lg"
          >
            Numbers that speak for themselves. Join the community redefining tech education.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {advantageStats.map((stat, index) => {
            const styles = getColorStyles(stat.accent);

            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                className={cn(
                  "group relative p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-900/80 transition-all duration-300",
                  styles.border
                )}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-3 rounded-xl", styles.bg, styles.icon)}>
                      {getIcon(index)}
                    </div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest border border-zinc-800 px-2 py-1 rounded-lg">
                      {stat.title}
                    </span>
                  </div>

                  <div className={cn("text-4xl md:text-5xl font-extrabold mb-2", styles.text)}>
                    {stat.value}
                  </div>

                  <div className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                    {stat.label}
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
