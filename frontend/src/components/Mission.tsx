import { motion } from 'framer-motion';
import { Target, ArrowDown, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Assets ---
import microsoftPartnerDesktop from '../assets/misson_microsoft_partner_desktop.webp';
import microsoftPartnerMobile from '../assets/misson_microsoft_partner_mobile.webp';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data ---
const desktopImages = [
  {
    id: 1,
    title: "Continuous Feedback",
    desc: "Personalized insights to accelerate your growth.",
    src: '../src/assets/Mithilesh Kumar — Business Analyst “The program gave me strong practical exposure with real-world case studies. The mentors were supportive and the curriculum was well structured, helping me build.jpg',
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Expert Mentorship",
    desc: "1-on-1 guidance from industry veterans.",
    src: `../src/assets/Rakul Mehta - Senior Data Scientist, Microsoft The mentor's video session gave me real insights into industry practices. His practical tips and guidance were easy to apply and boosted my confidenc.png`,
    color: "from-emerald-500 to-green-500"
  },
  {
    id: 3,
    title: "Global Certification",
    desc: "Credentials that validate your expertise worldwide.",
    src: '../src/assets/Earn Industry-Recognized Certifications Validate your skills with credentials that boost your career and open global opportunities.jpg',
    color: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Microsoft Partner",
    desc: "Authorized training that meets global standards.",
    src: microsoftPartnerDesktop,
    color: "from-purple-500 to-indigo-500"
  }
];

const mobileImages = [
  {
    id: 1,
    title: "Feedback",
    src: 'https://thinkwht.in/wp-content/uploads/2025/10/Feedback.webp',
    color: "text-blue-400"
  },
  {
    id: 2,
    title: "Mentorship",
    src: 'https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video-1.webp',
    color: "text-emerald-400"
  },
  {
    id: 3,
    title: "Guidance",
    src: 'https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video-2.webp',
    color: "text-orange-400"
  },
  {
    id: 4,
    title: "Partner",
    src: microsoftPartnerMobile,
    color: "text-purple-400"
  }
];

// --- Sub-Component: Desktop Card ---
const DesktopCard = ({ item, index }: { item: typeof desktopImages[0], index: number, total: number }) => {
  // Calculate top offset for stacking effect (e.g., 120px, 140px, 160px...)
  const topOffset = 120 + index * 20;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="sticky w-full max-w-5xl mx-auto mb-24"
      style={{ top: `${topOffset}px`, zIndex: index + 1 }}
    >
      <div className="relative group rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/90 backdrop-blur-xl shadow-2xl">
        
        {/* Header Bar inside card */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/60 to-transparent z-20 flex items-center px-6 justify-between pointer-events-none">
          <div className="flex items-center gap-3">
             <div className={cn("flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br shadow-lg text-white font-bold text-sm", item.color)}>
               {index + 1}
             </div>
             <span className="text-white font-semibold text-lg tracking-tight">{item.title}</span>
          </div>
          <div className="text-zinc-400 text-sm font-medium hidden sm:block">
            {item.desc}
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-[1102/312] overflow-hidden bg-zinc-950">
          <img
            src={item.src}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
        </div>

        {/* Bottom decorative border */}
        <div className={cn("h-1 w-full bg-gradient-to-r", item.color)} />
      </div>
    </motion.div>
  );
};

// --- Sub-Component: Mobile Card ---
const MobileCard = ({ item, index }: { item: typeof mobileImages[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="sticky top-24 mb-12 z-10"
    >
      <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl">
        {/* Mobile Header */}
        <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
           <span className={cn("text-xs font-bold uppercase tracking-wider", item.color)}>
             Step {index + 1}
           </span>
           <span className="text-zinc-600">|</span>
           <span className="text-white font-semibold text-sm">{item.title}</span>
        </div>

        <div className="relative aspect-[393/574]">
           <img
             src={item.src}
             alt={item.title}
             loading="lazy"
             className="w-full h-full object-cover"
           />
        </div>
      </div>
    </motion.div>
  );
};

export default function Mission() {
  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-emerald-400 mb-6"
          >
            <Target className="w-3 h-3" />
            <span>YOUR JOURNEY</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Your Journey, Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Mission</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            From <span className="text-white font-medium">personalized feedback</span> to <span className="text-white font-medium">expert mentorship</span> and industry-recognized certifications — we're committed to your success.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <ArrowDown className="w-6 h-6 text-zinc-600 animate-bounce" />
          </motion.div>
        </div>

        {/* --- Stacking Cards Container --- */}
        <div className="relative min-h-[100vh]">
          {/* Vertical Line through the timeline (Optional visual guide) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-zinc-800 via-zinc-800 to-transparent -translate-x-1/2 hidden md:block" />

          {/* Desktop Layout */}
          <div className="hidden md:block">
            {desktopImages.map((image, index) => (
              <DesktopCard 
                key={image.id} 
                item={image} 
                index={index} 
                total={desktopImages.length} 
              />
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden max-w-sm mx-auto">
            {mobileImages.map((image, index) => (
              <MobileCard 
                key={image.id} 
                item={image} 
                index={index} 
              />
            ))}
          </div>

          {/* Final "Success" Marker */}
          <div className="sticky top-[220px] md:top-[200px] flex justify-center py-12 z-0">
             <div className="flex flex-col items-center gap-3 opacity-50">
               <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                 <CheckCircle2 className="w-6 h-6 text-emerald-500" />
               </div>
               <span className="text-xs text-zinc-500 uppercase tracking-widest">Success Achieved</span>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};