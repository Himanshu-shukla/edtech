import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function VideoTestimonials() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<any>(null);

  const videos = [
    { id: '1', url: '/videos/testimonial-1.mp4' },
    { id: '2', url: '/videos/testimonial-2.mp4' },
    { id: '3', url: '/videos/testimonial-3.mp4' },
    { id: '4', url: '/videos/testimonial-4.mp4' },
    { id: '5', url: '/videos/testimonial-5.mp4' },
    { id: '6', url: '/videos/testimonial-6.mp4' },
  ];

  // GSAP horizontal loop setup
  useGSAP(() => {
    if (!containerRef.current) return;

    const items = gsap.utils.toArray('.video-card');
    
    const loop = horizontalLoop(items, {
      repeat: -1,
      speed: 0.5,
      paddingRight: 16, // gap between items
      paused: false
    });

    loopRef.current = loop;

    return () => {
      loop.kill();
    };
  }, { scope: containerRef });

  // Pause/resume loop based on playing state
  useEffect(() => {
    if (loopRef.current) {
      if (playingVideo) {
        loopRef.current.pause();
      } else {
        loopRef.current.play();
      }
    }
  }, [playingVideo]);

  // GSAP horizontalLoop helper function
  function horizontalLoop(items: any[], config: any) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => { 
        tl.totalTime(tl.rawTime() + tl.duration() * 100);
      }
    });
    let length = items.length;
    let startX = items[0].offsetLeft;
    let times: number[] = [];
    let widths: number[] = [];
    let xPercents: number[] = [];
    let curIndex = 0;
    let pixelsPerSecond = (config.speed || 1) * 100;
    let snap = config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap || 1);
    let totalWidth: number;
    let curX: number;
    let distanceToStart: number;
    let distanceToLoop: number;
    let item: HTMLElement;
    let i: number;

    gsap.set(items, {
      xPercent: (i, el) => {
        let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string));
        xPercents[i] = snap(
          (parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
            (gsap.getProperty(el, "xPercent") as number)
        );
        return xPercents[i];
      }
    });

    gsap.set(items, { x: 0 });

    totalWidth =
      items[length - 1].offsetLeft +
      (xPercents[length - 1] / 100) * widths[length - 1] -
      startX +
      items[length - 1].offsetWidth *
        (gsap.getProperty(items[length - 1], "scaleX") as number) +
      (parseFloat(config.paddingRight) || 0);

    for (i = 0; i < length; i++) {
      item = items[i];
      curX = (xPercents[i] / 100) * widths[i];
      distanceToStart = item.offsetLeft + curX - startX;
      distanceToLoop = distanceToStart + widths[i] * (gsap.getProperty(item, "scaleX") as number);
      tl.to(
        item,
        {
          xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
          duration: distanceToLoop / pixelsPerSecond
        },
        0
      )
        .fromTo(
          item,
          {
            xPercent: snap(
              ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
            )
          },
          {
            xPercent: xPercents[i],
            duration:
              (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false
          },
          distanceToLoop / pixelsPerSecond
        )
        .add("label" + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond;
    }

    function toIndex(index: number, vars?: any) {
      vars = vars || {};
      Math.abs(index - curIndex) > length / 2 &&
        (index += index > curIndex ? -length : length);
      let newIndex = gsap.utils.wrap(0, length, index);
      let time = times[newIndex];
      if (time > tl.time() !== index > curIndex) {
        vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }
      curIndex = newIndex;
      vars.overwrite = true;
      return tl.tweenTo(time, vars);
    }

    tl.next = (vars?: any) => toIndex(curIndex + 1, vars);
    tl.previous = (vars?: any) => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index: number, vars?: any) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true);

    if (config.reversed) {
      tl.vars.onReverseComplete!();
      tl.reverse();
    }

    return tl;
  }

  const handlePlay = (videoId: string) => {
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      if (playingVideo === videoId) {
        // Pause this video
        videoElement.pause();
        setPlayingVideo(null);
      } else {
        // Pause all other videos
        Object.entries(videoRefs.current).forEach(([id, video]) => {
          if (video && id !== videoId) {
            video.pause();
          }
        });
        // Play selected video
        videoElement.play().catch(err => console.log('Play error:', err));
        setPlayingVideo(videoId);
      }
    }
  };

  return (
    <section className="py-8 md:py-12 relative overflow-hidden bg-white">
      <div className="w-full mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="badge-hero mx-auto w-max">
            <span>📱</span>
            <span>VIDEO TESTIMONIALS</span>
          </div>
          <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900">
            Real Professionals, Real <span className="text-edtech-orange font-extrabold">Results</span>
          </h2>
          <p className="mt-4 text-gray-800 max-w-3xl mx-auto font-semibold">
            Watch how our learners transformed their <span className="text-edtech-blue font-bold">careers</span> and achieved <span className="text-edtech-orange font-bold">success</span>
          </p>
        </motion.div>

        {/* Video Reels Grid */}
        <div className="relative overflow-hidden">
          <div 
            ref={containerRef}
            className="flex gap-4 px-4 pb-4"
          >
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex-shrink-0 video-card"
              style={{ willChange: 'transform' }}
            >
              <div className="relative">
                {/* Portrait Video Container */}
                <div className="relative w-[280px] h-[480px] rounded-3xl overflow-hidden bg-black shadow-2xl">
                  <video
                    ref={(el) => { videoRefs.current[video.id] = el; }}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectFit: 'cover', minWidth: '100%', minHeight: '100%' }}
                    src={video.url}
                    playsInline
                    muted={playingVideo !== video.id}
                    preload="metadata"
                    onClick={() => handlePlay(video.id)}
                  />
                  
                  {/* Play Button Overlay (shows when not playing) */}
                  {playingVideo !== video.id && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                      onClick={() => handlePlay(video.id)}
                    >
                      <Play className="w-12 h-12 text-white fill-white" />
                    </div>
                  )}

                  {/* Border Effect */}
                  <div className="absolute inset-0 rounded-3xl ring-2 ring-purple-400/50 pointer-events-none" />
                </div>

                {/* Tap to Play Text */}
                {playingVideo !== video.id && (
                  <p className="text-center mt-3 text-sm text-gray-600 font-medium">
                    Tap to play ▶
                  </p>
                )}
              </div>
            </div>
          ))}
          </div>
          
          {/* Gradient Overlays for visual effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </section>
  );
}

