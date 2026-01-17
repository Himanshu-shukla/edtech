import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Heart, Share2, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const testimonials = [
  { id: '1', name: 'Sarah J.', role: 'Data Analyst', url: '/videos/testimonial-1.mp4', likes: '1.2k' },
  { id: '2', name: 'Mike T.', role: 'Full Stack Dev', url: '/videos/testimonial-2.mp4', likes: '856' },
  { id: '3', name: 'Emily R.', role: 'UX Designer', url: '/videos/testimonial-3.mp4', likes: '2.4k' },
  { id: '4', name: 'David K.', role: 'Product Mgr', url: '/videos/testimonial-4.mp4', likes: '902' },
  { id: '5', name: 'Jessica L.', role: 'Cloud Arch', url: '/videos/testimonial-5.mp4', likes: '1.5k' },
  { id: '6', name: 'Alex M.', role: 'Cybersec Lead', url: '/videos/testimonial-6.mp4', likes: '3.1k' },
];

// --- Sub-Component: Video Card ---
const VideoCard = ({ 
  video, 
  isPlaying, 
  onTogglePlay 
}: { 
  video: typeof testimonials[0]; 
  isPlaying: boolean; 
  onTogglePlay: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Handle Play/Pause side effects
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {}); // Catch autoplay blocks
        videoRef.current.muted = isMuted;
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div 
      className={cn(
        "relative flex-shrink-0 w-[260px] h-[460px] rounded-3xl overflow-hidden transition-all duration-500 border border-zinc-800 bg-zinc-900 group",
        isPlaying ? "shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)] border-orange-500/50 scale-[1.02] z-20" : "hover:border-zinc-700"
      )}
      onClick={onTogglePlay}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.url}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        loop
        playsInline
      />

      {/* Dark Gradient Overlay (Top & Bottom) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {/* UI: Top Right Mute */}
      <button 
        onClick={toggleMute}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-white/20 transition-colors z-30"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* UI: Center Play Button (Only visible when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* UI: Bottom Info (Reels Style) */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
               <h3 className="font-bold text-white text-sm">{video.name}</h3>
               <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 rounded flex items-center gap-0.5">
                 Verified
               </span>
            </div>
            <p className="text-xs text-zinc-400">{video.role}</p>
          </div>
          
          {/* Side Actions */}
          <div className="flex flex-col gap-3 items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-full bg-zinc-800/50 text-white hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-white/80">{video.likes}</span>
            </div>
            <div className="p-2 rounded-full bg-zinc-800/50 text-white hover:text-emerald-500 transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Progress Bar (Fake for UI) */}
        {isPlaying && (
          <div className="w-full h-1 bg-zinc-700 rounded-full mt-4 overflow-hidden">
             <motion.div 
               initial={{ width: "0%" }}
               animate={{ width: "100%" }}
               transition={{ duration: 15, ease: "linear" }}
               className="h-full bg-orange-500" 
             />
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub-Component: Infinite Marquee Row ---
const MarqueeRow = ({ 
  items, 
  direction = "left", 
  speed = 40,
  activeVideoId,
  onVideoClick
}: { 
  items: typeof testimonials, 
  direction?: "left" | "right", 
  speed?: number,
  activeVideoId: string | null,
  onVideoClick: (id: string) => void
}) => {
  const isPaused = activeVideoId !== null;

  return (
    <div className="relative flex overflow-hidden">
      <motion.div
        initial={{ x: direction === "left" ? 0 : "-50%" }}
        animate={{ x: isPaused ? (direction === "left" ? 0 : "-50%") : (direction === "left" ? "-50%" : 0) }}
        // Note: Framer motion doesn't support 'pausing' an infinite loop easily without complex state. 
        // We use CSS class for the actual movement logic to support true pausing.
        className={cn(
          "flex gap-6 py-4 flex-shrink-0",
          !isPaused && (direction === "left" ? "animate-scroll-left" : "animate-scroll-right"),
          isPaused && "animate-none" // Stops scrolling when a video is open
        )}
        style={{ 
          // Custom CSS variable for speed control if you have the tailwind plugin, 
          // otherwise rely on standard classes or inline styles
          animationDuration: `${speed}s` 
        }}
      >
        {/* Quadruple items for smooth looping on wide screens */}
        {[...items, ...items, ...items, ...items].map((video, idx) => (
          <VideoCard 
            key={`${video.id}-${idx}-${direction}`}
            video={video}
            isPlaying={activeVideoId === video.id}
            onTogglePlay={() => onVideoClick(video.id)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default function VideoTestimonials() {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const handleVideoClick = (id: string) => {
    // If clicking the already playing video, pause it (set to null)
    // If clicking a new video, play that one
    setPlayingVideoId(prev => prev === id ? null : id);
  };

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:30px_30px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-full">
        
        {/* --- Header --- */}
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-purple-400 mb-4"
          >
            <Sparkles className="w-3 h-3" />
            <span>REAL RESULTS</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4"
          >
            Real Professionals, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Real Stories</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400"
          >
            Tap on any card to hear their journey.
          </motion.p>
        </div>

        {/* --- Marquee Section --- */}
        <div className="space-y-6 relative">
           {/* Side Fade Masks */}
           <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
           <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />

           {/* Row 1: Left Scroll */}
           <MarqueeRow 
             items={testimonials} 
             direction="left" 
             speed={60} 
             activeVideoId={playingVideoId}
             onVideoClick={handleVideoClick}
           />
           
           {/* Row 2: Right Scroll (Hidden on mobile to save space, visible on MD+) */}
           <div className="hidden md:block">
            <MarqueeRow 
              items={[...testimonials].reverse()} // Reverse order for variety
              direction="right" 
              speed={70} 
              activeVideoId={playingVideoId}
              onVideoClick={handleVideoClick}
            />
           </div>
        </div>

      </div>
    </section>
  );
}