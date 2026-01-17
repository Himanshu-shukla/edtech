'use client';

import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { VIDEO_CONFIG } from '@/config/video';

interface VideoSectionProps {
  onApplyNow: () => void;
}

export default function VideoSection({ onApplyNow }: VideoSectionProps) {
  // Don't render anything if video is not enabled
  if (!VIDEO_CONFIG.enabled) {
    return null;
  }

  return (
    <section id="demo" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Watch the <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Program Preview</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {VIDEO_CONFIG.description}
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="rounded-xl overflow-hidden shadow-xl bg-black">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {VIDEO_CONFIG.type === 'vimeo' ? (
                <iframe
                  src={`${VIDEO_CONFIG.url}?title=0&byline=0&portrait=0`}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ border: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={VIDEO_CONFIG.title}
                />
              ) : (
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  controls
                  controlsList="nodownload"
                >
                  <source src={VIDEO_CONFIG.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onApplyNow}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all inline-flex items-center space-x-2"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}