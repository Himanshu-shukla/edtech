import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdvantageStats from "../components/AdvantageStats";
import MentorProfiles from "../components/MentorProfiles";
import { getAboutPageData } from "../utils/dataAdapter";
import type { Value, Stat, Milestone } from "../types";

/* ---------------------------- Motion Variants ------------------------------ */

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

/* ----------------------------- Section Header ------------------------------ */

const SectionHeader = ({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
}) => (
  <div className="text-center mb-16 max-w-4xl mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-orange-400 mb-6"
    >
      <Sparkles className="w-3 h-3" />
      {badge}
    </motion.div>

    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-5xl font-bold text-white mb-6"
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

/* ------------------------------- Page ------------------------------------- */

export default function AboutPage() {
  const [values, setValues] = useState<Value[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAboutPageData();
        setValues(data.companyValues);
        setStats(data.aboutStats);
        setMilestones(data.companyMilestones);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <Navbar />

      <main className="pt-20">
        {/* HERO */}
        <section className="py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8">
            Transforming Lives Through{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Technology Education
            </span>
          </h1>
        </section>

        {/* STATS */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center"
            >
              <div className="text-4xl font-bold text-emerald-400">
                {stat.number}
              </div>
              <div className="text-zinc-500 text-sm uppercase mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* VALUES */}
        <section className="py-24">
          <SectionHeader
            badge="CULTURE"
            title={<>Our Core <span className="text-emerald-400">Values</span></>}
            subtitle="Principles that guide everything we do."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6"
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-3xl text-center"
              >
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-zinc-500 text-sm">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* TIMELINE */}
        <section ref={timelineRef} className="py-24">
          <SectionHeader
            badge="MILESTONES"
            title={<>Our Journey</>}
            subtitle="How we evolved over time."
          />

          <div className="relative max-w-6xl mx-auto px-6">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-800 -translate-x-1/2">
              <motion.div
                style={{ scaleY, originY: 0 }}
                className="absolute inset-0 bg-emerald-500"
              />
            </div>

            <div className="space-y-24">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8"
                >
                  <h3 className="font-bold text-xl">{m.title}</h3>
                  <p className="text-zinc-500 mt-2">{m.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <MentorProfiles />
        <AdvantageStats />

        {/* CTA */}
        <section className="py-24 text-center">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold"
          >
            Explore Programs <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
