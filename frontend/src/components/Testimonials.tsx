import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote, Star, User, Briefcase } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  getTestimonialsData,
  getSuccessStatsData,
} from "../utils/dataAdapter";
import type { Testimonial, SuccessStat } from "../types";

/* ---------------------------------- Utils --------------------------------- */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------------- Accent Color Mapping --------------------------- */
/**
 * Maps backend/domain accent values → Tailwind classes
 * Keeps UI decoupled from API
 */
const ACCENT_COLOR_MAP: Record<
  "green" | "orange" | "blue" | "red",
  string
> = {
  green: "bg-emerald-500",
  orange: "bg-orange-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
};

/* ----------------------------- Counter Block ------------------------------- */
function Counter({
  value,
  label,
  colorClass,
  delay,
}: {
  value: string;
  label: string;
  colorClass: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: "spring", delay, stiffness: 100 }}
      className="relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center"
    >
      <div className={cn("text-4xl font-extrabold mb-2", colorClass)}>
        {value}
      </div>
      <div className="text-zinc-400 text-sm uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

/* ----------------------------- Main Section -------------------------------- */
export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [successStats, setSuccessStats] = useState<SuccessStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, s] = await Promise.all([
          getTestimonialsData(),
          getSuccessStatsData(),
        ]);
        setTestimonials(t);
        setSuccessStats(s);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="relative py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Learner <span className="text-orange-400">Success Stories</span>
          </h2>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {successStats.map((stat, i) => (
              <Counter
                key={i}
                value={stat.value}
                label={stat.label}
                delay={i * 0.1}
                colorClass={
                  i === 0
                    ? "text-emerald-400"
                    : i === 1
                    ? "text-orange-400"
                    : "text-blue-400"
                }
              />
            ))}
          </div>
        )}

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="text-zinc-500">Loading…</p>
          ) : (
            testimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Testimonial Card ------------------------------ */
function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  // ✅ SAFE: accent is guaranteed union
  const accentClass =
    ACCENT_COLOR_MAP[testimonial.accent ?? "blue"];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:-translate-y-1 transition"
    >
      {/* Quote */}
      <Quote className="absolute top-6 right-6 w-12 h-12 text-zinc-800" />

      {/* Category */}
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 mb-4">
        <Briefcase className="w-3 h-3" />
        {testimonial.category}
      </span>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              i < testimonial.rating
                ? "w-4 h-4 fill-yellow-500 text-yellow-500"
                : "w-4 h-4 text-zinc-700"
            }
          />
        ))}
      </div>

      {/* Review */}
      <p className="text-zinc-300 mb-8">
        “{testimonial.review}”
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
        <div className="relative">
          <div
            className={cn(
              "absolute inset-0 rounded-full blur opacity-30",
              accentClass
            )}
          />
          {testimonial.photo ? (
            <img
              src={testimonial.photo}
              className="relative w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="relative w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
              <User className="w-6 h-6 text-zinc-400" />
            </div>
          )}
        </div>

        <div>
          <h4 className="text-white font-bold text-sm">
            {testimonial.name}
          </h4>
          <p className="text-xs text-zinc-500">
            {testimonial.role}
            {testimonial.company && ` · ${testimonial.company}`}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
