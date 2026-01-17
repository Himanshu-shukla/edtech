import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Assets ---
import certificate1 from '../assets/certificate1.webp';
import certificate2 from '../assets/certificate2.webp';
import certificate3 from '../assets/certificate3.webp';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CertificateSectionProps {
  onApplyNow: () => void;
}

// --- Data ---
const benefits = [
  {
    title: "Verified Completion",
    desc: "Official validation of your expert-led training.",
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Project Portfolio",
    desc: "Proof of hands-on experience with real-world apps.",
    icon: Sparkles,
    color: "text-orange-400",
    bg: "bg-orange-500/10"
  },
  {
    title: "Employer Ready",
    desc: "Showcase your skills to top hiring partners.",
    icon: CheckCircle2,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    title: "Shareable Digital ID",
    desc: "Add directly to your LinkedIn profile with one click.",
    icon: Award,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  }
];

const certificates = [
  { id: 1, src: certificate1, alt: 'Professional Certificate 1' },
  { id: 2, src: certificate2, alt: 'Professional Certificate 2' },
  { id: 3, src: certificate3, alt: 'Professional Certificate 3' }
];

export default function CertificateSection({ onApplyNow }: CertificateSectionProps) {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % certificates.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + certificates.length) % certificates.length);

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- Left Column: Content --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-blue-400 mb-6">
              <Award className="w-3 h-3" />
              <span>INDUSTRY RECOGNIZED</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Professional</span> Certificate
            </h2>

            <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
              Upon successful completion, receive a globally recognized credential that validates your expertise and demonstrates your commitment to professional growth.
            </p>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {benefits.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4"
                >
                  <div className={cn("flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center", item.bg)}>
                    <item.icon className={cn("w-5 h-5", item.color)} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onApplyNow}
              className="relative overflow-hidden group inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                Earn Your Certificate <ArrowRight className="w-4 h-4" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
            </motion.button>
          </motion.div>

          {/* --- Right Column: Certificate Visual --- */}
          <div className="relative">
            {/* Background Glow for Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              {/* Frame */}
              <div className="relative aspect-[4/3] w-full rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl p-2 sm:p-4">
                
                {/* Carousel Container */}
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-950">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={current}
                      src={certificates[current].src}
                      alt={certificates[current].alt}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-contain bg-white" 
                    />
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {certificates.length > 1 && (
                    <>
                      <button 
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all hover:scale-110"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all hover:scale-110"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Reflection/Glass Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-inset ring-white/10" />
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {certificates.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      current === idx ? "w-8 bg-blue-500" : "w-2 bg-zinc-700 hover:bg-zinc-600"
                    )}
                  />
                ))}
              </div>

              {/* Floating 3D Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 sm:-right-10 bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-2xl shadow-lg shadow-orange-500/20 border border-white/20 hidden sm:block"
              >
                <Award className="w-8 h-8 text-white" />
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}