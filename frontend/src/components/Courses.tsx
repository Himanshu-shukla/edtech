import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import toast from "react-hot-toast";
import {
  Clock,
  BarChart,
  ChevronRight,
  ShoppingCart,
  Sparkles,
} from "lucide-react";


import {
  getFeaturedCoursesData,
  getCourseIcon,
  getCourseDetailsData,
} from "../utils/dataAdapter";
import type { Course } from "../types";
import MicrosoftBadge from "./MicrosoftBadge";
import { usePaymentModal } from "../contexts/PaymentModalContext";


/* ---------------------------- Motion Variants ----------------------------- */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
    },
  },
};

/* ----------------------------- Main Section -------------------------------- */

export default function CoursesSection() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [courseIcons, setCourseIcons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { openModal: openPaymentModal } = usePaymentModal();

  useEffect(() => {
    const loadFeaturedCourses = async () => {
      try {
        const data = await getFeaturedCoursesData();
        setFeaturedCourses(data);

        const iconPromises = data.map(async (course) => ({
          id: course.id,
          icon: await getCourseIcon(course),
        }));

        const resolvedIcons = await Promise.all(iconPromises);
        setCourseIcons(
          resolvedIcons.reduce((acc, cur) => {
            acc[cur.id] = cur.icon;
            return acc;
          }, {} as Record<string, string>)
        );
      } catch (error) {
        console.error(error);
        setFeaturedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCourses();
  }, []);

  const handleBuyNow = async (course: Course) => {
    try {
      const courseDetails = await getCourseDetailsData(course.id);
      if (!courseDetails?.pricing?.current) {
        toast.error("Pricing unavailable");
        return;
      }
      openPaymentModal(
        course,
        courseDetails.pricing.current,
        "home-featured-courses"
      );
    } catch {
      toast.error("Unable to load pricing");
    }
  };

  return (
    <section
      id="featured-programs"
      className="relative py-20 overflow-hidden"
    >
      {/* Glow Background */}
      <div className="absolute -left-64 top-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px]" />
      <div className="absolute -right-64 bottom-1/4 w-96 h-96 bg-orange-500/10 blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-orange-400">
            <Sparkles className="w-3 h-3" />
            MOST POPULAR PROGRAMS
          </div>

          <div className="flex justify-center">
            <MicrosoftBadge size="md" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Top-Rated{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              Programs
            </span>
          </h2>

          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Industry-recognized certifications that accelerate careers.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[420px] rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Courses */}
        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                iconPath={courseIcons[course.id]}
                onBuy={() => handleBuyNow(course)}
              />
            ))}
          </motion.div>
        )}

        {/* Footer CTA */}
        <div className="flex justify-center mt-14">
          <Link
            to="/programs"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-orange-500/50 hover:text-white transition"
          >
            View All Programs
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Course Card -------------------------------- */

function CourseCard({
  course,
  iconPath,
  onBuy,
}: {
  course: Course;
  iconPath?: string;
  onBuy: () => void;
}) {
  const imageUrl = course.image
    ? `${import.meta.env.VITE_API_BASE_URL}/uploads/course-images/${course.image}`
    : null;

  return (
    <motion.div
      variants={cardVariants}
      className="group flex flex-col rounded-3xl bg-zinc-900/40 border border-zinc-800 overflow-hidden hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-zinc-950">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={course.title}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-orange-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d={iconPath || "M13 10V3L4 14h7v7l9-11h-7z"} />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold text-white mb-2">
          {course.title}
        </h3>
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
          {course.desc}
        </p>

        <div className="flex gap-4 text-xs text-zinc-500 mb-6">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="w-3.5 h-3.5" />
            {course.extra}
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <Link
            to={`/program/${course.id}`}
            className="py-2.5 rounded-xl bg-zinc-800 text-center text-sm font-semibold text-zinc-300 hover:bg-zinc-700"
          >
            Details
          </Link>
          <button
            onClick={onBuy}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-sm hover:scale-[1.02] transition"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
