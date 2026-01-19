import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Sparkles,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* ----------------------------- Utility ----------------------------- */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ----------------------------- Mock Data ---------------------------- */
const testimonials = [
  { id: "1", name: "Sarah J.", role: "Data Analyst", url: "/videos/testimonial-1.mp4", likes: "1.2k" },
  { id: "2", name: "Mike T.", role: "Full Stack Dev", url: "/videos/testimonial-2.mp4", likes: "856" },
  { id: "3", name: "Emily R.", role: "UX Designer", url: "/videos/testimonial-3.mp4", likes: "2.4k" },
  { id: "4", name: "David K.", role: "Product Mgr", url: "/videos/testimonial-4.mp4", likes: "902" },
  { id: "5", name: "Jessica L.", role: "Cloud Arch", url: "/videos/testimonial-5.mp4", likes: "1.5k" },
  { id: "6", name: "Alex M.", role: "Cybersec Lead", url: "/videos/testimonial-6.mp4", likes: "3.1k" },
];

/* ----------------------------- Video Card --------------------------- */
function VideoCard({
  video,
  isPlaying,
  onTogglePlay,
}: {
  video: typeof testimonials[number];
  isPlaying: boolean;
  onTogglePlay: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (isPlaying) {
      el.muted = isMuted;
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isPlaying, isMuted]);

  return (
    <div
      onClick={onTogglePlay}
      className={cn(
        "relative flex-shrink-0 w-[260px] h-[460px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 cursor-pointer transition-all",
        isPlaying
          ? "scale-[1.03] border-orange-500/60 shadow-[0_0_30px_rgba(249,115,22,0.35)] z-20"
          : "hover:border-zinc-700"
      )}
    >
      <video
        ref={videoRef}
        src={video.url}
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

      {/* Mute */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted((v) => !v);
        }}
        className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 text-white"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Play Icon */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm font-bold text-white">{video.name}</h3>
            <p className="text-xs text-zinc-400">{video.role}</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-zinc-800/60 text-white hover:text-red-500">
              <Heart size={18} />
            </div>
            <span className="text-[10px] text-white/80">{video.likes}</span>
            <div className="p-2 rounded-full bg-zinc-800/60 text-white hover:text-emerald-500">
              <Share2 size={18} />
            </div>
          </div>
        </div>

        {/* Fake progress */}
        {isPlaying && (
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 15, ease: "linear" }}
            className="h-1 bg-orange-500 rounded-full mt-4"
          />
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Marquee Row -------------------------- */
function MarqueeRow({
  items,
  activeId,
  onClick,
}: {
  items: typeof testimonials;
  activeId: string | null;
  onClick: (id: string) => void;
}) {
  const paused = activeId !== null;

  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          "flex gap-6 py-6 w-max",
          !paused && "animate-scroll-left",
          paused && "animate-none"
        )}
      >
        {[...items, ...items].map((video, idx) => (
          <VideoCard
            key={`${video.id}-${idx}`}
            video={video}
            isPlaying={activeId === video.id}
            onTogglePlay={() => onClick(video.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Main Component ----------------------- */
export default function VideoTestimonials() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:30px_30px]" />

      <div className="relative z-10 max-w-full">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-purple-400 mb-4">
            <Sparkles size={14} />
            REAL RESULTS
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Real Professionals,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Real Stories
            </span>
          </h2>

          <p className="text-zinc-400">
            Tap on any card to hear their journey.
          </p>
        </div>

        {/* Marquee */}
        <MarqueeRow
          items={testimonials}
          activeId={activeVideoId}
          onClick={(id) =>
            setActiveVideoId((prev) => (prev === id ? null : id))
          }
        />
      </div>
    </section>
  );
}