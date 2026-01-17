import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Sparkles, CheckCircle2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Imports ---
import LazyTypewriter from "./LazyTypewriter";
import LazyGlobe from "./LazyGlobe";
import { getCompanyInfoData } from "../utils/dataAdapter";
import type { CompanyInfo } from "../types";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Sub-Component: Floating Badge ---
const FloatingBadge = ({ text, delay, top, left, right, bottom }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
    className={cn(
      "absolute hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700 backdrop-blur-md shadow-xl z-20",
      top && `top-[${top}]`,
      bottom && `bottom-[${bottom}]`,
      left && `left-[${left}]`,
      right && `right-[${right}]`
    )}
    style={{ top, bottom, left, right }}
  >
    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
    <span className="text-xs font-medium text-white">{text}</span>
  </motion.div>
);

export default function Hero({ onApplyNow }: { onApplyNow: () => void }) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const data = await getCompanyInfoData();
        setCompanyInfo(data);
      } catch (error) {
        console.error('Error loading company info:', error);
        setCompanyInfo({
          whatsappNumber: '',
          supportEmail: '',
          heroRoles: ['Build Future', 'Learn Tech', 'Grow Fast'],
          carouselRoles: ['Developer', 'Engineer', 'Architect', 'Designer'],
          marketingStats: [],
          whatsappQuickMessages: [],
          pricingFaq: [],
          courseBenefitsComparison: []
        });
      } finally {
        setLoading(false);
      }
    };
    loadCompanyInfo();
  }, []);

  // Loading Skeleton
  if (loading || !companyInfo) {
    return (
      <header className="relative h-screen bg-zinc-950 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-emerald-500 rounded-full animate-spin" />
          <span className="text-zinc-500 text-sm animate-pulse">Initializing Environment...</span>
        </div>
      </header>
    );
  }

  return (
    <header className="relative min-h-[850px] lg:h-screen w-full bg-zinc-950 overflow-hidden flex items-center pt-20">
      
      {/* --- Background Atmosphere --- */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Radial Fade for Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
        
        {/* Color Blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* --- Left Column: Content --- */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-emerald-400 mb-6"
          >
            <Sparkles className="w-3 h-3" />
            <span>POWERING THE NEXT GEN</span>
          </motion.div>

          {/* Typewriter Headline */}
          <div className="h-[140px] sm:h-[160px] lg:h-[180px] flex items-start mb-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              <span className="block text-white mb-2">We Help You</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">
                <LazyTypewriter
                  options={{
                    strings: companyInfo.heroRoles,
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 30,
                    cursor: '|'
                  }}
                />
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 mb-8 max-w-xl leading-relaxed -mt-4"
          >
            <span className="text-white font-medium">Learn what matters</span>, 
            <span className="text-white font-medium"> achieve what you dream</span>. 
            Join the elite community of developers shaping the future of tech.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button 
              onClick={onApplyNow}
              className="relative group overflow-hidden px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
            </button>
            
            <button 
              onClick={onApplyNow}
              className="px-8 py-4 rounded-full border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Talk to an Expert
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center gap-4 text-sm text-zinc-500"
          >
            <div className="flex -space-x-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
                   {/* Placeholder avatars - replace with real images if available */}
                   <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-white font-bold">
                4.9/5.0 <div className="flex text-emerald-500"><CheckCircle2 className="w-3 h-3 fill-current" /></div>
              </span>
              <span>from 10k+ students</span>
            </div>
          </motion.div>
        </div>

        {/* --- Right Column: Visuals --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[500px] lg:h-[700px] w-full flex items-center justify-center order-1 lg:order-2"
        >
          {/* Globe Container - Center of visuals */}
          <div className="relative w-full h-full flex items-center justify-center z-10">
            <LazyGlobe className="w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] lg:w-[650px] lg:h-[650px]" />
          </div>

          {/* Floating Role Badges (Simulating the old carousel but cleaner) */}
          <div className="absolute inset-0 pointer-events-none">
            {companyInfo.carouselRoles.slice(0, 4).map((role, idx) => {
              // Custom positions for floating badges
              const positions = [
                { top: "15%", right: "10%" },
                { bottom: "25%", left: "5%" },
                { top: "30%", left: "0%" },
                { bottom: "15%", right: "15%" }
              ];
              const pos = positions[idx % positions.length];
              
              return (
                <FloatingBadge 
                  key={idx} 
                  text={role} 
                  delay={0.6 + (idx * 0.2)} 
                  {...pos}
                />
              );
            })}
          </div>
          
          {/* Glow Behind Globe */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] -z-10" />
        </motion.div>

      </div>
    </header>
  );
}